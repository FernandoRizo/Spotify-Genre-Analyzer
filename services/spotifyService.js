// services/spotifyService.js
const axios = require('axios');
const querystring = require('querystring');

// Esta función no es una ruta, solo construye la URL de login
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

// Exportamos las funciones para que el "Gerente" (server.js) pueda usarlas
module.exports = {
    getLoginUrl,
    getUserPlaylists,
    getPlaylistGenres
};