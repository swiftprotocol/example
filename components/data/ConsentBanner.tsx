import React from 'react';

interface ConsentBannerProps {
  hasConsent: boolean | null;
  onRevokeConsent: () => void;
  onGrantConsent: () => void;
}

const ConsentBanner: React.FC<ConsentBannerProps> = ({
  hasConsent,
  onRevokeConsent,
  onGrantConsent
}) => {
  if (hasConsent === null) {
    return null; // Still checking consent status
  }

  return (
    <div className="mb-4 pb-3 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {hasConsent ? (
            <>
              <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-green-700">GDPR Consent Granted</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium text-yellow-700">GDPR Consent Required</span>
            </>
          )}
        </div>
        {hasConsent ? (
          <button
            onClick={onRevokeConsent}
            className="text-sm text-green-700 hover:text-green-900 underline"
          >
            Revoke Consent
          </button>
        ) : (
          <button
            onClick={onGrantConsent}
            className="text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded"
          >
            Grant Consent
          </button>
        )}
      </div>
    </div>
  );
};

export default ConsentBanner;
