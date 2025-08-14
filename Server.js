// No necesitamos dotenv para esta prueba
require('dotenv').config(); 

const express = require('express');
const axios = require('axios');
const session = require('express-session');
const querystring = require('querystring');
const app = express();
const PORT = 3000;

// --- CONFIGURACIÓN ---
/* Credenciales para que funcione
Una buena práctica es manejar credenciales a parte como un archivo .env.
Esto es para fines prácticos*/
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

// --- MIDDLEWARE ---
app.use(session({
    secret: 'frase_secreta_para_la_sesion_12345', // Cambia esto si quieres
    resave: false,
    saveUninitialized: true
}));

// Servir los archivos del frontend desde la carpeta 'public'
app.use(express.static('public'));

app.get('/test', (req, res) => {
    res.send('¡El servidor está respondiendo correctamente!');
});


// --- RUTAS DE AUTENTICACIÓN ---

app.get('/login', (req, res) => {
    const scope = 'playlist-read-private user-library-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID, 
            scope: scope,
            redirect_uri: REDIRECT_URI,
        }));
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
                redirect_uri: REDIRECT_URI
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) // Usa las constantes
            }
        });
        
        // Guardamos los tokens en la sesión
        req.session.accessToken = response.data.access_token;
        req.session.refreshToken = response.data.refresh_token;

        // Redirigimos al usuario a la página principal después de un login exitoso
        res.redirect('/');

    } catch (error) {
        res.send("Hubo un error durante la autenticación. Revisa la consola del servidor.");
        console.error("Error en /callback:", error.response ? error.response.data : error.message);
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


// --- RUTAS DE LA APLICACIÓN ---

app.get('/check-session', (req, res) => {
    if (req.session.accessToken) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/get-my-playlists', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: { 'Authorization': `Bearer ${req.session.accessToken}` }
        });

        const playlists = [
            { id: 'liked', name: '❤️ Canciones que te gustan' },
            ...response.data.items
        ];

        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener playlists' });
    }
});

app.get('/get-genres', async (req, res) => {
    const playlistId = req.query.id;
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (!playlistId) {
        return res.status(400).json({ error: 'Playlist ID es requerido' });
    }

    try {
        const token = req.session.accessToken;
        const allTracks = []; // Array para guardar TODAS las canciones de TODAS las páginas
        
        // Determinamos la URL inicial dependiendo de si es "Liked Songs" o una playlist normal
        let nextUrl = (playlistId === 'liked')
            ? 'https://api.spotify.com/v1/me/tracks?limit=50'
            : `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

        // Bucle que se ejecuta mientras Spotify nos dé una URL para la siguiente página
        while (nextUrl) {
            console.log(`Pidiendo datos de: ${nextUrl}`); // Log para ver el progreso en la consola
            const response = await axios.get(nextUrl, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            allTracks.push(...response.data.items);
            nextUrl = response.data.next; // Actualizamos a la siguiente URL, o a 'null' si es la última página
        }

        console.log(`Total de canciones encontradas: ${allTracks.length}`);

        // Lista completa de canciones
        const artistIds = new Set();
        allTracks.forEach(item => {
            if (item && item.track) {
                item.track.artists.forEach(artist => artistIds.add(artist.id));
            }
        });

        if (artistIds.size === 0) return res.json({});
        
        // Spotify limita la obtención de artistas a 50 por llamada, así que también paginamos aquí si es necesario
        const genreCounts = {};
        const artistIdArray = [...artistIds];

        for (let i = 0; i < artistIdArray.length; i += 50) {
            const batch = artistIdArray.slice(i, i + 50);
            const artistsResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            artistsResponse.data.artists.forEach(artist => {
                artist.genres.forEach(genre => {
                    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                });
            });
        }
        
        res.json(genreCounts);

    } catch (error) {
        console.error("Error al procesar la playlist:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al comunicarse con Spotify' });
    }
});


// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});