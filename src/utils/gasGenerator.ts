import type { DictionaryEntry, GasConfigOptions } from '../types/dictionary';
import { getUsageNoteEn } from './lexiconHelpers';

function escapeCsvCell(value: string): string {
  const normalized = (value ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export function generateDictionaryCsv(entries: DictionaryEntry[]): string {
  const headers = [
    'ID',
    'English Term',
    'Bahasa Malaysia Term',
    'Part of Speech',
    'Category',
    'Book Section',
    'Book Pages',
    'PDF Pages',
    'English Definition',
    'Bahasa Malaysia Definition',
    'Context Note (English)',
    'Verbatim PDF Quote',
    'Source',
  ];

  const rows = entries.map((entry) => [
    entry.id,
    entry.term,
    entry.malayTerm,
    entry.partOfSpeech,
    entry.category,
    entry.section,
    entry.bookPages.join(', '),
    entry.pdfPages.join(', '),
    entry.definitionEn,
    entry.definitionMs,
    getUsageNoteEn(entry),
    entry.excerpts[0]?.quote ?? '',
    entry.source,
  ]);

  const csvLines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ];

  // UTF-8 BOM for seamless Excel & Google Sheets Malay character import
  return `\uFEFF${csvLines.join('\r\n')}`;
}

export function generateCodeGs(
  entries: DictionaryEntry[],
  options: GasConfigOptions,
): string {
  const compactSeed = entries.map((e) => [
    e.id,
    e.term,
    e.malayTerm,
    e.partOfSpeech,
    e.category,
    e.section,
    e.bookPages.join(', '),
    e.definitionEn,
    e.definitionMs,
    getUsageNoteEn(e),
    e.excerpts[0]?.quote ?? '',
  ]);

  const compactSeedLiteral =
    '[\n' +
    compactSeed.map((row) => '    ' + JSON.stringify(row)).join(',\n') +
    '\n  ]';

  const seedFunctionBlock = options.includeSeedData
    ? `
/**
 * Memasukkan ${entries.length} entri kamus dwibahasa ke dalam helaian "Dictionary" secara berperingkat.
 * Jalankan sekali selepas setupDictionarySheet().
 */
function seedDictionaryData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || setupDictionarySheet();
  const seedRows = ${compactSeedLiteral};

  const existingRange = sheet.getDataRange().getValues();
  const existingIds = new Set();
  for (let i = 1; i < existingRange.length; i++) {
    existingIds.add(String(existingRange[i][0] || '').trim());
  }

  const rowsToAppend = seedRows.filter(function (row) {
    return !existingIds.has(String(row[0]));
  });

  if (rowsToAppend.length === 0) {
    return { inserted: 0, message: 'Semua entri sudah wujud dalam helaian.' };
  }

  const BATCH_SIZE = 400;
  for (let offset = 0; offset < rowsToAppend.length; offset += BATCH_SIZE) {
    const batch = rowsToAppend.slice(offset, offset + BATCH_SIZE);
    const startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, batch.length, 11).setValues(batch);
    sheet.getRange(startRow, 1, batch.length, 11).setWrap(true).setVerticalAlignment('top');
  }

  return {
    inserted: rowsToAppend.length,
    message: rowsToAppend.length + ' entri berjaya dimasukkan ke dalam helaian.'
  };
}
`
    : '';

  const geminiFunctionBlock = options.includeGeminiLookup
    ? `
/**
 * Rujukan definisi dwibahasa (EN/BM) menggunakan Gemini API.
 * Tetapkan GEMINI_API_KEY dalam Project Settings > Script Properties.
 */
function lookupTermWithGemini(term, excerpt) {
  const cleanTerm = String(term || '').trim();
  if (!cleanTerm) {
    throw new Error('Sila masukkan perkataan atau frasa.');
  }

  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum ditetapkan dalam Script Properties.');
  }

  const endpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent?key=' +
    encodeURIComponent(apiKey);

  const promptText = [
    'Analyze the English word or phrase "' + cleanTerm + '" in the context of "It Works: How and Why".',
    excerpt ? 'PDF Excerpt: ' + excerpt : '',
    'Return strict JSON with keys: term, malayTerm, partOfSpeech, definitionEn, definitionMs, usageNoteEn.'
  ].filter(Boolean).join('\\n\\n');

  const payload = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      responseMimeType: 'application/json'
    }
  };

  const response = UrlFetchApp.fetch(endpoint, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() >= 400) {
    throw new Error('Ralat Gemini API (' + response.getResponseCode() + '): ' + response.getContentText());
  }

  const json = JSON.parse(response.getContentText());
  const rawText =
    json &&
    json.candidates &&
    json.candidates[0] &&
    json.candidates[0].content &&
    json.candidates[0].content.parts &&
    json.candidates[0].content.parts[0]
      ? json.candidates[0].content.parts[0].text
      : '{}';

  return JSON.parse(rawText);
}
`
    : '';

  const pdfExtractorBlock = `
/**
 * Menerima URL fail PDF (URL terus HTTPS atau pautan Google Drive),
 * menukarkannya sementara kepada Google Docs menggunakan Google Drive & Docs API,
 * mengekstrak semua teks, dan mengembalikannya sebagai satu string.
 *
 * @param {string} pdfUrl URL fail PDF atau pautan perkongsian Google Drive.
 * @return {string} Keseluruhan teks yang diekstrak daripada PDF.
 */
function extractTextFromPdfUrl(pdfUrl) {
  const url = String(pdfUrl || '').trim();
  if (!url) {
    throw new Error('URL fail PDF tidak boleh kosong.');
  }

  let pdfBlob = null;
  const driveIdMatch =
    url.match(/\\/d\\/([a-zA-Z0-9_-]{10,})/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);

  if (driveIdMatch && driveIdMatch[1]) {
    // Jika URL ialah pautan Google Drive, baca fail terus melalui DriveApp
    const sourceFile = DriveApp.getFileById(driveIdMatch[1]);
    pdfBlob = sourceFile.getBlob().setContentType('application/pdf');
  } else {
    // Jika URL terus (HTTP/HTTPS), muat turun fail PDF sebagai Blob
    const response = UrlFetchApp.fetch(url, {
      followRedirects: true,
      muteHttpExceptions: true
    });
    const status = response.getResponseCode();
    if (status < 200 || status >= 300) {
      throw new Error('Gagal memuat turun PDF daripada URL (HTTP ' + status + ').');
    }
    pdfBlob = response.getBlob().setContentType('application/pdf');
    if (!pdfBlob.getName()) {
      pdfBlob.setName('kamus-import.pdf');
    }
  }

  // Muat naik sementara sebagai Google Doc melalui Drive REST API v3 agar Docs API boleh membaca teksnya
  const boundary = '----GASBoundary' + Utilities.getUuid();
  const metadata = JSON.stringify({
    name: 'Temp_PDF_Extract_' + Date.now(),
    mimeType: 'application/vnd.google-apps.document'
  });

  const preBody = Utilities.newBlob(
    '--' + boundary + '\\r\\n' +
    'Content-Type: application/json; charset=UTF-8\\r\\n\\r\\n' +
    metadata + '\\r\\n' +
    '--' + boundary + '\\r\\n' +
    'Content-Type: application/pdf\\r\\n\\r\\n'
  ).getBytes();

  const postBody = Utilities.newBlob('\\r\\n--' + boundary + '--\\r\\n').getBytes();
  const multipartBytes = preBody.concat(pdfBlob.getBytes()).concat(postBody);

  const uploadRes = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
    {
      method: 'post',
      contentType: 'multipart/related; boundary=' + boundary,
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
      },
      payload: multipartBytes,
      muteHttpExceptions: true
    }
  );

  if (uploadRes.getResponseCode() >= 400) {
    throw new Error(
      'Penukaran PDF ke Google Docs gagal (' +
        uploadRes.getResponseCode() +
        '): ' +
        uploadRes.getContentText()
    );
  }

  const createdDoc = JSON.parse(uploadRes.getContentText());
  const tempDocId = createdDoc.id;

  try {
    // Gunakan Google Docs API (DocumentApp) untuk mendapatkan keseluruhan teks sebagai satu string
    const doc = DocumentApp.openById(tempDocId);
    const fullText = doc.getBody().getText();
    return fullText.trim();
  } finally {
    // Padam dokumen sementara supaya Google Drive kekal kemas
    if (tempDocId) {
      DriveApp.getFileById(tempDocId).setTrashed(true);
    }
  }
}
`;

  const pdfMenuHelperBlock = options.includeDrivePdfImporter
    ? `
/**
 * Dialog menu Google Sheets untuk menguji pengekstrakan teks daripada URL PDF.
 */
function promptAndExtractPdfUrl() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Ekstrak Teks daripada URL PDF',
    'Masukkan URL fail PDF atau pautan Google Drive:',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const url = response.getResponseText().trim();
  const text = extractTextFromPdfUrl(url);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let extractSheet = ss.getSheetByName('PDF_Extracted_Text');
  if (!extractSheet) {
    extractSheet = ss.insertSheet('PDF_Extracted_Text');
  }
  extractSheet.appendRow([new Date(), url, text.slice(0, 45000)]);
  ui.alert('Berjaya! ' + text.length + ' aksara diekstrak ke helaian PDF_Extracted_Text.');
}
`
    : '';

  return `/**
 * It Works Lexicon — Kamus Dwibahasa (English / Bahasa Malaysia)
 * Google Apps Script Backend + Modular HTML Service (Index.html, css.html, JavaScript.html)
 */

const SHEET_NAME = 'Dictionary';
const LOG_SHEET_NAME = 'SearchLog';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Kamus It Works')
    .addItem('Sediakan Helaian Kamus', 'setupDictionarySheet')${
      options.includeSeedData
        ? "\n    .addItem('Muat Data Awal Kamus', 'seedDictionaryData')"
        : ''
    }${
      options.includeDrivePdfImporter
        ? "\n    .addItem('Ekstrak Teks dari URL PDF', 'promptAndExtractPdfUrl')"
        : ''
    };
  menu.addToUi();
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'search') {
    const results = searchDictionary(
      e.parameter.q || '',
      e.parameter.letter || '',
      e.parameter.category || 'Semua'
    );
    return ContentService.createTextOutput(JSON.stringify({ results: results }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('It Works Lexicon — Bilingual Recovery Dictionary')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Memuatkan fail separa css.html dan JavaScript.html ke dalam templat Index.html.
 * Dipanggil melalui <?!= include('css'); ?> dan <?!= include('JavaScript'); ?>.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setupDictionarySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    'ID',
    'English Term',
    'Bahasa Malaysia Term',
    'Part of Speech',
    'Category',
    'Book Section',
    'Book Pages',
    'English Definition',
    'Bahasa Malaysia Definition',
    'Context Note (English)',
    'Verbatim PDF Quote'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground('#1e3a8a')
      .setFontColor('#fbf9f5')
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 1, 140);
    sheet.setColumnWidths(2, 2, 220);
    sheet.setColumnWidths(8, 4, 340);
  }

  let logSheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (!logSheet) {
    logSheet = ss.insertSheet(LOG_SHEET_NAME);
    logSheet.getRange(1, 1, 1, 3).setValues([['Masa', 'Kata Kunci', 'Jumlah Padanan']]);
    logSheet.getRange(1, 1, 1, 3).setFontWeight('bold');
    logSheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Mencari perkataan atau frasa dalam helaian "Dictionary".
 * Dipanggil daripada JavaScript.html melalui google.script.run.
 */
function searchDictionary(query, letter, category) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) {
    return [];
  }

  const rows = sheet.getDataRange().getValues();
  const q = String(query || '').trim().toLowerCase();
  const targetLetter = String(letter || '').trim().toUpperCase();
  const targetCategory = String(category || 'Semua').trim();

  const matches = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const entry = {
      id: String(row[0] || ''),
      term: String(row[1] || ''),
      malayTerm: String(row[2] || ''),
      partOfSpeech: String(row[3] || ''),
      category: String(row[4] || ''),
      section: String(row[5] || ''),
      bookPages: String(row[6] || ''),
      definitionEn: String(row[7] || ''),
      definitionMs: String(row[8] || ''),
      usageNoteEn: String(row[9] || ''),
      quote: String(row[10] || '')
    };

    if (targetLetter && entry.term.toUpperCase().charAt(0) !== targetLetter) {
      continue;
    }

    if (targetCategory && targetCategory !== 'Semua' && entry.category !== targetCategory) {
      continue;
    }

    if (q) {
      const haystack = [
        entry.term,
        entry.malayTerm,
        entry.definitionEn,
        entry.definitionMs,
        entry.usageNoteEn,
        entry.quote,
        entry.section
      ].join(' ').toLowerCase();

      if (haystack.indexOf(q) === -1) {
        continue;
      }
    }

    matches.push(entry);
  }

  matches.sort(function (a, b) {
    return a.term.localeCompare(b.term);
  });

  if (q) {
    const logSheet = ss.getSheetByName(LOG_SHEET_NAME);
    if (logSheet) {
      logSheet.appendRow([new Date(), q, matches.length]);
    }
  }

  return matches;
}

/**
 * Menambah entri kamus baharu daripada antaramuka HTML Service.
 */
function addDictionaryEntry(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || setupDictionarySheet();

  const term = String((payload && payload.term) || '').trim();
  const malayTerm = String((payload && payload.malayTerm) || '').trim();
  if (!term || !malayTerm) {
    throw new Error('Istilah Inggeris dan padanan Bahasa Melayu wajib diisi.');
  }

  const id = term.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  const row = [
    id,
    term,
    malayTerm,
    String(payload.partOfSpeech || 'Frasa'),
    String(payload.category || 'Frasa Teras'),
    String(payload.section || 'Rujukan Umum'),
    String(payload.bookPages || ''),
    String(payload.definitionEn || ''),
    String(payload.definitionMs || ''),
    String(payload.usageNoteEn || payload.usageNoteMs || ''),
    String(payload.quote || '')
  ];

  sheet.appendRow(row);
  return { ok: true, id: id };
}
${seedFunctionBlock}${pdfExtractorBlock}${pdfMenuHelperBlock}${geminiFunctionBlock}`;
}

export function generateIndexHtml(options: GasConfigOptions): string {
  const pdfExtractSection = options.includeDrivePdfImporter
    ? `
      <section class="card extract-card">
        <div class="section-label">PDF Text Extractor (Google Docs API)</div>
        <p class="muted extract-desc">
          Paste a Google Drive link or direct HTTPS PDF URL to extract the full text as a single string.
        </p>
        <div class="search-row">
          <input
            id="pdfUrlInput"
            type="url"
            placeholder="https://drive.google.com/file/d/.../view or .pdf URL"
          />
          <button class="btn-secondary" type="button" onclick="runPdfExtraction()">
            Extract PDF Text
          </button>
        </div>
        <div id="pdfExtractOutput" class="extract-output" hidden></div>
      </section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <base target="_top" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>It Works Lexicon — Bilingual Recovery Dictionary</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
      rel="stylesheet"
    />
    <?!= include('css'); ?>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="eyebrow">It Works: How and Why · Google Apps Script</div>
        <h1>It Works Lexicon</h1>
        <p class="subtitle">
          Search English recovery terms, multi-word phrases, and Bahasa Malaysia definitions synced from your Google Sheet.
        </p>
      </header>

      <section class="search-panel">
        <form class="search-row" onsubmit="handleSearch(event)">
          <input
            id="searchInput"
            type="text"
            placeholder="Search term, phrase, or BM meaning (e.g. Twelve Steps, surrender, getting clean)..."
            aria-label="Search dictionary term or phrase"
          />
          <select id="categorySelect" aria-label="Filter by category" class="category-select">
            <option value="Semua">All Categories</option>
            <option value="Indeks Utama">Main Index</option>
            <option value="Langkah 1–12">Steps 1–12</option>
            <option value="Tradisi 1–12">Traditions 1–12</option>
            <option value="Frasa Teras">Core Phrases</option>
          </select>
          <button class="btn-primary" type="submit">Search</button>
        </form>
        <div id="azBar" class="az-bar"></div>
      </section>

      <div id="statusLine" class="status-line">Loading dictionary entries...</div>
      <main id="resultsArea" class="results-list" aria-live="polite"></main>${pdfExtractSection}
    </div>

    <?!= include('JavaScript'); ?>
  </body>
</html>
`;
}

export function generateCssHtml(): string {
  return `<style>
  :root {
    --bg: #fbf9f5;
    --surface: #f4efe6;
    --card: #fffdf9;
    --border: #e3dacb;
    --ink: #1c1917;
    --ink-secondary: #44403c;
    --ink-muted: #57534e;
    --lapis: #1e3a8a;
    --lapis-dark: #172554;
    --quote-bg: #f6efe2;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: "Source Serif 4", Georgia, serif;
    line-height: 1.65;
  }

  .shell {
    max-width: 940px;
    margin: 0 auto;
    padding: 28px 20px 64px;
  }

  header {
    border-bottom: 1px solid var(--border);
    padding-bottom: 18px;
    margin-bottom: 24px;
  }

  .eyebrow {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  h1 {
    margin: 6px 0 6px;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 40px;
    font-weight: 600;
    line-height: 1.1;
  }

  .subtitle {
    margin: 0;
    color: var(--ink-muted);
    font-size: 15px;
  }

  .search-panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px;
    margin-bottom: 20px;
  }

  .search-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  input[type="text"],
  input[type="url"],
  select,
  textarea {
    flex: 1 1 260px;
    min-height: 44px;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    color: var(--ink);
    font-family: inherit;
    font-size: 15px;
  }

  .category-select {
    flex: 0 1 190px;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid rgba(30, 58, 138, 0.25);
    border-color: var(--lapis);
  }

  button {
    cursor: pointer;
    min-height: 44px;
    border-radius: 8px;
    padding: 10px 18px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--lapis);
    color: #fbf9f5;
    border: 1px solid var(--lapis);
  }

  .btn-primary:hover {
    background: var(--lapis-dark);
  }

  .btn-secondary {
    background: var(--surface);
    color: var(--ink);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    border-color: var(--lapis);
    color: var(--lapis);
  }

  .az-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .az-btn {
    min-height: 34px;
    padding: 4px 9px;
    font-size: 12px;
    font-family: "JetBrains Mono", monospace;
    background: transparent;
    border: 1px solid transparent;
    color: var(--ink-muted);
    border-radius: 6px;
  }

  .az-btn:hover {
    background: var(--surface);
    color: var(--ink);
  }

  .az-btn.active {
    background: var(--lapis);
    color: #fbf9f5;
  }

  .status-line {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    color: var(--ink-muted);
    margin-bottom: 14px;
  }

  .results-list {
    display: grid;
    gap: 16px;
  }

  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 22px;
  }

  .entry-title {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 30px;
    font-weight: 600;
    line-height: 1.15;
  }

  .entry-bm {
    margin: 4px 0 8px;
    font-size: 18px;
    font-weight: 600;
    color: var(--lapis);
  }

  .meta-line {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    color: var(--ink-muted);
    padding-bottom: 12px;
    margin-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }

  .section-label {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 5px;
  }

  .section-label.lapis {
    color: var(--lapis);
  }

  .def-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
  }

  .quote-box {
    margin: 16px 0 0;
    padding: 14px 16px;
    background: var(--quote-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .quote-text {
    margin: 6px 0 0;
    font-style: italic;
    color: var(--ink);
    line-height: 1.7;
  }

  .context-box {
    margin-top: 14px;
    padding: 12px 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    color: var(--ink-secondary);
  }

  .muted {
    color: var(--ink-muted);
    font-size: 14px;
  }

  .extract-card {
    margin-top: 24px;
  }

  .extract-desc {
    margin: 6px 0 14px;
  }

  .extract-output {
    margin-top: 14px;
    padding: 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    white-space: pre-wrap;
    max-height: 280px;
    overflow: auto;
  }
</style>
`;
}

export function generateJavaScriptHtml(options: GasConfigOptions): string {
  const pdfExtractScript = options.includeDrivePdfImporter
    ? `
  function runPdfExtraction() {
    var urlInput = document.getElementById('pdfUrlInput');
    var outEl = document.getElementById('pdfExtractOutput');
    var url = urlInput.value.trim();
    if (!url) {
      outEl.hidden = false;
      outEl.textContent = 'Please enter a valid PDF URL first.';
      return;
    }

    outEl.hidden = false;
    outEl.textContent = 'Extracting PDF text via Google Docs API...';

    google.script.run
      .withSuccessHandler(function (text) {
        var preview =
          text && text.length > 2400
            ? text.slice(0, 2400) + '\\n\\n... (' + text.length + ' characters extracted)'
            : text;
        outEl.textContent = preview || '(No readable text found in this PDF.)';
      })
      .withFailureHandler(function (err) {
        outEl.textContent = 'Error: ' + (err && err.message ? err.message : err);
      })
      .extractTextFromPdfUrl(url);
  }`
    : '';

  return `<script>
  var activeLetter = '';

  function buildAzBar() {
    var bar = document.getElementById('azBar');
    var letters = [''].concat('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    bar.innerHTML = letters
      .map(function (ch) {
        var label = ch === '' ? 'All' : ch;
        var cls = ch === activeLetter ? 'az-btn active' : 'az-btn';
        return (
          '<button type="button" class="' +
          cls +
          '" onclick="selectLetter(\\'' +
          ch +
          '\\')">' +
          label +
          '</button>'
        );
      })
      .join('');
  }

  function selectLetter(ch) {
    activeLetter = ch;
    buildAzBar();
    runSearch();
  }

  function handleSearch(ev) {
    ev.preventDefault();
    runSearch();
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function runSearch() {
    var query = document.getElementById('searchInput').value;
    var category = document.getElementById('categorySelect').value;
    var status = document.getElementById('statusLine');
    status.textContent = 'Searching dictionary...';

    google.script.run
      .withSuccessHandler(renderResults)
      .withFailureHandler(function (err) {
        status.textContent = 'Error: ' + (err && err.message ? err.message : err);
      })
      .searchDictionary(query, activeLetter, category);
  }

  function renderResults(entries) {
    var status = document.getElementById('statusLine');
    var area = document.getElementById('resultsArea');
    var list = Array.isArray(entries) ? entries : [];

    status.textContent = list.length + ' dictionary entries found.';
    if (list.length === 0) {
      area.innerHTML =
        '<div class="card"><p class="muted" style="margin:0;">No matching terms or phrases found. Try another keyword or reset the letter filter to All.</p></div>';
      return;
    }

    area.innerHTML = list
      .map(function (item) {
        var meta = [
          item.partOfSpeech,
          item.category,
          item.section,
          item.bookPages ? 'p. ' + item.bookPages : '',
        ]
          .filter(Boolean)
          .join(' · ');

        var quoteHtml = item.quote
          ? '<blockquote class="quote-box">' +
            '<div class="section-label">Highlighted Verbatim Quote from PDF</div>' +
            '<p class="quote-text">“' +
            escapeHtml(item.quote) +
            '”</p>' +
            '</blockquote>'
          : '';

        var contextHtml = item.usageNoteEn
          ? '<div class="context-box">' +
            '<div class="section-label">Context Note in Book</div>' +
            '<div>' +
            escapeHtml(item.usageNoteEn) +
            '</div>' +
            '</div>'
          : '';

        return (
          '<article class="card">' +
          '<h2 class="entry-title">' +
          escapeHtml(item.term) +
          '</h2>' +
          '<div class="entry-bm">' +
          escapeHtml(item.malayTerm) +
          '</div>' +
          '<div class="meta-line">' +
          escapeHtml(meta) +
          '</div>' +
          '<div class="def-grid">' +
          '<div>' +
          '<div class="section-label lapis">Definisi Bahasa Malaysia</div>' +
          '<div>' +
          escapeHtml(item.definitionMs) +
          '</div>' +
          '</div>' +
          '<div>' +
          '<div class="section-label">English Definition</div>' +
          '<div>' +
          escapeHtml(item.definitionEn) +
          '</div>' +
          '</div>' +
          '</div>' +
          quoteHtml +
          contextHtml +
          '</article>'
        );
      })
      .join('');
  }${pdfExtractScript}

  buildAzBar();
  runSearch();
</script>
`;
}
