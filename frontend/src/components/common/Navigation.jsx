/**
 * @file Main navigation component for the application.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navigation = () => (
  <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-2 flex items-center justify-center gap-2 max-w-md mx-auto">
    <NavLink
      to="/"
      className={({ isActive }) =>
        `px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200/70'
        }`
      }
    >
      Register
    </NavLink>
    <NavLink
      to="/customers"
      className={({ isActive }) =>
        `px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200/70'
        }`
      }
    >
      Customer List
    </NavLink>
    <NavLink
      to="/api-docs"
      className={({ isActive }) =>
        `px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200/70'
        }`
      }
    >
      API Docs
    </NavLink>
  </nav>
);
