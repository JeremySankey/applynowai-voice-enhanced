const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.raw({ type: 'audio/webm', limit: '10mb' }));
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });
  
    console.log("🧠 OpenAI response:", completion);
    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
  
});

const axios = require('axios'); // if not already at top

app.post('/transcribe', async (req, res) => {
  try {
    console.log("📥 Received audio at /transcribe");

    const audioBuffer = req.body; // raw binary
    const deepgramResponse = await axios.post(
      'https://api.deepgram.com/v1/listen',
      audioBuffer,
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'audio/webm',
          'dg-language': 'en-US'
        }
      }
    );

    res.json(deepgramResponse.data);
  } catch (err) {
    console.error('❌ Deepgram Error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
  
});

app.use((req, res) => {
    console.log(`⚠️ Unknown route hit: ${req.method} ${req.originalUrl}`);
    res.status(404).send("Route not found");
  });
  

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
