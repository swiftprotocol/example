/**
 * Environment variable utility functions
 */

// Swift Protocol API URL
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_SWIFT_API_URL || 'https://api.dev.swiftprotocol.zone';
};

// Swift Protocol API Key
export const getApiKey = (): string => {
  return process.env.NEXT_PUBLIC_SWIFT_API_KEY || '';
};

// Check if all required environment variables are set
export const checkRequiredEnvVars = (): { valid: boolean; missing: string[] } => {
  const requiredVars = ['NEXT_PUBLIC_SWIFT_API_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  return {
    valid: missing.length === 0,
    missing
  };
};

// Get environment name (development, production, etc.)
export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};
