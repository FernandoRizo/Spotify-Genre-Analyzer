// services/youtubeService.js
const axios = require('axios');

const getPlaylists = async (accessToken) => {
    const url = 'https://www.googleapis.com/youtube/v3/playlists';
    const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: {
            part: 'snippet',
            mine: true,
            maxResults: 50
        }
    });
    return response.data.items;
};

const getPlaylistItems = async (accessToken, playlistId) => {
    const url = 'https://www.googleapis.com/youtube/v3/playlistItems';
    let allTracks = [];
    let nextPageToken = undefined;

    do {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: {
                part: 'snippet',
                playlistId: playlistId,
                maxResults: 50,
                pageToken: nextPageToken
            }
        });
        allTracks.push(...response.data.items);
        nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    return allTracks.map(item => ({
        title: item.snippet.title,
        artist: item.snippet.videoOwnerChannelTitle
    }));
};
module.exports = {
    getPlaylists,
    getPlaylistItems
};