const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'QuizGen AI Backend',
    timestamp: new Date().toISOString(),
    nvidia_nim: !!process.env.NVIDIA_NIM_API_KEY,
  });
});

module.exports = router;
