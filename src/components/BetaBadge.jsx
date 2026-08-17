import React from 'react';
import './BetaBadge.css';

export const BetaBadge = ({ className = '' }) => {
  return (
    <span className={`beta-badge ${className}`}>
      Beta Testing
    </span>
  );
};
