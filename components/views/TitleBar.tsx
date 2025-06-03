import React from 'react';

interface TitleBarProps {
  title: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mb-2 md:mb-0">{title}</h1>
      <div className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
        <svg className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>API Online</span>
      </div>
    </div>
  );
};

export default TitleBar;
