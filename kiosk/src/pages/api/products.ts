import { NextApiRequest, NextApiResponse } from 'next';

// 상품 데이터를 제공하는 API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://your-backend-api.com/products');  // 외부 API 호출
      const data = await response.json();
      
      return res.status(200).json({ products: data.products || [] });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }  
    
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}