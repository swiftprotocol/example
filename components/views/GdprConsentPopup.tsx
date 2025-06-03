import { useState } from 'react';

interface GdprConsentPopupProps {
  username: string;
  onConsent: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function GdprConsentPopup({ username, onConsent, onCancel, isOpen }: GdprConsentPopupProps) {
  const [isChecked, setIsChecked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Data Processing Consent</h2>
          <p className="text-gray-600">
            EU/BR General Data Protection Regulation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="prose prose-sm">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="mb-2">
                <strong>Swift Protocol</strong> securely stores your data using end-to-end encryption.
                Before proceeding, please review and consent to the following:
              </p>
              
              <div className="flex items-center text-blue-700 text-sm mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Required under Article 6(1)(a)</span>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-2 text-blue-800 border-b border-blue-200 pb-1">Data We Process</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Your username identifier (plaintext format)</li>
              <li>Any data keys and values you choose to store</li>
              <li>Encryption metadata (version, timestamps)</li>
            </ul>
          </div>
          
          <div className="prose prose-sm">
            <h3 className="text-lg font-medium mb-2 text-blue-800 border-b border-blue-200 pb-1">How We Process Data</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>All data is encrypted before storage using AES-256 encryption</li>
              <li>Your data is stored in a secure database with access controls</li>
              <li>Data is only accessible to you through your unique identifier</li>
              <li>We maintain consent records as required by regulations</li>
            </ul>
            
            <h3 className="text-lg font-medium mb-2 text-blue-800 border-b border-blue-200 pb-1">Purpose</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>To provide secure data storage and retrieval services</li>
              <li>To demonstrate Swift Protocol's encryption capabilities</li>
              <li>To maintain proper access controls to your data</li>
            </ul>
          </div>
          
          <div className="prose prose-sm">
            <h3 className="text-lg font-medium mb-2 text-blue-800 border-b border-blue-200 pb-1">Your Rights</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Access or correct your stored data at any time</li>
              <li>Request deletion of your data (right to be forgotten)</li>
              <li>Withdraw consent at any time</li>
              <li>Receive a copy of your data in a portable format</li>
            </ul>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600 italic">
              Note: This example app demonstrates Swift Protocol's encryption and GDPR consent capabilities. 
              No actual data is shared with third parties.
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <label className="flex items-start cursor-pointer p-3 bg-blue-50 rounded-lg">
            <input 
              type="checkbox" 
              className="mt-0.5 mr-3 h-5 w-5 text-blue-600" 
              checked={isChecked} 
              onChange={() => setIsChecked(!isChecked)}
            />
            <span className="text-gray-800">
              I, <strong>{username}</strong>, consent to the processing of my data as described above.
              I understand I can withdraw this consent at any time.
            </span>
          </label>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConsent}
            disabled={!isChecked}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Give Consent
          </button>
        </div>
      </div>
    </div>
  );
}
