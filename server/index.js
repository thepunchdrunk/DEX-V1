const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const app = express();
const port = 3001;

// Helper to load env
const loadEnv = () => {
    // Try loading .env.local first (common in Vite/Next apps)
    if (fs.existsSync('.env.local')) {
        dotenv.config({ path: '.env.local' });
    } else {
        dotenv.config(); // Fallback to .env
    }
};
loadEnv();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY not found in environment variables.");
    console.error("Please create a .env or .env.local file with GEMINI_API_KEY or VITE_GEMINI_API_KEY");
} else {
    console.log("✅ Gemini API Key found.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, schema } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const generationConfig = {};
        if (schema) {
            generationConfig.responseMimeType = "application/json";
            generationConfig.responseSchema = schema;
        }

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig
        });

        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
