// src/pages/CustomerListPage.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

// --- Navigation component for consistency ---
const Navigation = () => (
  <nav className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-2 flex items-center justify-center gap-2 mb-8 max-w-sm mx-auto">
    <NavLink
      to="/"
      className={({ isActive }) =>
        `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
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
        `px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
          isActive
            ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200/70'
        }`
      }
    >
      Customer List
    </NavLink>
  </nav>
);

const CustomerListPage = () => (
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer List</h1>

    {/* --- Navigation has been added here for consistency --- */}
    <Navigation />

    <p className="text-lg text-gray-600">This page is under construction. It will display all registered customers.</p>
  </div>
);

export default CustomerListPage;
