import React from 'react';
import './Input.css';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div className="input-container">
        <Component
          id={inputId}
          ref={ref}
          type={isTextarea ? undefined : type}
          className={`input-field ${error ? 'input-error' : ''} ${isTextarea ? 'input-textarea' : ''}`}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`input-message ${error ? 'input-message-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
