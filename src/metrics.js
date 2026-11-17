// Простий моніторинг: логування кожного запиту + агреговані метрики в памʼяті
const stats = { startedAt: Date.now(), total: 0, errors: 0, totalMs: 0, byStatus: {} };

export function requestMonitor(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    stats.total++;
    stats.totalMs += ms;
    if (res.statusCode >= 500) stats.errors++;
    stats.byStatus[res.statusCode] = (stats.byStatus[res.statusCode] || 0) + 1;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`);
  });
  next();
}

export function metricsHandler(_req, res) {
  const mem = process.memoryUsage();
  res.json({
    uptime_seconds: Math.round(process.uptime()),
    requests_total: stats.total,
    errors_5xx: stats.errors,
    avg_response_ms: stats.total ? +(stats.totalMs / stats.total).toFixed(2) : 0,
    by_status: stats.byStatus,
    memory_mb: { rss: +(mem.rss / 1048576).toFixed(1), heap_used: +(mem.heapUsed / 1048576).toFixed(1) }
  });
}
