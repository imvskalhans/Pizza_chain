/**
 * @file This is the root component of the application.
 * It sets up the main layout and configures the client-side routing.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import global styles
import './App.css';

// Import page components with .jsx extension
import CustomerRegistrationPage from './pages/CustomerRegistrationPage.jsx';
import CustomerListPage from './pages/CustomerListPage.jsx';
import EditCustomerPage from './pages/EditCustomerPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 py-8 px-4 font-sans">
        <main>
          <Routes>
            <Route path="/" element={<CustomerRegistrationPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/edit/:customerId" element={<EditCustomerPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
