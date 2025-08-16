/**
 * @file A reusable header component for pages, featuring an icon, title, and subtitle.
 */
import React from 'react';

export const PageHeader = ({ icon, title, subtitle }) => (
    <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4 shadow-lg">
            {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-lg text-gray-600">{subtitle}</p>
    </div>
);
