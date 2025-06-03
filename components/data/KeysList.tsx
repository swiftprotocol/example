import React from 'react';
import LoadingIndicator from '../shared/LoadingIndicator';
import ErrorMessage from '../shared/ErrorMessage';

interface KeysListProps {
  username: string;
  userKeys: string[];
  loading: boolean;
  error: string;
  selectedKey: string | null;
  isKeysExpanded: boolean;
  onToggleKeysExpanded: () => void;
  onKeySelect: (key: string) => void;
  onRefreshKeys: () => void;
}

const KeysList: React.FC<KeysListProps> = ({
  username,
  userKeys,
  loading,
  error,
  selectedKey,
  isKeysExpanded,
  onToggleKeysExpanded,
  onKeySelect,
  onRefreshKeys
}) => {
  return (
    <div className="mb-4 pb-3 border-b border-gray-200">
      <div className="flex justify-between items-center mb-1">
        <button 
          className="text-gray-700 font-medium flex items-center" 
          onClick={onToggleKeysExpanded}
          type="button"
        >
          <svg
            className={`mr-2 h-5 w-5 transform transition-transform ${isKeysExpanded ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
          <span>Stored Data Keys</span>
        </button>

        <button
          className="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
          onClick={onRefreshKeys}
          disabled={loading}
          type="button"
        >
          Refresh
        </button>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-300 ${isKeysExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {loading && (
          <div className="flex justify-center items-center py-3 mt-2">
            <LoadingIndicator size="small" text="Loading keys..." />
          </div>    
        )}
        

        {!loading && userKeys.length > 0 ? (
          <div className="grid grid-cols-2 mt-2 gap-2 overflow-y-auto">
            {userKeys.map((key, index) => (
              <button
                key={key}
                className={`text-left px-2 py-1 border border-gray-300 font-mono text-xs truncate ${selectedKey === key ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                onClick={() => onKeySelect(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center mt-3 mb-2 text-center">
            <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-sm">No data keys found</p>
            <p className="text-gray-400 text-xs mt-1">Store some data to create keys</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeysList;
