const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const CLIENT_ID = '1255853786505678869'; // Remplacez par votre Client ID
const CLIENT_SECRET = 'dheSROeH6xLPrLt6n2aB-hVUswp1Vlop'; // Remplacez par votre Client Secret
const REDIRECT_URI = 'http://localhost:3000/callback';

// Servir les fichiers statiques du répertoire "public"
app.use(express.static(path.join(__dirname, 'public')));

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const data = {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code,
    };

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = response.data;
        const userInfo = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // Log the full user info response for debugging
        console.log('User Info Response:', userInfo.data);

        // Redirect to the home page after successful login with username in query
        res.redirect(`/home?username=${encodeURIComponent(userInfo.data.global_name || userInfo.data.username)}`);
    } catch (error) {
        console.error('Erreur lors de la récupération du token:', error.response ? error.response.data : error.message);
        res.send(`Une erreur est survenue lors de la connexion : ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
