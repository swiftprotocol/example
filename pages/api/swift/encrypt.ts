import type { NextApiRequest, NextApiResponse } from 'next';
import { getSwiftClient, createPlaintextUserId } from '../../../lib/swift-client';

type EncryptRequest = {
  username: string;
  dataKey: string;
  data: string | object;
  isJson?: boolean;
};

type EncryptResponse = {
  status: string;
  message: string;
  result?: {
    ciphertext: string;
    version: number;
    metadata: Record<string, unknown>;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EncryptResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const { username, dataKey, data, isJson } = req.body as EncryptRequest;
    
    if (!username || !dataKey || data === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: username, dataKey, and data are required'
      });
    }

    const swiftClient = getSwiftClient();
    const userId = createPlaintextUserId(username);
    
    // First ensure consent is granted
    await swiftClient.grantConsent(userId);
    
    // Then encrypt the data - Swift SDK accepts both string and object types
    // The isJson flag is passed from the client to indicate if the data should be treated as JSON
    const result = await swiftClient.encrypt(userId, dataKey, data);
    
    return res.status(200).json({
      status: 'success',
      message: 'Data encrypted successfully',
      result
    });
  } catch (error: any) {
    console.error('Encryption error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to encrypt data'
    });
  }
}
