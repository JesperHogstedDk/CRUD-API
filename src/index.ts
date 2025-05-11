// (async () => {
//   console.log('index.ts: esm-pure-experimental-strip-types')
//   const text:string = 'Hello, world!'
//   console.log(text)
// })();
import http from 'node:http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.method === "GET" && req.url === "/api/users") {   
    res.writeHead(200);
    const users = [
      { id: 11, name: 'Jesper' },
      { id: 21, name: 'Karen' },
    ];
    return res.end(JSON.stringify(users));
  }
  res.end(JSON.stringify({
    data: 'This is node CRUD API with watch and Typescript!',
  }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('index.ts: esm-pure-experimental-strip-types');
});

// (async () => {
//   console.log('index.ts: esm-pure-experimental-strip-types')
//   const text:string = 'Hello, world!'
//   console.log(text)

// })();

