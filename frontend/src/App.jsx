/**
 * @file Main application component responsible for routing.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import CustomerRegistrationPage from './features/customers/pages/CustomerRegistrationPage';
import CustomerListPage from './features/customers/pages/CustomerListPage';
import EditCustomerPage from './features/customers/pages/EditCustomerPage';
import { NotificationProvider } from './hooks/useNotification';

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<CustomerRegistrationPage />} />
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/edit/:customerId" element={<EditCustomerPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
