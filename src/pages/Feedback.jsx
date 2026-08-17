import React, { useState } from 'react';
import { BetaBadge } from '../components/BetaBadge';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../api';
import { CheckCircle2 } from 'lucide-react';
import './Feedback.css';

export const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'general',
    rating: '5',
    description: '',
    intent: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIsolatedSubmit = async (data) => {
    if (data.description.trim().length === 0) {
      throw new Error("Feedback description is required.");
    }
    
    try {
      await api.submitFeedback(data);
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await handleIsolatedSubmit(formData);
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        type: 'general',
        rating: '5',
        description: '',
        intent: ''
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong while submitting feedback.');
    }
  };

  if (status === 'success') {
    return (
      <div className="feedback-page">
        <div className="container feedback-container">
          <div className="feedback-success-state">
            <CheckCircle2 size={64} className="success-icon" />
            <h2>Thank You!</h2>
            <p>Your feedback is invaluable to improving Oveka AI during our beta testing phase.</p>
            <Button onClick={() => setStatus('idle')} className="mt-4">
              Submit More Feedback
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-page">
      <div className="container feedback-container">
        <div className="feedback-header">
          <BetaBadge className="mb-4" />
          <h1 className="feedback-title">Beta Feedback</h1>
          <p className="feedback-subtitle">
            Help us improve Oveka AI. Tell us about your experience, report bugs, or suggest features.
          </p>
        </div>

        <div className="feedback-form-card">
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-row">
              <Input
                label="Name (Optional)"
                name="name"
                placeholder="How should we address you?"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="Email (Optional)"
                name="email"
                type="email"
                placeholder="If you'd like a response"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="input-wrapper">
                <label className="input-label">Feedback Type</label>
                <select 
                  name="type" 
                  className="input-field select-field"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="general">General Experience</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="quality">Note Quality Issue</option>
                </select>
              </div>

              <div className="input-wrapper">
                <label className="input-label">Satisfaction</label>
                <select 
                  name="rating" 
                  className="input-field select-field"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Very Poor</option>
                </select>
              </div>
            </div>

            <Input
              label="What were you trying to do? (Optional)"
              name="intent"
              placeholder="E.g. Trying to get notes from a 2 hour long podcast..."
              value={formData.intent}
              onChange={handleChange}
            />

            <Input
              label="Feedback Description *"
              name="description"
              type="textarea"
              placeholder="Please be as specific as possible..."
              value={formData.description}
              onChange={handleChange}
              error={status === 'error' && errorMessage}
              required
            />

            <div className="form-actions">
              <Button 
                type="submit" 
                size="lg" 
                fullWidth 
                isLoading={status === 'loading'}
              >
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
