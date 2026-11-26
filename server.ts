import express from 'express';
import path from 'path';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const distDir = path.join(process.cwd(), 'dist');

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'PersonaKey' });
});

app.use(express.static(distDir));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`PersonaKey server listening on http://${HOST}:${PORT}`);
});
