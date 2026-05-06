const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

// Initialize database if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], quizzes: [] }, null, 2));
}

const readDB = () => {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = {
  // User operations
  findUserByEmail: (email) => {
    const db = readDB();
    return db.users.find(u => u.email === email);
  },
  findUserById: (id) => {
    const db = readDB();
    return db.users.find(u => u.id === id);
  },
  saveUser: (user) => {
    const db = readDB();
    const newUser = { ...user, id: Date.now().toString() };
    db.users.push(newUser);
    writeDB(db);
    return newUser;
  },

  // Quiz operations
  saveQuiz: (quiz) => {
    const db = readDB();
    const newQuiz = { ...quiz, id: Date.now().toString(), createdAt: new Date().toISOString() };
    db.quizzes.push(newQuiz);
    writeDB(db);
    return newQuiz;
  },
  getQuizzesByUserId: (userId) => {
    const db = readDB();
    return db.quizzes.filter(q => q.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};
