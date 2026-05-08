const admin = require('firebase-admin');

// Service account can be passed as a JSON string in environment variables for security
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✅ Firebase Admin initialized successfully');
} else {
  console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT not found in environment. Firestore features will be disabled.');
}

const db = serviceAccount ? admin.firestore() : null;

module.exports = db;
