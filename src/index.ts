import { createServer } from 'node:http';

const ext = process.env.NODE_ENV === "production" ? ".js" : ".ts";
const { handleUserRequest }  = await import(`./routes/users${ext}`);
// import { handleUserRequest } from './routes/users.ts';

const mode = process.env.NODE_ENV || 'development';
console.log(`Running in ${mode} mode`);
console.log(`ENABLE_SERVER_ERROR_TEST: ${(process.env.ENABLE_SERVER_ERROR_TEST)}`);

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  console.log("Request received:", req.method, req.url);
  if (req.url?.startsWith("/api/users")) {
    return await handleUserRequest(req, res);
  } else if (req.url === "/") {
    res.writeHead(200);
    res.end('This is a node CRUD API server with watch done with Typescript!');  
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('index.ts: esm-pure-experimental-strip-types');
});
