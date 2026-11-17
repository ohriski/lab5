import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'node:fs';
import 'dotenv/config';
import favorites from './routes/favorites.js';
import tmdbRoutes from './routes/tmdb.js';
import { requestMonitor, metricsHandler } from './metrics.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestMonitor);

const spec = YAML.parse(fs.readFileSync(new URL('../openapi.yaml', import.meta.url), 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
app.get('/openapi.json', (_req, res) => res.json(spec));

app.get('/metrics', metricsHandler);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/favorites', favorites);
app.use('/api/tmdb', tmdbRoutes);

app.use((req, res) => res.status(404).json({ error: 'Маршрут не знайдено' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Внутрішня помилка' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API: http://localhost:${port}  Docs: http://localhost:${port}/docs`));
