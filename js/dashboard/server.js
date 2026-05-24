const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

// 1. INITIALIZE FIREBASE ADMIN
// IMPORTANT: You must download your service account key from the Firebase Console:
// Project Settings > Service Accounts > Generate new private key.
// Save it as 'serviceAccountKey.json' inside the /server folder.
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();
app.use(cors());
app.use(express.json());

/* =============================================
   AUTH MIDDLEWARE
============================================= */
// This verifies the Firebase ID Token sent from the frontend headers
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token)
    return res.status(401).json({ error: "No authentication token provided" });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

/* =============================================
   DATA RETRIEVAL ENDPOINTS
============================================= */

// Protected Endpoint: Get all users (Admin only)
app.get("/api/users", authenticate, async (req, res) => {
  try {
    // Admin guard check using your designated admin email
    if (req.user.email !== "eemadanyel@gmail.com") {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }

    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to retrieve user data" });
  }
});

/* =============================================
   INIT
============================================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Prep Portal Backend listening on port ${PORT}`),
);
