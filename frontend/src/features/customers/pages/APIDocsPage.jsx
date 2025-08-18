/**
 * @file A page to display the Swagger UI documentation via an iframe.
 */
import React from 'react';
import { BookOpen } from 'lucide-react';
import { PageHeader } from '../../../components/common/PageHeader';
import { Navigation } from '../../../components/common/Navigation';

const APIDocsPage = () => {
  const backendBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const swaggerUiUrl = `${backendBaseUrl}/swagger-ui.html`;


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <PageHeader
        icon={<BookOpen />}
        title="API Documentation"
        subtitle="Live interactive API documentation via Swagger UI"
      />
      <Navigation />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8 border border-gray-200">
        <iframe
          src={swaggerUiUrl}
          title="API Documentation"
          width="100%"
          height="800px" // You can adjust this height as needed
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
};

export default APIDocsPage;
