/**
 * @file Main application component responsible for routing.
 */
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import CustomerRegistrationPage from './features/customers/pages/CustomerRegistrationPage';
import CustomerListPage from './features/customers/pages/CustomerListPage';
import EditCustomerPage from './features/customers/pages/EditCustomerPage';
import APIDocsPage from './features/customers/pages/APIDocsPage'; // Import the new page
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
            <Route path="/api-docs" element={<APIDocsPage />} /> {/* Add the new route */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
