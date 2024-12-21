import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 8080;

const CLIENT_ID = 'GH_K4D5dw9Znl3jMrlpwuQ';
const CLIENT_SECRET = 'mxm27ds5YrM4f06aoSQ1nb-A-4nxag';
const REDIRECT_URI = 'http://localhost:8080/callback';

app.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        res.send('Error: No code received');
        return;
    }

    try {
        // Exchange code for tokens
        const response = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code as string,
                redirect_uri: REDIRECT_URI
            })
        });

        const data = await response.json();

        console.log('Refresh Token:', data.refresh_token);
        console.log('Access Token:', data.access_token);

        res.send('Authorization successful! Check your console for the tokens.');
    } catch (error) {
        console.error('Error:', error);
        res.send('Error exchanging code for tokens');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});