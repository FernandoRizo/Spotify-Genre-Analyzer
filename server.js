require('dotenv').config();
// ----------- IMPORTS ---------------------------------------
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const Comment = require('./models/comment.js'); 
const session = require('express-session');
const querystring = require('querystring');
const spotifyService = require('./services/spotifyService.js');
const youtubeService = require('./services/youtubeService.js');
// -------------------------------------------------------------

const app = express();
const PORT = 3000;

let SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI;
let YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI;

if (process.env.NODE_ENV === 'production') {
    SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
    
    YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
    YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
    YOUTUBE_REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI;
} else {
    const credentials = require('./credentials.json');
    
    SPOTIFY_CLIENT_ID = credentials.spotify.clientId;
    SPOTIFY_CLIENT_SECRET = credentials.spotify.clientSecret;
    SPOTIFY_REDIRECT_URI = credentials.spotify.redirectUri;

    YOUTUBE_CLIENT_ID = credentials.youtube.clientId;
    YOUTUBE_CLIENT_SECRET = credentials.youtube.clientSecret;
    YOUTUBE_REDIRECT_URI = credentials.youtube.redirectUri;
}
//----Conectar con Mongo -----
const dbUrl = process.env.NODE_ENV === 'production' 
    ? process.env.DATABASE_URL 
    : require('./credentials.json').database.connectionString;

mongoose.connect(dbUrl)
    .then(() => console.log("Conectado a MongoDB Atlas exitosamente."))
    .catch(err => console.error("Error al conectar a MongoDB:", err));

app.get('/api/comments', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
});

app.post('/api/comments', async (req, res) => {
    try {
        const newComment = new Comment({
            author: req.body.author,
            text: req.body.text
        });
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el comentario' });
    }
});

//--Middleware--
app.use(session({
    secret: 'frase_secreta_para_la_sesion_12345',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// --- RUTAS DE AUTENTICACIÓN ---

app.get('/login', (req, res) => {
    // CORRECCIÓN: Usar las variables específicas de Spotify
    const loginUrl = spotifyService.getLoginUrl(SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI);
    res.redirect(loginUrl);
});

app.get('/login/youtube', (req, res) => {
    const scope = 'https://www.googleapis.com/auth/youtube.readonly';
    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
    querystring.stringify({
        client_id: YOUTUBE_CLIENT_ID,
        redirect_uri: YOUTUBE_REDIRECT_URI,
        response_type: 'code',
        scope: scope,
        access_type: 'offline'
    });
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                // CORRECCIÓN: Usar la variable específica de Spotify
                redirect_uri: SPOTIFY_REDIRECT_URI
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // CORRECCIÓN: Usar las variables específicas de Spotify
                'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'))
            }
        });
        
        req.session.accessToken = response.data.access_token;
        req.session.refreshToken = response.data.refresh_token;

        res.redirect('/');
    } catch (error) {
        res.send("Hubo un error durante la autenticación de Spotify.");
        console.error("Error en /callback:", error.response ? error.response.data : error.message);
    }
});

app.get('/callback/youtube', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await axios({
            method: 'post',
            url: 'https://oauth2.googleapis.com/token',
            data: querystring.stringify({
                code: code,
                client_id: YOUTUBE_CLIENT_ID,
                client_secret: YOUTUBE_CLIENT_SECRET,
                redirect_uri: YOUTUBE_REDIRECT_URI,
                grant_type: 'authorization_code'
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        
        req.session.youtubeAccessToken = response.data.access_token;
        res.redirect('/');
    } catch (error) {
        res.send("Hubo un error durante la autenticación de YouTube.");
        console.error("Error en /callback/youtube", error.response ? error.response.data : error.message);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// --- RUTAS DE LA APLICACIÓN ---

app.get('/check-session', (req, res) => {
    if (req.session.accessToken) {
        res.json({ loggedIn: true, service: 'spotify' });
    } else if (req.session.youtubeAccessToken) {
        res.json({ loggedIn: true, service: 'youtube' });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/get-my-playlists', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Usuario no autenticado con Spotify' });
    }
    try {
        const playlists = await spotifyService.getUserPlaylists(req.session.accessToken);
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener playlists de Spotify' });
    }
});

app.get('/get-my-youtube-playlists', async (req, res) => {
    if (!req.session.youtubeAccessToken) {
        return res.status(401).json({ error: 'Usuario no autenticado con YouTube' });
    }
    try {
        const playlists = await youtubeService.getPlaylists(req.session.youtubeAccessToken);
        res.json(playlists);
    } catch (error) {
        console.error("Error detallado de la API de YouTube:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al obtener playlists de YouTube' });
    }
});

app.get('/get-youtube-playlist-items', async (req, res) => {
    if (!req.session.youtubeAccessToken) {
        return res.status(401).json({ error: 'No autenticado con YouTube' });
    }
    try {
        const playlistId = req.query.id;
        const tracks = await youtubeService.getPlaylistItems(req.session.youtubeAccessToken, playlistId);
        res.json(tracks);
    } catch (error) {
        console.error("Error al obtener items de playlist de YouTube:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al obtener las canciones de la playlist' });
    }
});

app.post('/analyze-youtube-playlist', async (req, res) => {
    const { tracks } = req.body;
    try {
        // Ahora le pasamos las credenciales a la función
        const spotifyToken = await spotifyService.getAppSpotifyToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);

        const analysisResults = await spotifyService.analyzeTracks(spotifyToken, tracks);
        res.json(analysisResults);
    } catch (error) {
        console.error("Error detallado al analizar playlist de YouTube:", error.response ? error.response.data : error);
        res.status(500).json({ error: 'Error al analizar la playlist con Spotify' });
    }
});

app.get('/get-genres', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Usuario no autenticado con Spotify' });
    }
    try {
        const data = await spotifyService.getPlaylistGenres(req.session.accessToken, req.query.id);
        res.json(data);
    } catch (error) {
        console.error("Error al procesar la playlist de Spotify:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al comunicarse con Spotify' });
    }
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = app;