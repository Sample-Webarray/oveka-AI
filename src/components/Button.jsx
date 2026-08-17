import React from 'react';
import './Button.css';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, text
  size = 'md', // sm, md, lg
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const loadingClass = isLoading ? 'btn-loading' : '';
  
  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="btn-spinner" size={18} />}
      <span className="btn-content">{children}</span>
    </button>
  );
};
