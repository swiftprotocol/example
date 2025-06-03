import { useState } from 'react';
import UserLogin from '../components/views/UserLogin';
import DataManager from '../components/views/DataManager';
import Head from 'next/head';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Function to handle login
  const handleLogin = async (username: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Check if the API is healthy
      const response = await fetch('/api/swift/health');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API health check failed');
      }
      
      console.log('API Health:', data.details);
      
      // Set username and logged in state
      setUsername(username);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(`Error logging in: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <>
      <Head>
        <title>Swift API Example</title>
        <meta name="description" content="Example app demonstrating Swift Protocol SDK for secure data storage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 w-full">
        <div className="w-full h-full">
          {!isLoggedIn ? (
            <UserLogin onLogin={handleLogin} loading={loading} />
          ) : (
            <DataManager username={username} onLogout={handleLogout} />
          )}
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
