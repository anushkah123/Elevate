const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    type: { type: String },
    subtopic: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
