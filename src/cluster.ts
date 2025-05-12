import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import { createServer, request } from "node:http";

const LOAD_BALANCER_PORT = 3000;
const numWorkers = availableParallelism() - 1; // Number of worker processes
const workerPorts: number[] = [];
let currentWorkerIndex = 0;

if (cluster.isPrimary) {
  console.log(`Primary process started. Spawning ${numWorkers} instances of index.ts...`);

  for (let i = 1; i <= numWorkers; i++) {
    const workerPort = LOAD_BALANCER_PORT + i;
    workerPorts.push(workerPort);
    
    const worker = cluster.fork({ WORKER_PORT: workerPort });

    worker.on("online", () => {
      console.log(`Worker on port ${workerPort} is fully initialized.`);
    });

    worker.on("exit", (code) => {
      console.error(`Worker on port ${workerPort} exited with code ${code}. Restarting...`);
      cluster.fork({ WORKER_PORT: workerPort });
    });
  }

  // Load balancer: Routes requests using Round-robin
  const balancer = createServer((req, res) => {
    const workerPort = workerPorts[currentWorkerIndex];
    currentWorkerIndex = (currentWorkerIndex + 1) % numWorkers;

    console.log(`🔄 Forwarding request to worker on port ${workerPort}`);

    const proxyReq = request(
      { hostname: "localhost", port: workerPort, path: req.url, method: req.method, headers: req.headers },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode!, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on("error", (err) => {
      console.error(`Error forwarding request: ${err.message}`);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Worker unavailable" }));
    });

    req.pipe(proxyReq);
  });

  balancer.listen(LOAD_BALANCER_PORT, () => console.log(`Load balancer running at http://localhost:${LOAD_BALANCER_PORT}/api`));
} else {
  console.log(`Worker process ${process.pid} starting index.ts on port ${process.env.WORKER_PORT}...`);
  await import("./index.ts"); // Launch application instance
}