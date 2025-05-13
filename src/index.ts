import { createServer } from "node:http";

// Import must be dynamic for TypeScript compatibility
const ext = process.env.NODE_ENV === "production" ? ".js" : ".ts";
const { handleUserRequest } = await import(`./routes/users${ext}`);

const mode = process.env.NODE_ENV || "development";
console.log(`Running in ${mode} mode`);
// console.log(`ENABLE_SERVER_ERROR_TEST: ${process.env.ENABLE_SERVER_ERROR_TEST}`);

const PORT = Number(process.env.WORKER_PORT) || process.env.PORT || 3000;
if (!PORT) {
  console.error("ERROR: WORKER_PORT is not set! Exiting...");
  process.exit(1);
}

// console.log(`Worker process ${process.pid} is starting at port ${PORT}`);

export const server = createServer(async (req, res) => {
  console.log(`Worker ${process.pid} at PORT ${PORT} received request: ${req.method} ${req.url}`);
  
  if (req.url?.startsWith("/api/users")) {
    return await handleUserRequest(req, res);
  } 
  if (req.url === "/") {
    res.writeHead(200);
    res.end(`This is a node CRUD API server with watch done with Typescript!`);
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
