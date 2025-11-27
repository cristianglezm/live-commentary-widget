import React from 'react';

export const FeatureIcon = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <div className={`${className} rounded-lg w-12 h-12 flex items-center justify-center mb-4 ring-1 shadow-lg`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {children}
        </svg>
    </div>
);
