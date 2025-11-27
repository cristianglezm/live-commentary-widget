import React from 'react';
import type { LoadingState } from '../types';

interface LoadingStatusProps {
  state: LoadingState;
}

const LoadingStatus: React.FC<LoadingStatusProps> = ({ state }) => {
  if (state.status !== 'loading' && state.status !== 'error') return null;

  return (
    <div className="absolute inset-0 bg-lc-bg/95 z-40 flex flex-col items-center justify-center p-6 text-lc-text backdrop-blur-sm">
      {state.status === 'error' ? (
         <div className="text-center">
            <div className="text-red-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="font-bold text-lg">System Malfunction</h3>
            <p className="text-sm text-lc-text-muted mt-2">{state.error}</p>
         </div>
      ) : (
          <>
            <h3 className="font-bold text-lg mb-6 text-center">{state.message || 'Initializing AI...'}</h3>
            <div className="w-full space-y-3">
                {state.progressItems.map((item) => (
                <div key={item.file} className="text-xs w-full">
                    <div className="flex justify-between mb-1 text-lc-text-muted">
                        <span className="truncate max-w-[70%]">{item.file}</span>
                        <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-lc-surface-hover rounded-full h-1">
                        <div 
                            className="bg-lc-accent h-1 rounded-full transition-all duration-200" 
                            style={{ width: `${item.progress}%` }}
                        ></div>
                    </div>
                </div>
                ))}
            </div>
          </>
      )}
    </div>
  );
};

export default LoadingStatus;
