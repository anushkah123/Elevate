const express = require('express');
const router = express.Router();
const { generateQuiz, generateAdaptivePractice } = require('../services/nvidiaService');
const multer = require('multer');
const path = require('path');
const stream = require('stream');

// ── Parsers ──────────────────────────────────────────────────────────────────
const pdfParse  = require('pdf-parse');          // pinned to v1.1.1
const mammoth   = require('mammoth');            // DOCX
const AdmZip    = require('adm-zip');            // PPTX (zip-based XML)
const csv       = require('csv-parser');         // CSV
const Tesseract = require('tesseract.js');       // Images (OCR)

const upload = multer({ storage: multer.memoryStorage() });
const auth   = require('../middleware/auth');
const db     = require('../services/dbService');

// ── Extraction Helpers ────────────────────────────────────────────────────────

/** PDF → text using pdf-parse v1 */
async function extractPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

/** DOCX → text using mammoth */
async function extractDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/** PPTX → text by reading <a:t> tags from every slide XML */
async function extractPptx(buffer) {
  const zip     = new AdmZip(buffer);
  const entries = zip.getEntries();
  let text      = '';

  const slides = entries
    .filter(e => /^ppt\/slides\/slide\d+\.xml$/.test(e.entryName))
    .sort((a, b) => a.entryName.localeCompare(b.entryName));

  for (const slide of slides) {
    const xml     = slide.getData().toString('utf8');
    const matches = xml.match(/<a:t[^>]*>([^<]+)<\/a:t>/g) || [];
    text += matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ') + '\n';
  }
  return text;
}

/** CSV → text (header + rows joined) */
async function extractCsv(buffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const s    = new stream.PassThrough();
    s.end(buffer);
    s.pipe(csv())
      .on('headers', (h) => rows.push(h.join(', ')))
      .on('data', (row) => rows.push(Object.values(row).join(', ')))
      .on('end', () => resolve(rows.join('\n')))
      .on('error', reject);
  });
}

/** Image → text via Tesseract OCR */
async function extractImage(buffer) {
  const result = await Tesseract.recognize(buffer, 'eng', {
    logger: () => {}   // silence progress logs
  });
  return result.data.text;
}

/** Master dispatcher — pick the right parser by extension / mime */
async function extractText(file) {
  const { buffer, originalname, mimetype } = file;
  const ext = path.extname(originalname).toLowerCase();

  console.log(`[FILE]  name="${originalname}"  ext="${ext}"  mime="${mimetype}"  size=${buffer.length}B`);

  let text = '';

  try {
    if (ext === '.pdf' || mimetype === 'application/pdf') {
      text = await extractPdf(buffer);
    } else if (ext === '.docx' || mimetype.includes('wordprocessingml')) {
      text = await extractDocx(buffer);
    } else if (ext === '.pptx' || mimetype.includes('presentationml')) {
      text = await extractPptx(buffer);
    } else if (ext === '.csv' || mimetype === 'text/csv') {
      text = await extractCsv(buffer);
    } else if (['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tiff'].includes(ext) || mimetype.startsWith('image/')) {
      text = await extractImage(buffer);
    } else {
      // Plain text fallback (.txt, .md, etc.)
      text = buffer.toString('utf-8');
    }
  } catch (err) {
    console.error(`[FAIL]  Extraction error for "${originalname}":`, err.message);
    throw new Error(`Could not extract text from "${originalname}". Reason: ${err.message}`);
  }

  if (!text || text.trim().length < 10) {
    throw new Error(`"${originalname}" appears to contain no readable text (scanned image PDF?).`);
  }

  console.log(`[OK]    Extracted ${text.length} characters from "${originalname}"`);
  return text;
}

// ── Routes ────────────────────────────────────────────────────────────────────

/** POST /api/quiz/generate */
router.post('/generate', upload.single('file'), async (req, res) => {
  try {
    let { topic, questionCount = 10, difficulty = 'medium', format = 'mcq', fileContent } = req.body;

    if (req.file) {
      fileContent = await extractText(req.file);
      // If no topic provided, auto-derive from filename
      if (!topic || !topic.trim()) {
        topic = path.basename(req.file.originalname, path.extname(req.file.originalname));
      }
    }

    if (!topic && !fileContent) {
      return res.status(400).json({ error: 'Please provide a topic or upload a file.' });
    }

    const quiz = await generateQuiz({ topic: topic || 'Document Content', questionCount, difficulty, format, fileContent });
    res.json({ success: true, quiz });
  } catch (err) {
    console.error('[ERROR] Quiz generation:', err.message);
    res.status(500).json({ error: err.message || 'Failed to generate quiz' });
  }
});

/** POST /api/quiz/save */
router.post('/save', auth, async (req, res) => {
  try {
    const quiz = await db.saveQuiz({ userId: req.user.id, ...req.body });
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/quiz/history */
router.get('/history', auth, async (req, res) => {
  try {
    const quizzes = await db.getQuizzesByUserId(req.user.id);
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
