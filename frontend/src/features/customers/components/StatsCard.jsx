/**
 * @file A card component for displaying stats on the customer dashboard.
 */
import React from 'react';

export const StatsCard = ({ icon, title, value, change, color = "blue" }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600' }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
                            {change.startsWith('+') && '↗ '}{change}
                        </p>
                    )}
                </div>
                <div className={`p-3 ${colorClasses[color].bg} rounded-lg`}>
                    {React.cloneElement(icon, { className: `h-6 w-6 ${colorClasses[color].text}` })}
                </div>
            </div>
        </div>
    );
};
