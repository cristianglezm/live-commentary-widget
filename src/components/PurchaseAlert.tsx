import React from 'react';

export const PurchaseAlert = ({ message, colorClass }: { message: string, colorClass: string }) => (
    <div className={`fixed bottom-5 left-5 ${colorClass} text-white p-4 rounded-lg shadow-xl animate-fade-in z-[100] max-w-xs md:max-w-md border-2 border-white/20`} role="alert">
        <p className="font-bold text-lg mb-1">Notification</p>
        <p>{message}</p>
    </div>
);
