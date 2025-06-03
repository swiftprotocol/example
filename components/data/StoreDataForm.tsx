import React, { useState } from 'react';
import LoadingIndicator from '../shared/LoadingIndicator';
import ErrorMessage from '../shared/ErrorMessage';

interface StoreDataFormProps {
  username: string;
  onStoreData: (key: string, data: string, isJson: boolean) => Promise<void>;
  storeLoading: boolean;
  error: string;
}

const StoreDataForm: React.FC<StoreDataFormProps> = ({
  username,
  onStoreData,
  storeLoading,
  error
}) => {
  const [dataKey, setDataKey] = useState('');
  const [dataToStore, setDataToStore] = useState('');
  const [dataType, setDataType] = useState<'string' | 'object'>('string');
  const [jsonError, setJsonError] = useState('');

  const handleDataTypeChange = (type: 'string' | 'object') => {
    setDataType(type);
    setJsonError('');
  };

  const validateAndStoreData = async () => {
    if (!username || !dataKey || !dataToStore) {
      return;
    }

    if (dataType === 'object') {
      try {
        JSON.parse(dataToStore);
        setJsonError('');
      } catch (err) {
        setJsonError('Invalid JSON format');
        return;
      }
    }

    await onStoreData(dataKey, dataToStore, dataType === 'object');
  };

  return (
    <div>
      <h3 className="text-md font-medium mb-3">Store Data</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Data Key</label>
        <input
          type="text"
          value={dataKey}
          onChange={(e) => setDataKey(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="Enter a key name"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">Data to Store</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded ${dataType === 'string' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => handleDataTypeChange('string')}
            >
              String
            </button>
            <button
              type="button"
              className={`text-xs px-2 py-1 rounded ${dataType === 'object' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => handleDataTypeChange('object')}
            >
              JSON
            </button>
          </div>
        </div>
        
        <textarea
          value={dataToStore}
          onChange={(e) => setDataToStore(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded h-32 font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder={dataType === 'object' ? '{"example": "value"}' : 'Enter data to store'}
        />
        
        {jsonError && (
          <p className="mt-1 text-sm text-red-600">{jsonError}</p>
        )}
      </div>
       
      {storeLoading && (
        <div className="h-8 mb-4">
          <LoadingIndicator size="small" text="Storing data..." />
        </div>
      )}

      <button
        type="button"
        onClick={validateAndStoreData}
        disabled={!username || !dataKey || !dataToStore || storeLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Store Data
      </button>
    </div>
  );
};

export default StoreDataForm;
