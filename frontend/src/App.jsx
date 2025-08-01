// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerRegistrationPage from './pages/CustomerRegistrationPage';
import CustomerListPage from './pages/CustomerListPage';

function App() {
  return (
    <BrowserRouter>
      {/* The main wrapper with background color */}
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 py-8 px-4">
        <main>
          {/* The Navigation component has been removed from here */}
          <Routes>
            <Route path="/" element={<CustomerRegistrationPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
