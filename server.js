const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// 1. Search Relay
app.get('/api/search', async (req, res) => {
    try {
        const response = await axios.get(`https://puffyan.us{req.query.q}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
});

// 2. Video Stream Relay (The Bulletproof Tunnel)
app.get('/api/stream', async (req, res) => {
    try {
        const videoId = req.query.id;
        // Your server asks Invidious where the raw, hidden mp4 file is located
        const info = await axios.get(`https://puffyan.us{videoId}`);
        
        // Find the cleanest video stream link available
        const streamUrl = info.data.formatStreams[0].url;

        // Your server fetches the video data bytes
        const videoResponse = await axios({
            method: 'get',
            url: streamUrl,
            responseType: 'stream'
        });

        // Tell your browser that this data is a normal video file
        res.setHeader('Content-Type', 'video/mp4');
        
        // Feed the data straight to your custom on-screen video player
        videoResponse.data.pipe(res);
    } catch (error) {
        res.status(500).send("Could not stream video");
    }
});

app.listen(PORT, () => console.log(`Engine ready on port ${PORT}`));
