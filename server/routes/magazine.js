/**
 * POST /api/magazine/upload
 *
 * Accepts a raw PDF blob from the browser generator tool,
 * uploads it to Firebase Storage, stores the download URL in
 * Firestore at config/magazine, and returns the URL.
 *
 * Using a custom download token avoids the need for public-read
 * bucket ACLs while still producing a permanent, shareable URL
 * identical in format to what the Firebase client SDK returns.
 */

const express = require("express");
const admin   = require("firebase-admin");
const crypto  = require("crypto");

module.exports = function (db) {
  const router = express.Router();

  router.post(
    "/upload",
    express.raw({ type: "application/pdf", limit: "30mb" }),
    async (req, res) => {
      if (!req.body || !req.body.length) {
        return res.status(400).json({ error: "No PDF body received." });
      }

      try {
        // Explicitly name the bucket — avoids relying solely on initializeApp config
        const BUCKET   = process.env.STORAGE_BUCKET || "prep-portal-2026.appspot.com";
        const bucket   = admin.storage().bucket(BUCKET);
        const filePath = "magazine/activity-guide.pdf";
        const file     = bucket.file(filePath);

        // Embed a Firebase-style download token so the URL works without
        // any bucket-level public-read ACL change.
        const token = crypto.randomUUID();

        await file.save(req.body, {
          metadata: {
            contentType: "application/pdf",
            metadata: { firebaseStorageDownloadTokens: token },
          },
        });

        const encoded = encodeURIComponent(filePath);
        const pdfUrl  =
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}` +
          `/o/${encoded}?alt=media&token=${token}`;

        await db.collection("config").doc("magazine").set({
          pdfUrl,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("[magazine/upload] uploaded →", pdfUrl);
        res.json({ success: true, pdfUrl });
      } catch (err) {
        console.error("[magazine/upload]", err.message);
        res.status(500).json({ error: err.message });
      }
    }
  );

  return router;
};
