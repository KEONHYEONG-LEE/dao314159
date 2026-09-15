import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { paymentId } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId) {
    return res.status(400).json({ error: 'Missing paymentId in request body' });
  }

  if (!PI_API_KEY) {
    console.error('[Pi Approve Error] PI_API_KEY가 Vercel 환경변수에 설정되지 않았습니다.');
    return res.status(500).json({ error: 'PI_API_KEY configuration missing on server' });
  }

  try {
    console.log(`[Pi Approve Request] paymentId: ${paymentId} 승인 요청 시도 중...`);
    
    // Pi Platform API 승인 호출
    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log(`[Pi Approve Success] paymentId: ${paymentId} 승인 완료!`);
    return res.status(200).json({ 
      message: 'Payment approved successfully',
      data: response.data 
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errorDetails = error.response?.data || error.message;
    console.error(`[Pi Approve Failed] Status: ${status}`, JSON.stringify(errorDetails));

    return res.status(status).json({
      error: 'Failed to approve payment',
      details: errorDetails,
    });
  }
}
