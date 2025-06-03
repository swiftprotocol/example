import type { NextApiRequest, NextApiResponse } from 'next';
import { getSwiftClient } from '../../../lib/swift-client';

type HealthResponse = {
  status: string;
  message: string;
  details?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const swiftClient = getSwiftClient();
    const health = await swiftClient.health();
    
    return res.status(200).json({
      status: 'success',
      message: 'API is healthy',
      details: health
    });
  } catch (error: any) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to check API health'
    });
  }
}
