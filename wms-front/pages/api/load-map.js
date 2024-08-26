// pages/api/load-map.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), 'public/map', 'rectangles.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error loading map data:', err);
        return res.status(500).send('Error loading map data');
      }
      res.status(200).json(JSON.parse(data));
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
