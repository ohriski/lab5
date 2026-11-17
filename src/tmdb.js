import 'dotenv/config';

const BASE = 'https://api.themoviedb.org/3';

export async function tmdb(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`TMDB error ${res.status}`);
    err.status = res.status === 404 ? 404 : 502;
    throw err;
  }
  return res.json();
}
