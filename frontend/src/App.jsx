import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerRegistrationPage from './pages/CustomerRegistrationPage';
import CustomerListPage from './pages/CustomerListPage';
import EditCustomerPage from './pages/EditCustomerPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 py-8 px-4">
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
