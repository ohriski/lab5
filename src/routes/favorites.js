import { Router } from 'express';
import { supabase } from '../db.js';
import { tmdb } from '../tmdb.js';

const router = Router();

const validRating = (r) => r === undefined || r === null || (Number.isInteger(r) && r >= 1 && r <= 10);

// GET /api/favorites
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('favorites').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  res.json(data);
});

// GET /api/favorites/:id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('favorites').select('*').eq('id', req.params.id).maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Не знайдено' });
  res.json(data);
});

// POST /api/favorites  { tmdb_id, note?, rating? } — дані фільму підтягуються з TMDB
router.post('/', async (req, res) => {
  const { tmdb_id, note, rating } = req.body ?? {};
  if (!Number.isInteger(tmdb_id)) return res.status(400).json({ error: 'tmdb_id (integer) обовʼязковий' });
  if (!validRating(rating)) return res.status(400).json({ error: 'rating має бути цілим 1–10' });

  const m = await tmdb(`/movie/${tmdb_id}`, { language: 'uk-UA' });
  const { data, error } = await supabase.from('favorites').insert({
    tmdb_id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path,
    release_date: m.release_date || null,
    vote_average: m.vote_average,
    note, rating
  }).select().single();

  if (error?.code === '23505') return res.status(409).json({ error: 'Цей фільм уже в обраному' });
  if (error) throw error;
  res.status(201).json(data);
});

// PATCH /api/favorites/:id  { note?, rating? }
router.patch('/:id', async (req, res) => {
  const { note, rating } = req.body ?? {};
  if (!validRating(rating)) return res.status(400).json({ error: 'rating має бути цілим 1–10' });
  const patch = {};
  if (note !== undefined) patch.note = note;
  if (rating !== undefined) patch.rating = rating;
  if (!Object.keys(patch).length) return res.status(400).json({ error: 'Нічого оновлювати' });

  const { data, error } = await supabase
    .from('favorites').update(patch).eq('id', req.params.id).select().maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Не знайдено' });
  res.json(data);
});

// DELETE /api/favorites/:id
router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('favorites').delete().eq('id', req.params.id).select().maybeSingle();
  if (error) throw error;
  if (!data) return res.status(404).json({ error: 'Не знайдено' });
  res.status(204).end();
});

export default router;
