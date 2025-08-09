const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ECA-Connect</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 40px; 
          background-color: #f5f5f5; 
        }
        .container { 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          padding: 20px; 
          border-radius: 8px; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>ECA-Connect</h1>
        <p>Welcome to ECA-Connect application!</p>
        <p>The server is running successfully on port 3000.</p>
      </div>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
