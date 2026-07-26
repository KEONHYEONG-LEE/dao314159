import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing paymentId or txid in request body' });
  }

  if (!PI_API_KEY) {
    console.error('[Pi Complete Error] PI_API_KEY가 Vercel 환경변수에 설정되지 않았습니다.');
    return res.status(500).json({ error: 'PI_API_KEY configuration missing on server' });
  }

  try {
    console.log(`[Pi Complete Request] paymentId: ${paymentId}, txid: ${txid} 완료 처리 중...`);

    const response = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log(`[Pi Complete Success] paymentId: ${paymentId} 트랜잭션 정상 완료!`);
    return res.status(200).json({
      message: 'Payment completed successfully',
      data: response.data,
    });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errorDetails = error.response?.data || error.message;
    console.error(`[Pi Complete Failed] Status: ${status}`, JSON.stringify(errorDetails));

    return res.status(status).json({
      error: 'Failed to complete payment',
      details: errorDetails,
    });
  }
}
