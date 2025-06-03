import { useState } from 'react';
import TitleBar from './TitleBar';

interface UserLoginProps {
  onLogin: (username: string) => void;
  loading: boolean;
}

export default function UserLogin({ onLogin, loading }: UserLoginProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    setError('');
    onLogin(username);
  };

  return (
    <div className="w-full max-w-full">
      {/* Main two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen w-full">
        {/* Left Column - White background with login form */}
        <div className="col-span-1 bg-white p-4 flex flex-col">
          {/* Title Bar */}
          <div className="mb-4 border-b border-gray-200">
            <TitleBar title="Swift API Example" />
            
            {error && (
              <div className="transition-opacity duration-300 mt-2">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              </div>
            )}
          </div>
          
          {/* Login Form */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <h3 className="text-md font-medium mb-3">Login with Username</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={loading || !username}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Grey background with instructions */}
        <div className="col-span-1 bg-gray-100 p-4 min-h-screen overflow-auto">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-3">Swift Protocol API Example</h3>
            <p className="mb-3 text-gray-700">
              This example demonstrates secure data storage using Swift Protocol.
            </p>
            <p className="mb-3 text-gray-700">
              Enter any username to begin. Once logged in, you'll be able to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-700">
              <li className="mb-1">Store encrypted data linked to your username</li>
              <li className="mb-1">View your previously stored data keys</li>
              <li className="mb-1">Retrieve and decrypt your data</li>
              <li className="mb-1">Manage GDPR consent for your data</li>
            </ul>
            <p className="text-sm text-gray-500">
              All data is securely encrypted and stored using APUS-v2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
