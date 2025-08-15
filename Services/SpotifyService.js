// services/spotifyService.js
const axios = require('axios');
const querystring = require('querystring');

// --- FUNCIONES EXISTENTES ---

const getLoginUrl = (clientId, redirectUri) => {
    const scope = 'playlist-read-private user-library-read';
    return 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
        });
};

const getUserPlaylists = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const playlists = [
        { id: 'liked', name: '❤️ Canciones que te gustan' },
        ...response.data.items
    ];
    return playlists;
};

const getPlaylistGenres = async (accessToken, playlistId) => {
    // ... (esta función se queda exactamente igual que antes)
    const allTracks = [];
    let nextUrl = (playlistId === 'liked')
        ? 'https://api.spotify.com/v1/me/tracks?limit=50'
        : `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;

    while (nextUrl) {
        const response = await axios.get(nextUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        allTracks.push(...response.data.items);
        nextUrl = response.data.next;
    }

    const artistIds = new Set();
    allTracks.forEach(item => {
        if (item && item.track) {
            item.track.artists.forEach(artist => artistIds.add(artist.id));
        }
    });

    if (artistIds.size === 0) {
        return { genreCounts: {}, totalTracks: allTracks.length };
    }
    
    const genreCounts = {};
    const artistIdArray = [...artistIds];

    for (let i = 0; i < artistIdArray.length; i += 50) {
        const batch = artistIdArray.slice(i, i + 50);
        const artistsResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        artistsResponse.data.artists.forEach(artist => {
            artist.genres.forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });
    }
    
    return {
        genreCounts: genreCounts,
        totalTracks: allTracks.length
    };
};

// --- NUEVAS FUNCIONES ---

/**
 * Obtiene un token de acceso para la aplicación (no para un usuario).
 * Usa el flujo de "Client Credentials".
 */
const getAppSpotifyToken = async () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        data: 'grant_type=client_credentials'
    });
    return response.data.access_token;
};

/**
 * Analiza una lista de canciones (de YouTube) para encontrar sus géneros en Spotify.
 * @param {string} spotifyToken - Un token de aplicación obtenido con getAppSpotifyToken.
 * @param {Array<Object>} tracks - Un array de objetos, ej. [{ title: '...', artist: '...' }]
 */
const analyzeTracks = async (spotifyToken, tracks) => {
    const artistIds = new Set();

    // Usamos un bucle for...of para poder usar await dentro
    for (const track of tracks) {
        try {
            const query = `track:${track.title} artist:${track.artist}`;
            const searchResponse = await axios.get('open.spotify.com/artist', {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
                params: {
                    q: query,
                    type: 'track',
                    limit: 1 // Solo nos interesa el resultado más relevante
                }
            });

            if (searchResponse.data.tracks.items.length > 0) {
                const foundTrack = searchResponse.data.tracks.items[0];
                foundTrack.artists.forEach(artist => artistIds.add(artist.id));
            }
        } catch (error) {
            console.error(`No se pudo buscar la canción: ${track.title}`, error.message);
        }
    }

    // El resto de la lógica es idéntica a la de getPlaylistGenres
    if (artistIds.size === 0) {
        return { genreCounts: {}, totalTracks: tracks.length };
    }
    
    const genreCounts = {};
    const artistIdArray = [...artistIds];

    for (let i = 0; i < artistIdArray.length; i += 50) {
        const batch = artistIdArray.slice(i, i + 50);
        const artistsResponse = await axios.get(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`, {
            headers: { 'Authorization': `Bearer ${spotifyToken}` }
        });
        artistsResponse.data.artists.forEach(artist => {
            artist.genres.forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });
    }
    
    return {
        genreCounts: genreCounts,
        totalTracks: tracks.length
    };
};


// Exportamos TODAS las funciones, incluyendo las nuevas
module.exports = {
    getLoginUrl,
    getUserPlaylists,
    getPlaylistGenres,
    getAppSpotifyToken,
    analyzeTracks
};