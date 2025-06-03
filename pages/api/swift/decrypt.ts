import type { NextApiRequest, NextApiResponse } from 'next';
import { getSwiftClient, createPlaintextUserId } from '../../../lib/swift-client';

type DecryptRequest = {
  username: string;
  dataKey: string;
};

type DecryptResponse = {
  status: string;
  message: string;
  result?: {
    data: string | object;
    version: number;
    metadata: Record<string, unknown>;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DecryptResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const { username, dataKey } = req.body as DecryptRequest;
    
    if (!username || !dataKey) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: username and dataKey are required'
      });
    }

    const swiftClient = getSwiftClient();
    const userId = createPlaintextUserId(username);
    
    // Verify consent
    const hasConsent = await swiftClient.verifyConsent(userId);
    if (!hasConsent) {
      // Grant consent if not already granted
      await swiftClient.grantConsent(userId);
    }
    
    // Decrypt the data
    const result = await swiftClient.decrypt(userId, dataKey);
    
    return res.status(200).json({
      status: 'success',
      message: 'Data decrypted successfully',
      result
    });
  } catch (error: any) {
    console.error('Decryption error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to decrypt data'
    });
  }
}
