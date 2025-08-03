/**
 * @file A reusable card component designed to wrap forms or sections of content.
 * It provides a consistent layout with a header (icon, title, subtitle) and a content area.
 */

import React from 'react';

/**
 * A styled container component for forms.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.icon - An icon component to display in the card header.
 * @param {string} props.title - The main title for the card.
 * @param {string} props.subtitle - A descriptive subtitle that appears below the title.
 * @param {React.ReactNode} props.children - The content to be rendered inside the card's body (e.g., form fields).
 * @returns {React.ReactNode} The rendered FormCard component.
 */
export const FormCard = ({ icon, title, subtitle, children }) => (
  // The main card container with a subtle background blur effect and shadow.
  // `focus-within` adds a ring to indicate when a child element (like an input) is focused.
  <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
    {/* Card Header */}
    <div className="p-6 border-b border-gray-200 flex items-center gap-4">
      {/* Icon passed as a prop */}
      {icon}
      {/* Title and Subtitle container */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
    {/* Card Body */}
    <div className="p-6">
      {/* Child content (e.g., form inputs) is rendered here */}
      {children}
    </div>
  </div>
);
