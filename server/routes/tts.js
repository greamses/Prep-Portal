/**
 * TTS proxy route — Google Cloud Text-to-Speech, key stays server-side.
 *
 * POST /api/tts/synthesize
 *   Body: { text, ssml?, voice?, languageCode?, speakingRate?, pitch? }
 *   Returns: { audioContent: "<base64 MP3>", audioEncoding: "MP3" }
 *
 * Auth: credentials are read from env in this priority order —
 *   1. GOOGLE_CLOUD_CREDENTIALS  (JSON string — use on Vercel)
 *   2. ./googleCloudKey.json     (local dev file, same project or separate)
 *   3. ./serviceAccountKey.json  (Firebase SA — works if TTS API is enabled
 *                                 on the same Google Cloud project)
 */

const express = require("express");
const textToSpeech = require("@google-cloud/text-to-speech");
const { authenticate } = require("../middleware/auth");

const MAX_CHARS = 5000;

module.exports = function () {
  const router = express.Router();

  // Lazily created so the server still starts even if TTS is unconfigured.
  let _client = null;

  function getClient() {
    if (_client) return _client;

    if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
      _client = new textToSpeech.TextToSpeechClient({
        credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS),
      });
      return _client;
    }

    // Local dev: dedicated Google Cloud key file
    try {
      const key = require("../googleCloudKey.json");
      _client = new textToSpeech.TextToSpeechClient({ credentials: key });
      return _client;
    } catch (_) {}

    // Fallback: Firebase service account (same GCP project, TTS API enabled)
    try {
      const sa = require("../serviceAccountKey.json");
      _client = new textToSpeech.TextToSpeechClient({ credentials: sa });
      return _client;
    } catch (_) {}

    // Last resort: ADC via GOOGLE_APPLICATION_CREDENTIALS env var
    _client = new textToSpeech.TextToSpeechClient();
    return _client;
  }

  // ── POST /api/tts/synthesize ──────────────────────────────────────
  router.post("/synthesize", authenticate, async (req, res) => {
    try {
      const {
        text,
        ssml,
        voice = "en-US-Neural2-F",
        languageCode = "en-US",
        speakingRate = 1.0,
        pitch = 0.0,
      } = req.body;

      if (!text && !ssml) {
        return res.status(400).json({ error: "text or ssml is required." });
      }

      const input = text || ssml;
      if (typeof input !== "string" || input.trim().length === 0) {
        return res.status(400).json({ error: "text must be a non-empty string." });
      }
      if (input.length > MAX_CHARS) {
        return res.status(400).json({ error: `text too long (max ${MAX_CHARS} chars).` });
      }

      const synthesisInput = ssml ? { ssml } : { text };

      const [response] = await getClient().synthesizeSpeech({
        input: synthesisInput,
        voice: { languageCode, name: voice },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: Math.min(Math.max(Number(speakingRate) || 1.0, 0.25), 4.0),
          pitch: Math.min(Math.max(Number(pitch) || 0.0, -20.0), 20.0),
        },
      });

      res.json({
        audioContent: Buffer.from(response.audioContent).toString("base64"),
        audioEncoding: "MP3",
      });
    } catch (err) {
      console.error("[/api/tts/synthesize]", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ── GET /api/tts/voices — list available voices ───────────────────
  router.get("/voices", authenticate, async (req, res) => {
    try {
      const { languageCode = "en-US" } = req.query;
      const [result] = await getClient().listVoices({ languageCode });
      const voices = (result.voices || [])
        .map((v) => ({
          name: v.name,
          languageCodes: v.languageCodes,
          ssmlGender: v.ssmlGender,
          naturalSampleRateHertz: v.naturalSampleRateHertz,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      res.json({ voices });
    } catch (err) {
      console.error("[/api/tts/voices]", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
