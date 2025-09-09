// High-concurrency cluster launcher for GPCQ PWA
const cluster = require('cluster');
const os = require('os');

const isPrimary = cluster.isPrimary || cluster.isMaster;

function determineConcurrency() {
  const cores = os.cpus().length;
  const envSet = parseInt(process.env.WEB_CONCURRENCY || '0', 10);
  if (envSet && envSet > 0) return Math.min(envSet, cores);
  return cores; // default: use all available cores
}

if (isPrimary) {
  const numWorkers = determineConcurrency();
  console.log(`[Cluster] Primary ${process.pid} starting ${numWorkers} workers (cores=${os.cpus().length})`);

  for (let i = 0; i < numWorkers; i += 1) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`[Cluster] Worker ${worker.process.pid} (id=${worker.id}) online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.error(`[Cluster] Worker ${worker.process.pid} (id=${worker.id}) exited (code=${code}, signal=${signal}). Restarting...`);
    setTimeout(() => cluster.fork(), 1000); // simple backoff
  });

  process.on('SIGTERM', () => {
    console.log('[Cluster] SIGTERM received. Shutting down workers...');
    for (const id in cluster.workers) {
      try { cluster.workers[id].process.kill('SIGTERM'); } catch (_) {}
    }
    setTimeout(() => process.exit(0), 3000);
  });
} else {
  // Worker: set an id for logs/endpoints and start the HTTP server
  process.env.WORKER_ID = String(cluster.worker.id);
  require('./server');
}


