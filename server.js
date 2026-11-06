// ── SERVER ──────────────────────────────────────────────────
// Раздаёт статический сайт (папка /public) и отдельно принимает
// заявки RSVP через POST /api/rsvp, которые пересылает в Google
// Таблицу через Google Apps Script Web App.
//
// Реализована поддержка как с Express/dotenv, так и чистый fallback
// на встроенные модули Node.js (http, fs, path), чтобы сервер
// гарантированно запускался в любом окружении без установки дополнительных пакетов.

const path = require('path');
const fs = require('fs');

// Загрузка переменных окружения: dotenv -> process.loadEnvFile -> ручной парсинг
try {
  require('dotenv').config();
} catch (_) {
  try {
    if (typeof process.loadEnvFile === 'function') {
      const envPath = path.join(__dirname, '.env');
      if (fs.existsSync(envPath)) process.loadEnvFile(envPath);
    }
  } catch (errEnv) {
    // Ручной парсинг на случай старых версий или проблем с правами
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            if (!process.env[key]) process.env[key] = val;
          }
        }
      }
    }
  }
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const GOOGLE_SHEET_WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL;

async function handleRsvp(body) {
  const { name, phone, attending, count, names, needs, wish, lang } = body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return { status: 400, data: { ok: false, error: 'Укажите имя' } };
  }

  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return { status: 400, data: { ok: false, error: 'Укажите номер телефона' } };
  }

  if (!GOOGLE_SHEET_WEBAPP_URL) {
    console.error('GOOGLE_SHEET_WEBAPP_URL не задан в переменных окружения');
    return { status: 500, data: { ok: false, error: 'Сервер не настроен' } };
  }

  const payload = new URLSearchParams({
    name: name.trim().slice(0, 200),
    phone: phone.trim().slice(0, 40),
    attending: String(attending || '').slice(0, 50),
    count: String(count || '').slice(0, 10),
    names: String(names || '').slice(0, 500),
    needs: String(needs || '').slice(0, 1000),
    wish: String(wish || '').slice(0, 1000),
    lang: String(lang || 'ky').slice(0, 5),
    submittedAt: new Date().toISOString(),
    userAgent: 'Kyz-Uzatuu-Client'
  });

  const sheetResponse = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
    method: 'POST',
    body: payload
  });

  const rawText = await sheetResponse.text();

  if (!sheetResponse.ok) {
    console.error(`Google Sheets webapp вернул статус ${sheetResponse.status}. Тело:`, rawText.slice(0, 500));
    throw new Error(`Google Sheets webapp вернул статус ${sheetResponse.status}`);
  }

  let sheetResult = null;
  try {
    sheetResult = JSON.parse(rawText);
  } catch (_) {
    console.error('Ответ Google Sheets webapp не является JSON. Тело:', rawText.slice(0, 500));
    throw new Error('Apps Script вернул неожиданный ответ');
  }

  if (sheetResult && sheetResult.ok === false) {
    console.error('Apps Script сообщил об ошибке:', sheetResult.error);
    throw new Error(`Apps Script error: ${sheetResult.error}`);
  }

  console.log('RSVP успешно записан в таблицу:', name);
  return { status: 200, data: { ok: true, result: sheetResult } };
}

// Попытка использовать Express, если установлен
let useNativeServer = true;
try {
  const express = require('express');
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  app.post('/api/rsvp', async (req, res) => {
    try {
      const result = await handleRsvp(req.body);
      return res.status(result.status).json(result.data);
    } catch (err) {
      console.error('Ошибка при отправке RSVP в таблицу:', err);
      return res.status(502).json({
        ok: false,
        error: 'Не удалось сохранить заявку, попробуйте ещё раз'
      });
    }
  });

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  // Fallback для SPA на случай прямого захода по роутам
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`[Express] Сервер сайта Elena Кыз Узатуу запущен на http://localhost:${PORT}`);
  });
  useNativeServer = false;
} catch (_) {
  useNativeServer = true;
}

// Fallback на встроенный node:http, если express не установлен
if (useNativeServer) {
  const http = require('http');

  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.webp': 'image/webp'
  };

  const publicDir = path.join(__dirname, 'public');

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);

    // Health check
    if (req.method === 'GET' && pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok' }));
    }

    // POST /api/rsvp
    if (req.method === 'POST' && pathname === '/api/rsvp') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', async () => {
        try {
          const body = JSON.parse(bodyStr || '{}');
          const result = await handleRsvp(body);
          res.writeHead(result.status, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(result.data));
        } catch (err) {
          console.error('Ошибка при обработке RSVP:', err);
          res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Ошибка сохранения RSVP' }));
        }
      });
      return;
    }

    // Статические файлы из /public
    if (req.method === 'GET' || req.method === 'HEAD') {
      let safePath = path.normalize(path.join(publicDir, pathname));
      if (!safePath.startsWith(publicDir)) {
        res.writeHead(403);
        return res.end('Forbidden');
      }

      // Если директория или корень — отдаем index.html
      try {
        const stat = fs.existsSync(safePath) ? fs.statSync(safePath) : null;
        if (stat && stat.isDirectory()) {
          safePath = path.join(safePath, 'index.html');
        } else if (!stat) {
          // SPA fallback: если файл не найден, отдаём index.html
          safePath = path.join(publicDir, 'index.html');
        }
      } catch (_) {
        safePath = path.join(publicDir, 'index.html');
      }

      if (fs.existsSync(safePath)) {
        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        if (req.method === 'HEAD') {
          return res.end();
        }
        return fs.createReadStream(safePath).pipe(res);
      }

      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }

    res.writeHead(405);
    res.end('Method Not Allowed');
  });

  server.listen(PORT, () => {
    console.log(`[Native HTTP] Сервер сайта Elena Кыз Узатуу запущен на http://localhost:${PORT}`);
  });
}
