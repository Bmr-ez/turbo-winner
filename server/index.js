const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Explicit headers for AE compatibility
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `You are an After Effects expert. Generate Adobe ExtendScript (JSX).
Wrap code in <SCRIPT> tags. If just chatting, don't use tags.
Assume 'app.project' is available.`;

app.get('/', (req, res) => {
    res.send('Gemini AE Backend is running!');
});

app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', model: 'gemini-3-flash-preview' });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API Key not configured on server' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(SYSTEM_PROMPT + "\n\nUser: " + prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
