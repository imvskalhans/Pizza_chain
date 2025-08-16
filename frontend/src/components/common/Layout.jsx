/**
 * @file Provides a consistent layout wrapper for all pages.
 */
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 px-4">
      <main>
        {children}
      </main>
      <footer className="text-center mt-12 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Pizza Chain. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
