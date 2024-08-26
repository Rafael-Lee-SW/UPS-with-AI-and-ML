// pages/api/save-json.js
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
    const tableData = req.body;

    // Define the path to save the JSON file
    const filePath = path.join(process.cwd(), 'public/json', 'tableDataTest.json');

    // Write the JSON data to a file
    fs.writeFile(filePath, JSON.stringify(tableData, null, 2), (err) => {
      if (err) {
        console.error('Error saving JSON data:', err);
        return res.status(500).send('Error saving JSON data');
      }
      res.status(200).send('JSON data saved successfully');
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
