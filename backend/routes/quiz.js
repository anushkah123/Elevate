const express = require('express');
const router = express.Router();
const { generateQuiz, generateAdaptivePractice } = require('../services/nvidiaService');

// POST /api/quiz/generate
router.post('/generate', async (req, res) => {
  try {
    const { topic, questionCount = 10, difficulty = 'medium', format = 'mcq', fileContent } = req.body;

    if (!topic || topic.trim().length < 2) {
      return res.status(400).json({ error: 'Topic is required (min 2 characters)' });
    }
    if (questionCount < 1 || questionCount > 30) {
      return res.status(400).json({ error: 'Question count must be between 1 and 30' });
    }

    console.log(`Generating quiz: topic="${topic}", count=${questionCount}, difficulty=${difficulty}, format=${format}`);

    const quiz = await generateQuiz({ topic, questionCount, difficulty, format, fileContent });
    res.json({ success: true, quiz });
  } catch (err) {
    console.error('Quiz generation error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate quiz' });
  }
});

// POST /api/quiz/adaptive
router.post('/adaptive', async (req, res) => {
  try {
    const { weakTopics, originalTopic, difficulty } = req.body;

    if (!weakTopics || !weakTopics.length) {
      return res.status(400).json({ error: 'weakTopics array is required' });
    }

    const result = await generateAdaptivePractice({ weakTopics, originalTopic, difficulty });
    res.json({ success: true, questions: result.questions });
  } catch (err) {
    console.error('Adaptive practice error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate practice questions' });
  }
});

module.exports = router;
