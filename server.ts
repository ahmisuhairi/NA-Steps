import 'dotenv/config';
import express, { type Request } from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import {
  getCorpusStats,
  getPdfPageByBookPage,
  getPdfPageByNumber,
  getPdfPagesByRange,
  getWordOccurrences,
  loadPdfCorpus,
  searchPdfPages,
} from './server/pdfCorpus.ts';

const PORT = Number(process.env.PORT) || 3000;
const OWNER_EMAIL = 'ahmisuhairi@gmail.com';

const FIREBASE_CONFIG_PATH = path.resolve(
  process.cwd(),
  'firebase-applet-config.json',
);

function getFirebaseApiKey(): string | null {
  try {
    if (!fs.existsSync(FIREBASE_CONFIG_PATH)) return null;
    const raw = fs.readFileSync(FIREBASE_CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as { apiKey?: string };
    return parsed.apiKey ?? null;
  } catch {
    return null;
  }
}

interface VerifiedOwnerResult {
  authorized: boolean;
  status: number;
  email?: string;
  error?: string;
}

async function verifyOwnerRequest(req: Request): Promise<VerifiedOwnerResult> {
  const authHeader = req.headers.authorization ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required.',
    };
  }

  const idToken = authHeader.slice('Bearer '.length).trim();
  if (!idToken) {
    return {
      authorized: false,
      status: 401,
      error: 'Missing authentication token.',
    };
  }

  const apiKey = getFirebaseApiKey();
  if (!apiKey) {
    return {
      authorized: false,
      status: 500,
      error: 'Firebase configuration is unavailable on the server.',
    };
  }

  try {
    const lookupRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      },
    );

    if (!lookupRes.ok) {
      return {
        authorized: false,
        status: 401,
        error: 'Invalid or expired sign-in session.',
      };
    }

    const payload = (await lookupRes.json()) as {
      users?: Array<{
        email?: string;
        emailVerified?: boolean;
      }>;
    };
    const user = payload.users?.[0];
    const email = (user?.email ?? '').trim().toLowerCase();

    if (!user || user.emailVerified !== true || email !== OWNER_EMAIL) {
      return {
        authorized: false,
        status: 403,
        error: 'Access restricted to the owner account.',
      };
    }

    return { authorized: true, status: 200, email };
  } catch {
    return {
      authorized: false,
      status: 500,
      error: 'Unable to verify account with Google.',
    };
  }
}

