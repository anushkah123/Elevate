const db = require('./firebase');

module.exports = {
  // User operations
  findUserByEmail: async (email) => {
    if (!db) return null;
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  findUserById: async (id) => {
    if (!db) return null;
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  saveUser: async (user) => {
    if (!db) throw new Error('Firestore not initialized');
    const docRef = await db.collection('users').add(user);
    return { id: docRef.id, ...user };
  },

  // Quiz operations
  saveQuiz: async (quiz) => {
    if (!db) throw new Error('Firestore not initialized');
    const newQuiz = { 
      ...quiz, 
      createdAt: new Date().toISOString() 
    };
    const docRef = await db.collection('quizzes').add(newQuiz);
    return { id: docRef.id, ...newQuiz };
  },

  getQuizzesByUserId: async (userId) => {
    if (!db) return [];
    const snapshot = await db.collection('quizzes')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

