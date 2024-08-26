// pages/api/save-map.js
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set desired size limit
    },
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const mapData = req.body;

    const filePath = path.join(process.cwd(), 'public/map', 'rectangles.json');

    fs.writeFile(filePath, JSON.stringify(mapData, null, 2), (err) => {
      if (err) {
        console.error('Error saving map data:', err);
        return res.status(500).send('Error saving map data');
      }
      res.status(200).send('Map data saved successfully');
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
