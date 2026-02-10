const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AquaMii is here!\n');
});

server.listen(3001, () => {
  console.log('Listening on port 3001');
});
