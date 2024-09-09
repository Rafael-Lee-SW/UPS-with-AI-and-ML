import { NextApiRequest, NextApiResponse } from 'next';

// 키 값을 검증하는 API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { key } = req.body;

    try {
      const response = await fetch('https://your-backend-api.com/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),  // 키 값을 백엔드로 전송
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
      } else {
        return res.status(401).json({ message: 'Invalid key' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to validate key' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}