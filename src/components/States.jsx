import React from 'react';
import { Loader2, AlertCircle, FileQuestion } from 'lucide-react';
import './States.css';
import { Button } from './Button';

export const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="state-container state-loading">
      <Loader2 className="state-icon spin" size={48} />
      <h3 className="state-title">{message}</h3>
    </div>
  );
};

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => {
  return (
    <div className="state-container state-error">
      <AlertCircle className="state-icon" size={48} />
      <h3 className="state-title">Oops!</h3>
      <p className="state-message">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="state-action">
          Try Again
        </Button>
      )}
    </div>
  );
};

export const EmptyState = ({ title = 'No data', message = '', icon: Icon = FileQuestion, action }) => {
  return (
    <div className="state-container state-empty">
      <Icon className="state-icon" size={48} />
      <h3 className="state-title">{title}</h3>
      {message && <p className="state-message">{message}</p>}
      {action && <div className="state-action">{action}</div>}
    </div>
  );
};
