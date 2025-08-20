// services/spotifyService.js
const axios = require('axios');
const { access } = require('fs');
const querystring = require('querystring');

// Esta función no es una ruta, solo construye la URL de login
const getLoginUrl = (clientId, redirectUri) => {
    const scope = 'playlist-read-private user-library-read user-top-read';
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

    // --- LA LÓGICA DE getAppSpotifyToken FUE MOVIDA FUERA DE AQUÍ ---

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

 const getTopGenre = async (accessToken) =>{

        const topArtists = await getUserTopItems(accessToken,'artists','short_term');
        if(!topArtists || topArtists.length === 0 ){
            return 'No disponible';
        }
        const genreCounts = {};
        topArtists.forEach(artist =>{
            artist.genres.forEach(genre => {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            });
        });

        let topGnere = 'Nunguno';
        let maxCount = 0;
        
        for(const genre in genreCounts){
            if(genreCounts[genre]>maxCount){
                maxCount = genreCounts[genre];
                topGnere = genre;
            }
        }
        return topGnere;
    };
//
const getUserTopItems = async(accessToken, type, timeRange='long_term') =>{
    const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`,{
        headers : { 'Authorization': `Bearer ${accessToken}` },
         params: {
            time_range: timeRange, // 'short_term', 'medium_term', o 'long_term'
            limit: 50 
        }
    });
    return response.data.items;
} 


const getAppSpotifyToken = async (clientId, clientSecret) => {
    
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

const analyzeTracks = async (spotifyToken, tracks) => {
    const artistIds = new Set();

    for (const track of tracks) {
        try {
            const query = `track:${track.title} artist:${track.artist}`;
            const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
                headers: { 'Authorization': `Bearer ${spotifyToken}` },
                params: { q: query, type: 'track', limit: 1 }
            });

            if (searchResponse.data.tracks.items.length > 0) {
                const foundTrack = searchResponse.data.tracks.items[0];
                foundTrack.artists.forEach(artist => artistIds.add(artist.id));
            }
        } catch (error) {
            console.error(`No se pudo buscar la canción: ${track.title}`);
        }
    }
    

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


// Exportamos las funciones para que el "Gerente" (server.js) pueda usarlas
module.exports = {
    getLoginUrl,
    getUserPlaylists,
    getPlaylistGenres,
    getAppSpotifyToken,
    analyzeTracks,
    getUserTopItems,
    getTopGenre
};