import type { NextApiRequest, NextApiResponse } from 'next';
import { getSwiftClient, createPlaintextUserId } from '../../../lib/swift-client';

type UserKeysResponse = {
  status: string;
  message: string;
  keys?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserKeysResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const { username } = req.query;
    
    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required query parameter: username'
      });
    }

    const swiftClient = getSwiftClient();
    const userId = createPlaintextUserId(username);
    
    // List user keys
    const keys = await swiftClient.listUserKeys(userId);
    
    return res.status(200).json({
      status: 'success',
      message: 'User keys retrieved successfully',
      keys
    });
  } catch (error: any) {
    console.error('Error retrieving user keys:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to retrieve user keys'
    });
  }
}
