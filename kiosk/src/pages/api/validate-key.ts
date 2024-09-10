// src/pages/api/verify-token.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  // 예시: 'my-secret-token'이라는 토큰을 유효하다고 가정
  if (token === 'my-secret-token') {
    res.status(200).json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
}
