import { SwiftClient, type UserId } from '@swiftprotocol/sdk';

// Create a singleton Swift client instance
let swiftClient: SwiftClient | null = null;

export function getSwiftClient(): SwiftClient {
  if (!swiftClient) {
    const apiUrl = process.env.SWIFT_API_URL || 'https://dev.api.swiftprotocol.zone';
    const apiKey = process.env.SWIFT_API_KEY;
    
    if (!apiKey) {
      throw new Error('SWIFT_API_KEY environment variable is required');
    }
    
    swiftClient = new SwiftClient({
      baseUrl: apiUrl,
      apiKey: apiKey
    });
  }
  
  return swiftClient;
}

// Helper function to create a plaintext user ID
export function createPlaintextUserId(value: string): UserId {
  return {
    type: 'PLAINTEXT' as const,
    value
  };
}
