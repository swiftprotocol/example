import React, { useState, useEffect } from 'react';

interface JsonViewerProps {
  data: object;
  initialExpanded?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, initialExpanded = false }) => {
  // Track expanded state for each node path
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});
  
  // Set initial root expansion state when component mounts
  useEffect(() => {
    // Only set root expansion if it hasn't been manually toggled yet
    setIsExpanded(prev => ({
      ...prev,
      // If root hasn't been explicitly set yet, use initialExpanded
      root: prev.root === undefined ? initialExpanded : prev.root
    }));
  }, [initialExpanded]);

  const toggleExpand = (path: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderValue = (value: any, path: string, depth: number = 0): JSX.Element => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (value === undefined) return <span className="text-gray-500">undefined</span>;
    
    if (typeof value === 'boolean') {
      return <span className="text-purple-600">{value.toString()}</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="text-blue-600">{value}</span>;
    }
    
    if (typeof value === 'string') {
      return <span className="text-green-600">"{value}"</span>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-500">[]</span>;
      
      // Use the expanded state for this path
      const isNodeExpanded = isExpanded[path];
      
      return (
        <div>
          <span 
            className="cursor-pointer text-gray-700 hover:text-blue-500"
            onClick={() => toggleExpand(path)}
          >
            [ {isNodeExpanded ? '−' : '+'} ] {value.length} items
          </span>
          
          {isNodeExpanded && (
            <div className="pl-4 border-l border-gray-300 ml-1">
              {value.map((item, index) => (
                <div key={index} className="my-1">
                  <span className="text-gray-500 mr-2">{index}:</span>
                  {renderValue(item, `${path}.${index}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Object
    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) return <span className="text-gray-500">{'{}'}</span>;
      
      // Use the expanded state for this path
      const isNodeExpanded = isExpanded[path];
      
      return (
        <div>
          <span 
            className="cursor-pointer text-gray-700 hover:text-blue-500"
            onClick={() => toggleExpand(path)}
          >
            {'{'} {isNodeExpanded ? '−' : '+'} {'}'} {keys.length} properties
          </span>
          
          {isNodeExpanded && (
            <div className="pl-4 border-l border-gray-300 ml-1">
              {keys.map(key => (
                <div key={key} className="my-1">
                  <span className="text-gray-800 font-medium mr-2">{key}:</span>
                  {renderValue(value[key], `${path}.${key}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm bg-gray-50 p-3 rounded-md overflow-auto max-h-80">
      {renderValue(data, 'root', 0)}
    </div>
  );
};

export default JsonViewer;
