import type { NextApiRequest, NextApiResponse } from 'next';
import { getSwiftClient, createPlaintextUserId } from '../../../lib/swift-client';

type ConsentResponse = {
  status: string;
  message: string;
  hasConsent?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConsentResponse>
) {
  try {
    let username;
    
    // For GET requests, use query parameters
    if (req.method === 'GET') {
      username = req.query.username as string;
    } else {
      // For POST and DELETE, use request body
      username = req.body.username;
    }
    
    if (!username) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameter: username'
      });
    }

    const swiftClient = getSwiftClient();
    const userId = createPlaintextUserId(username);
    
    if (req.method === 'POST') {
      // Grant consent
      await swiftClient.grantConsent(userId);
      return res.status(200).json({
        status: 'success',
        message: 'Consent granted successfully',
        hasConsent: true
      });
    } else if (req.method === 'GET') {
      // Verify consent
      const hasConsent = await swiftClient.verifyConsent(userId);
      return res.status(200).json({
        status: 'success',
        message: hasConsent ? 'User has granted consent' : 'User has not granted consent',
        hasConsent
      });
    } else if (req.method === 'DELETE') {
      // Revoke consent
      await swiftClient.revokeConsent(userId);
      return res.status(200).json({
        status: 'success',
        message: 'Consent revoked successfully',
        hasConsent: false
      });
    } else {
      return res.status(405).json({ 
        status: 'error', 
        message: 'Method not allowed' 
      });
    }
  } catch (error: any) {
    console.error('Consent operation error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to perform consent operation'
    });
  }
}
