const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Tell the computer to serve your pretty YouTube look
app.use(express.static(path.join(__dirname, 'public')));

// The secret tunnel that grabs video data safely
app.get('/api/search', async (req, res) => {
    try {
        // We use an open Invidious engine to safely get the video list
        const response = await axios.get(`https://puffyan.us{req.query.q}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Oops, could not grab videos!" });
    }
});

app.listen(PORT, () => console.log(`Your secret tube is running on port ${PORT}`));
