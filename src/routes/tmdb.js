import { Router } from 'express';
import { tmdb } from '../tmdb.js';

const router = Router();

// GET /api/tmdb/search?query=matrix&page=1
router.get('/search', async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query) return res.status(400).json({ error: 'Параметр query обовʼязковий' });
  res.json(await tmdb('/search/movie', { query, page, language: 'uk-UA' }));
});

// GET /api/tmdb/popular
router.get('/popular', async (_req, res) => {
  res.json(await tmdb('/movie/popular', { language: 'uk-UA' }));
});

export default router;
