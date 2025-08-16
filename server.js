require('dotenv').config();

const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const querystring = require('querystring');

// --- IMPORTAR SERVICIOS ---
const spotifyService = require('./services/spotifyService');
const youtubeService = require('./services/youtubeService');

const app = express();
const PORT = 3000;

// --- VARIABLES DE ENTORNO ---
// SPOTIFY
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
//YOUTUBE
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;

// --- MIDDLEWARE ---
app.use(session({
    secret: 'frase_secreta_para_la_sesion_12345',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS DE AUTENTICACIÓN ---

//login de Spotify
app.get('/login', (req, res) => {
    // El gerente le pide la URL de login al especialista de Spotify
    const loginUrl = spotifyService.getLoginUrl(CLIENT_ID, REDIRECT_URI);
    res.redirect(loginUrl);
});

app.get('/login/youtube', (req,res) => {
    // Login de YouTube
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    querystring.stringify({
            client_id: YOUTUBE_CLIENT_ID,
            redirect_uri: YOUTUBE_REDIRECT_URI,
            response_type: 'code',
            scope: scope,
            access_type: 'offline' // Para poder obtener un refresh token
        });
    
    res.redirect(authUrl);  
});

app.get('/callback', async (req, res) => {
    // Esta ruta es más compleja y se comunica directamente con el endpoint de token,
    // así que por ahora la dejamos en el server.js principal.
    const code = req.query.code || null;
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            }
        });
        
        req.session.accessToken = response.data.access_token;
        req.session.refreshToken = response.data.refresh_token;

        res.redirect('/');
    } catch (error) {
        res.send("Hubo un error durante la autenticación.");
        console.error("Error en /callback:", error.response ? error.response.data : error.message);
    }
});

app.get('/callback/youtube', async(req, res) => {
    const code = req.query.code || null;
    try{
        const response = await axios({
             method: 'post',
            url: 'https://oauth2.googleapis.com/token',
            data: querystring.stringify({
                code: code,
                client_id: YOUTUBE_CLIENT_ID,
                client_secret: YOUTUBE_CLIENT_SECRET,
                redirect_uri: YOUTUBE_REDIRECT_URI,
                grant_type: 'authorization_code'}),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
        })
        //Guardar Token de YouTube
        req.session.youtubeAccessToken = response.data.access_token;
        res.redirect('/');

    }catch(error){
        res.send("Hubo un error durante la autenticación");
        console.error("Errrir en /callback",error.response ? error.response.data : error.message);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// --- RUTAS DE LA APLICACIÓN ---

// server.js
app.get('/check-session', (req, res) => {
    if (req.session.accessToken) {
        // Si hay un token de Spotify, informa que el servicio es 'spotify'
        res.json({ loggedIn: true, service: 'spotify' });
    } else if (req.session.youtubeAccessToken) {
        // Si hay un token de YouTube, informa que el servicio es 'youtube'
        res.json({ loggedIn: true, service: 'youtube' });
    } else {
        res.json({ loggedIn: false });
    }
});

//Plylist de Spotify
app.get('/get-my-playlists', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    try {
        const playlists = await spotifyService.getUserPlaylists(req.session.accessToken);
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener playlists' });
    }
});

//Playlist de YouTube
app.get('/get-youtube-playlist-items', async (req, res) => {
    if (!req.session.youtubeAccessToken) {
        return res.status(401).json({ error: 'No autenticado con YouTube' });
    }
    try {
        const tracks = await youtubeService.getPlaylistItems(req.session.youtubeAccessToken, req.query.id);
        res.json(tracks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener canciones de la playlist de YouTube' });
    }
});

// Ruta para analizar las canciones de YouTube usando la API de Spotify
app.post('/analyze-youtube-playlist', async (req, res) => {
    const { tracks } = req.body;
    try {
        // Esta es la lógica del "investigador" que se autentica por sí mismo
        const spotifyToken = await spotifyService.getAppSpotifyToken(); // Necesitarás añadir esta función a tu spotifyService.js
        
        const analysisResults = await spotifyService.analyzeTracks(spotifyToken, tracks);
        res.json(analysisResults);
    } catch (error) {
        res.status(500).json({ error: 'Error al analizar la playlist con Spotify' });
    }
});

app.get('/get-genres', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    try {
        const data = await spotifyService.getPlaylistGenres(req.session.accessToken, req.query.id);
        res.json(data);
    } catch (error) {
        console.error("Error al procesar la playlist:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al comunicarse con Spotify' });
    }
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = app;