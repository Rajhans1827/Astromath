import express from 'express';
import { generateDomainAnalysis, chatWithAIAstrologer } from '../gemini-brain.js';

const router = express.Router();

// Generate domain interpretation (Career, Marriage, Daily Horoscope)
router.post('/interpret', async (req, res) => {
  try {
    const { domain, chartData, dailyData } = req.body;

    if (!domain || !chartData) {
      return res.status(400).json({ message: 'Domain and chartData are required' });
    }

    const analysis = await generateDomainAnalysis({ domain, chartData, dailyData });
    return res.status(200).json({ analysis });
  } catch (err) {
    console.error('AI Interpret Error:', err);
    return res.status(500).json({ message: 'Failed to generate AI interpretation', error: err.message });
  }
});

// Conversational Chat with AI Astrologer
router.post('/chat', async (req, res) => {
  try {
    const { question, chartData, history } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }

    const reply = await chatWithAIAstrologer({ question, chartData, history });
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({ message: 'Failed to chat with AI Astrologer', error: err.message });
  }
});

export default router;
