import React from 'react';
import JsonViewer from './JsonViewer';
import LoadingIndicator from '../shared/LoadingIndicator';

interface RetrievedData {
  data: string | object;
  version: number;
  metadata: Record<string, unknown>;
}

interface DataViewerProps {
  selectedKey: string | null;
  retrievedData: RetrievedData | null;
  loading: boolean;
}

const DataViewer: React.FC<DataViewerProps> = ({
  selectedKey,
  retrievedData,
  loading
}) => {
  return (
    <div className="bg-gray-100 p-4 h-full">
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator text="Retrieving data..." />
        </div>
      ) : selectedKey ? (
        retrievedData ? (
          <div>
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Retrieved Key</h4>
              <div className="font-mono text-sm bg-white p-2 border border-gray-300 rounded">{selectedKey}</div>
            </div>
            
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Data</h4>
              <div className="bg-white border border-gray-300 rounded p-3 overflow-auto max-h-[400px]">
                {typeof retrievedData.data === 'object' ? (
                  <JsonViewer data={retrievedData.data} initialExpanded={true} />
                ) : (
                  <div className="font-mono text-sm whitespace-pre-wrap break-words">
                    {retrievedData.data as string}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Version</h4>
                <div className="font-mono text-sm bg-white p-2 border border-gray-300 rounded">
                  {retrievedData.version}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Metadata</h4>
                <div className="font-mono text-sm bg-white p-2 border border-gray-300 rounded overflow-auto max-h-[150px]">
                  <JsonViewer data={retrievedData.metadata} initialExpanded={true} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            Click "Retrieve" to view data
          </div>
        )
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500 italic">
          Select a key to view data
        </div>
      )}
    </div>
  );
};

export default DataViewer;
