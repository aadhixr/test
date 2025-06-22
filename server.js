// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post('/analyze', async (req, res) => {
  const { temperature, humidity, air_quality } = req.body;
  const prompt = `Evaluate the beehive status based on: 
  Temperature: ${temperature}°C, 
  Humidity: ${humidity}%, 
  Air Purity: ${air_quality}%. 
  Provide a short, helpful analysis and suggest if any action is needed.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // You can change to gpt-4 if you have access
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100
    });

    const result = completion.data.choices[0].message.content;
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI backend running on port ${PORT}`));
