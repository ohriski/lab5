# Movie Favorites API

Node.js + Express, Supabase (PostgreSQL), TMDB API, OpenAPI 3 (Swagger UI).

## Запуск
1. `npm install`
2. Скопіюй `.env.example` у `.env` і заповни значення.
3. У Supabase → SQL Editor виконай `sql/schema.sql`.
4. `npm run dev`
5. Swagger UI: http://localhost:3000/docs
6. Postman: Import → `postman/movie-api.postman_collection.json` → Run collection.

## Ендпоїнти
| Метод | Шлях | Опис |
|---|---|---|
| GET | /api/tmdb/search?query= | пошук у TMDB |
| GET | /api/tmdb/popular | популярні фільми |
| GET | /api/favorites | список обраного |
| POST | /api/favorites | зберегти фільм за tmdb_id |
| GET | /api/favorites/:id | один запис |
| PATCH | /api/favorites/:id | змінити note/rating |
| DELETE | /api/favorites/:id | видалити |

## Деплой (Render)
Build: `npm install`, Start: `npm start`, Health check: `/health`.
ENV: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TMDB_API_KEY` (PORT задає Render).
Метрики: `/metrics`, логи — у вкладці Logs сервісу.
