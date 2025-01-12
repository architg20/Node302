const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const filePath = 'form_data.txt';

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    fs.readFile(filePath, 'utf8', (err, data) => {
      let messages = data || '';
      res.setHeader('Content-Type', 'text/html');
      res.write('<h1>Messages:</h1>');
      res.write('<pre>' + messages + '</pre>');
      res.write('<form method="POST" action="/">');
      res.write('Name: <input type="text" name="name"><br>');
      res.write('Email: <input type="text" name="email"><br>');
      res.write('<input type="submit" value="Submit">');
      res.write('</form>');
      res.end();
    });
  } else if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const formData = querystring.parse(body);
      const dataToWrite = `Name: ${formData.name}\nEmail: ${formData.email}\n\n`;

      fs.readFile(filePath, 'utf8', (err, existingData) => {
        if (err) {
          existingData = '';
        }

        const updatedData = dataToWrite + existingData;

        fs.writeFile(filePath, updatedData, (err) => {
          if (err) {
            res.statusCode = 500;
            res.write('Error writing to file');
            res.end();
            return;
          }

          res.writeHead(302, { Location: '/' });
          res.end();
        });
      });
    });
  } else {
    res.statusCode = 404;
    res.write('<h1>Page Not Found</h1>');
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
