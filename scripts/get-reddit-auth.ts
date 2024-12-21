import { randomBytes } from 'crypto';

// Your Reddit app credentials
const CLIENT_ID = 'GH_K4D5dw9Znl3jMrlpwuQ';
const REDIRECT_URI = 'http://localhost:8080/callback';  // Must match your Reddit app settings

// Generate random state for security
const state = randomBytes(16).toString('hex');

// Define required scopes
const SCOPES = [
    'identity',        // Access basic account information
    'submit',          // Submit posts and comments
    'edit',           // Edit posts and comments
    'vote',           // Vote on posts and comments
    'read'            // Read posts and comments
].join(' ');

// Construct the authorization URL
const authUrl = `https://www.reddit.com/api/v1/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `state=${state}&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `duration=permanent&` +
    `scope=${encodeURIComponent(SCOPES)}`;

console.log('Visit this URL to authorize the app:');
console.log(authUrl);