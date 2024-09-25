// pages/api/load-json.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'public/json', 'tableDataTest.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading JSON data:', err);
        return res.status(500).send('Error reading JSON data');
      }
      res.status(200).json(JSON.parse(data));
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
