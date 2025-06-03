import { useState, useEffect } from 'react';
import GdprConsentPopup from './GdprConsentPopup';
import TitleBar from './TitleBar';

// Import subcomponents
import KeysList from '../data/KeysList';
import StoreDataForm from '../data/StoreDataForm';
import DataViewer from '../data/DataViewer';
import ConsentBanner from '../data/ConsentBanner';
import ErrorMessage from '../shared/ErrorMessage';
import LoadingIndicator from '../shared/LoadingIndicator';

interface DataManagerProps {
  username: string;
  onLogout: () => void;
}

interface RetrievedData {
  data: string | object;
  version: number;
  metadata: Record<string, unknown>;
}

function DataManager({ username, onLogout }: DataManagerProps) {
  // Data states
  const [retrievedData, setRetrievedData] = useState<RetrievedData | null>(null);
  const [userKeys, setUserKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isKeysExpanded, setIsKeysExpanded] = useState(true);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [storeLoading, setStoreLoading] = useState(false);
  const [retrieveLoading, setRetrieveLoading] = useState(false);
  const [error, setError] = useState('');
  
  // GDPR consent states
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<(() => Promise<void>) | null>(null);
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  // Check consent status on component mount
  useEffect(() => {
    checkConsentStatus();
  }, [username]);

  // Function to check if user has already given consent
  const checkConsentStatus = async () => {
    if (!username) return;
    
    try {
      const response = await fetch(`/api/swift/consent?username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setHasConsent(data.hasConsent);
        
        // If user has consent, load their keys
        if (data.hasConsent) {
          loadUserKeys();
        }
      }
    } catch (err: any) {
      console.error('Error checking consent status:', err);
    }
  };

  // Function to load user keys
  const loadUserKeys = async () => {
    if (!username) return;
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/swift/user-keys?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        setUserKeys(data.keys || []);
      } else if (response.status === 404 && data.error === 'No data keys found for this user') {
        // This is a normal state for a new user, not an error
        setUserKeys([]);
      } else {
        setError(data.message || 'Failed to load keys');
      }
    } catch (err: any) {
      setError(`Error loading keys: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to grant consent
  const grantConsent = async () => {
    try {
      setLoading(true);
      setError('');
      
      const consentResponse = await fetch('/api/swift/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      if (!consentResponse.ok) {
        const consentData = await consentResponse.json();
        throw new Error(consentData.message || 'Failed to grant consent');
      }
      
      setHasConsent(true);
      setShowConsentPopup(false);
      
      // Execute pending operation if exists
      if (pendingOperation) {
        await pendingOperation();
        setPendingOperation(null);
      }
      
      // Load user keys after consent
      await loadUserKeys();
    } catch (err: any) {
      setError(`Error granting consent: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle consent cancellation
  const handleCancelConsent = () => {
    setShowConsentPopup(false);
    setPendingOperation(null);
    setLoading(false);
  };

  // Function to ensure consent before operation
  const ensureConsent = async (operation: () => Promise<void>) => {
    if (hasConsent === null) {
      // Still checking consent status
      setError('Please wait while we verify consent status...');
      return;
    }
    
    if (hasConsent) {
      // User already has consent, proceed with operation
      await operation();
    } else {
      // User needs to grant consent first
      setPendingOperation(() => operation);
      setShowConsentPopup(true);
    }
  };

  // Function to store data
  const handleStoreData = async (key: string, data: string, isJson: boolean) => {
    if (!username || !key || !data) {
      setError('Please provide a key and data to store');
      return;
    }
    
    const storeOperation = async () => {
      try {
        setStoreLoading(true);
        setError('');
        
        const dataToSubmit = isJson ? JSON.parse(data) : data;
        
        const encryptResponse = await fetch('/api/swift/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            dataKey: key,
            data: dataToSubmit,
            isJson
          })
        });
        
        const encryptData = await encryptResponse.json();
        
        if (!encryptResponse.ok) {
          throw new Error(encryptData.message || 'Failed to store data');
        }
        
        // Refresh user keys after storing data
        await loadUserKeys();
        
        // Automatically select and display the newly stored data
        setSelectedKey(key);
        await handleRetrieveData(key);
        
      } catch (err: any) {
        setError(`Error storing data: ${err.message}`);
      } finally {
        setStoreLoading(false);
      }
    };
    
    await ensureConsent(storeOperation);
  };

  // Function to retrieve data
  const handleRetrieveData = async (keyToRetrieve: string) => {
    if (!username || !keyToRetrieve) {
      setError('Please provide a key to retrieve');
      return;
    }
    
    const retrieveOperation = async () => {
      try {
        setRetrieveLoading(true);
        setError('');
        setSelectedKey(keyToRetrieve);
        setRetrievedData(null);
        
        const decryptResponse = await fetch('/api/swift/decrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, dataKey: keyToRetrieve })
        });
        
        const decryptData = await decryptResponse.json();
        
        if (!decryptResponse.ok) {
          throw new Error(decryptData.message || 'Failed to decrypt data');
        }
        
        if (!decryptData.result) {
          throw new Error('No data returned from API');
        }
        
        let parsedData = decryptData.result.data;
        if (typeof parsedData === 'string') {
          try {
            const jsonData = JSON.parse(parsedData);
            parsedData = jsonData;
          } catch (e) {}
        }
        
        setRetrievedData({
          data: parsedData,
          version: decryptData.result.version,
          metadata: decryptData.result.metadata || {}
        });
      } catch (err: any) {
        setError(`Error retrieving data: ${err.message}`);
      } finally {
        setRetrieveLoading(false);
      }
    };
    
    await ensureConsent(retrieveOperation);
  };

  // Function to handle revoking consent
  const handleRevokeConsent = async () => {
    try {
      setLoading(true);
      setError('');
      
      await fetch('/api/swift/consent', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      setHasConsent(false);
      setUserKeys([]);
      setRetrievedData(null);
      setSelectedKey(null);
    } catch (err: any) {
      setError(`Error revoking consent: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full">
      {showConsentPopup && (
        <GdprConsentPopup
          username={username}
          onConsent={grantConsent}
          onCancel={handleCancelConsent}
          isOpen={showConsentPopup}
        />
      )}

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full">
        {/* Left Column - White background with controls and keys */}
        <div className="col-span-1 bg-white p-4 flex flex-col">
          {/* Title Bar */}
          <div className="mb-4 border-b border-gray-200">
            <TitleBar title="Swift API Example" />
            
            {/* Move error container here */}
            <div className="transition-opacity duration-300 mt-2">
              <ErrorMessage message={error} />
            </div>
          </div>

          {/* Consent Banner */}
          {username && hasConsent !== null && (
            <ConsentBanner
              hasConsent={hasConsent}
              onRevokeConsent={handleRevokeConsent}
              onGrantConsent={() => setShowConsentPopup(true)}
            />
          )}

          {/* Keys List */}
          <KeysList
            username={username}
            userKeys={userKeys}
            loading={loading}
            error={error}
            selectedKey={selectedKey}
            isKeysExpanded={isKeysExpanded}
            onToggleKeysExpanded={() => setIsKeysExpanded(!isKeysExpanded)}
            onKeySelect={handleRetrieveData}
            onRefreshKeys={loadUserKeys}
          />

          {/* Store Data Form */}
          <StoreDataForm
            username={username}
            onStoreData={handleStoreData}
            storeLoading={storeLoading}
            error={error}
          />
        </div>

        {/* Right Column - Grey background with data display */}
        <div className="col-span-1 bg-gray-100 p-4 min-h-screen overflow-auto">
          <DataViewer
            selectedKey={selectedKey}
            retrievedData={retrievedData}
            loading={retrieveLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default DataManager;