const OWNER_GUIDE_STEPS = [
  {
    number: '01',
    title: 'Download XLSX / CSV or Create a New Google Sheet',
    body: 'Open Google Sheets and create a spreadsheet named "It Works Dictionary". You can import the downloaded XLSX workbook (File > Import > Upload) with both the Bilingual Dictionary and Chapters Summary sheets, import the CSV, or let setupDictionarySheet() and seedDictionaryData() populate all columns automatically.',
  },
  {
    number: '02',
    title: 'Open the Google Apps Script Editor',
    body: 'Inside your Google Sheet, select Extensions > Apps Script. Clear any default placeholder code in Code.gs.',
  },
  {
    number: '03',
    title: 'Paste Code.gs, Index.html, css.html, and JavaScript.html',
    body: 'Open GAS Script from the hamburger menu. Paste Code.gs into Code.gs, then click the "+" icon next to Files to create three HTML files named Index, css, and JavaScript (saved as Index.html, css.html, and JavaScript.html) and paste each matching file. Index.html loads css.html and JavaScript.html automatically via the include() helper in Code.gs.',
  },
  {
    number: '04',
    title: 'Run Setup & Test the PDF URL Extractor',
    body: 'In the Apps Script editor, run setupDictionarySheet() and seedDictionaryData(). You can also call extractTextFromPdfUrl("https://...") to extract an entire PDF through Google Drive and Google Docs API as a single text string.',
  },
  {
    number: '05',
    title: 'Configure GEMINI_API_KEY (Optional)',
    body: 'To use AI bilingual lookup directly inside Apps Script, open Project Settings > Script Properties and add GEMINI_API_KEY. Never hardcode API keys in source files.',
  },
  {
    number: '06',
    title: 'Deploy as a Web App',
    body: 'Click Deploy > New deployment > Web app. Set "Execute as: Me" and choose who has access (e.g., Anyone), then click Deploy to get a shareable URL for your bilingual dictionary.',
  },
];

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Warm PDF corpus in background so searches respond immediately
  loadPdfCorpus().catch((err) => {
    console.error('Failed to pre-load PDF corpus:', err);
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/owner/verify', async (req, res) => {
    const check = await verifyOwnerRequest(req);
    if (!check.authorized) {
      return res.status(check.status).json({ isOwner: false, error: check.error });
    }
    return res.json({ isOwner: true, email: check.email });
  });

  app.get('/api/owner/guide', async (req, res) => {
    const check = await verifyOwnerRequest(req);
    if (!check.authorized) {
      return res.status(check.status).json({ error: check.error });
    }
    return res.json({ steps: OWNER_GUIDE_STEPS });
  });

  app.get('/api/pdf/stats', async (_req, res) => {
    try {
      const stats = await getCorpusStats();
      res.json(stats);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal memuat statistik PDF.';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/pdf/search', async (req, res) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const section =
        typeof req.query.section === 'string' ? req.query.section : 'all';
      if (!q.trim()) {
        return res.json({ totalMatches: 0, hits: [] });
      }
      const result = await searchPdfPages(q, section, 50);
      res.json(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Carian PDF gagal dijalankan.';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/pdf/page/:num', async (req, res) => {
    try {
      const raw = req.params.num;
      const numeric = Number(raw);
      const record =
        Number.isInteger(numeric) && numeric > 0 && req.query.by !== 'book'
          ? await getPdfPageByNumber(numeric)
          : await getPdfPageByBookPage(raw);

      if (!record) {
        return res.status(404).json({ error: 'Halaman PDF tidak ditemui.' });
      }
      res.json(record);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal membaca halaman PDF.';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/pdf/pages', async (req, res) => {
    try {
      const start = Number(req.query.start);
      const end = Number(req.query.end);
      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 1 ||
        end < start
      ) {
        return res
          .status(400)
          .json({ error: 'Invalid PDF page range.' });
      }
      const pages = await getPdfPagesByRange(start, end);
      res.json({ pages });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load chapter PDF pages.';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/pdf/occurrences', async (req, res) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      if (!q.trim()) {
        return res.json({ query: '', totalPages: 0, totalMatches: 0, occurrences: [] });
      }
      const result = await getWordOccurrences(q);
      res.json(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to look up PDF page occurrences.';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/dictionary/lookup', async (req, res) => {
    try {
      const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
      if (!query) {
        return res
          .status(400)
          .json({ error: 'Please enter a word or phrase to look up.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error:
            'Gemini API key is not configured on the server. Please check the Secrets panel.',
        });
      }

      const occResult = await getWordOccurrences(query);
      const searchResult = await searchPdfPages(query, 'all', 6);
      const contextBlocks = searchResult.hits.map(
        (hit) =>
          `[Book Page ${hit.bookPage} | PDF Page ${hit.pdfPage} | ${hit.section}]: ${hit.snippets.join(' ')}`,
      );

      const prompt = [
        `Analyze the English word or phrase "${query}" in the context of the book "It Works: How and Why (The Twelve Steps and Twelve Traditions of Narcotics Anonymous)".`,
        contextBlocks.length > 0
          ? `Matching excerpts from the PDF:\n${contextBlocks.join('\n')}`
          : `No exact literal substring match was found for "${query}". Explain its relevance to the book's recovery themes if applicable, and state clearly in usageNoteEn and usageNoteMs if it does not appear verbatim in the text.`,
        'Return a bilingual dictionary entry with English definition, natural accurate Bahasa Melayu equivalent and definition, and both English and Bahasa Melayu context usage notes.',
      ].join('\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a bilingual (English and Bahasa Melayu) lexicographer specializing in Twelve-Step recovery literature. Provide concise, accurate, respectful definitions grounded strictly in the provided PDF excerpts.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              term: {
                type: Type.STRING,
                description: 'Canonical English headword or phrase in title or natural case.',
              },
              malayTerm: {
                type: Type.STRING,
                description: 'Concise Bahasa Melayu equivalent term or phrase.',
              },
              partOfSpeech: {
                type: Type.STRING,
                description:
                  'One of: Kata Nama, Frasa, Prinsip, Kata Kerja, Kata Sifat.',
              },
              definitionEn: {
                type: Type.STRING,
                description: 'Clear 1-3 sentence English definition in context of the book.',
              },
              definitionMs: {
                type: Type.STRING,
                description: 'Clear 1-3 sentence Bahasa Melayu definition explaining the meaning.',
              },
              usageNoteEn: {
                type: Type.STRING,
                description:
                  'Practical English context note explaining how this term or phrase is used in the PDF.',
              },
              usageNoteMs: {
                type: Type.STRING,
                description:
                  'Practical Bahasa Melayu context note explaining how this term or phrase is used in the PDF.',
              },
            },
            required: [
              'term',
              'malayTerm',
              'partOfSpeech',
              'definitionEn',
              'definitionMs',
              'usageNoteEn',
              'usageNoteMs',
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      const allowedPos = ['Kata Nama', 'Frasa', 'Prinsip', 'Kata Kerja', 'Kata Sifat'];
      const partOfSpeech = allowedPos.includes(parsed.partOfSpeech)
        ? parsed.partOfSpeech
        : 'Frasa';

      const bookPages =
        occResult.occurrences.length > 0
          ? Array.from(new Set(occResult.occurrences.map((o) => o.bookPage)))
          : Array.from(new Set(searchResult.hits.map((h) => h.bookPage)));
      const pdfPages =
        occResult.occurrences.length > 0
          ? Array.from(new Set(occResult.occurrences.map((o) => o.pdfPage)))
          : Array.from(new Set(searchResult.hits.map((h) => h.pdfPage)));

      const entry = {
        id: `ai-${query.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
        term: parsed.term || query,
        malayTerm: parsed.malayTerm || query,
        partOfSpeech,
        category: 'Frasa Teras',
        definitionEn: parsed.definitionEn || '',
        definitionMs: parsed.definitionMs || '',
        usageNoteEn: parsed.usageNoteEn || '',
        usageNoteMs: parsed.usageNoteMs || '',
        bookPages,
        pdfPages,
        section: searchResult.hits[0]?.section || 'General Reference',
        excerpts: searchResult.hits.slice(0, 3).map((h) => ({
          bookPage: h.bookPage,
          pdfPage: h.pdfPage,
          section: h.section,
          quote: h.snippets[0] || '',
        })),
        source: 'ai-lookup',
      };

      res.json({ entry, totalPdfHits: occResult.totalPages || searchResult.totalMatches });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred while generating the bilingual definition.';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
