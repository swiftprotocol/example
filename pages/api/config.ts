import type { NextApiRequest, NextApiResponse } from 'next';

type ConfigResponse = {
  apiUrl: string;
};

// This endpoint provides public configuration without exposing sensitive API keys
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConfigResponse>
) {
  res.status(200).json({
    apiUrl: process.env.NEXT_PUBLIC_SWIFT_API_URL || 'https://api.dev.swiftprotocol.zone',
  });
}
