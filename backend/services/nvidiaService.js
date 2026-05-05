const axios = require('axios');

const NVIDIA_NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const MODEL = 'meta/llama-3.3-70b-instruct'; // You can switch to any NIM model

async function generateQuiz({ topic, questionCount, difficulty, format, fileContent }) {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_NIM_API_KEY not configured');

  const formatInstructions = {
    mcq: 'multiple choice with exactly 4 options (A, B, C, D)',
    truefalse: 'true/false questions',
    shortanswer: 'short answer questions',
    mixed: 'a mix of multiple choice (60%), true/false (20%), and short answer (20%)',
  };

  const sourceText = fileContent
    ? `Based on this content:\n\n${fileContent.slice(0, 3000)}\n\nTopic: ${topic}`
    : `Topic: ${topic}`;

  const prompt = `You are an expert quiz generator. Generate exactly ${questionCount} ${difficulty} difficulty quiz questions as ${formatInstructions[format] || formatInstructions.mcq}.

${sourceText}

Return ONLY valid JSON in this exact structure (no markdown, no explanation):
{
  "title": "Quiz title here",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Brief explanation why this is correct.",
      "subtopic": "Subtopic name"
    }
  ]
}

For true/false: options = ["True", "False"], type = "truefalse"
For short answer: options = [], type = "shortanswer", correctAnswer = "expected answer"
Ensure all ${questionCount} questions are unique, educational, and at ${difficulty} difficulty.`;

  try {
    console.time('nvidia-api');
    const response = await axios.post(
      `${NVIDIA_NIM_BASE_URL}/chat/completions`,
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
      }
    );
    console.timeEnd('nvidia-api');

    const content = response.data.choices[0].message.content;
    const cleaned = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Validate structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid quiz structure from AI');
    }

    return parsed;
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if (status === 401) throw new Error('Invalid NVIDIA NIM API key');
      if (status === 429) throw new Error('NVIDIA NIM rate limit exceeded');
      throw new Error(`NVIDIA NIM API error: ${err.response.data?.detail || err.message}`);
    }
    if (err instanceof SyntaxError) throw new Error('AI returned invalid JSON format');
    throw err;
  }
}

async function generateAdaptivePractice({ weakTopics, originalTopic, difficulty }) {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_NIM_API_KEY not configured');

  const prompt = `Generate 5 targeted practice questions to help a student improve on their weak areas.

Subject: ${originalTopic}
Weak subtopics: ${weakTopics.join(', ')}
Difficulty: ${difficulty || 'medium'}

Return ONLY valid JSON (no markdown):
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "Question targeting the weak area?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Detailed explanation to reinforce learning.",
      "subtopic": "Specific subtopic"
    }
  ]
}`;

  const response = await axios.post(
    `${NVIDIA_NIM_BASE_URL}/chat/completions`,
    {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 45000,
    }
  );

  const content = response.data.choices[0].message.content;
  const cleaned = content.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { generateQuiz, generateAdaptivePractice };
