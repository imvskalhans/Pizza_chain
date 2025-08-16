/**
 * @file A card component for grouping form sections.
 */
import React from 'react';

export const FormCard = ({ icon, title, subtitle, children }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
    <div className="p-6 border-b border-gray-200 flex items-center gap-3">
      {React.cloneElement(icon, { className: "w-6 h-6 text-orange-500" })}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);
