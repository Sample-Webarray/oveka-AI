import React from 'react';
import { BetaBadge } from '../components/BetaBadge';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import creatorPhoto from '../assets/creator-photo.jpg';
import './About.css';

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="container about-container">
        
        <div className="about-header">
          <BetaBadge className="about-badge" />
          <h1 className="about-title">About Oveka AI</h1>
          <p className="about-subtitle">
            Transforming how we learn from video content.
          </p>
        </div>

        <div className="about-content">
          <section className="about-section about-intro-card">
            <h2>Why it exists</h2>
            <p>
              Video platforms like YouTube are incredible repositories of human knowledge, but they present a unique challenge: it's hard to review, reference, and search video content effectively. 
            </p>
            <p>
              Oveka AI was built to solve this. By instantly converting educational videos into structured, readable study notes, we aim to eliminate the friction between consuming content and actually retaining it. No more pausing every 10 seconds to write things down.
            </p>
          </section>

          <section className="about-section creator-section">
            <div className="creator-photo-container">
              <img src={creatorPhoto} alt="Creator" className="creator-photo" />
            </div>
            <div className="creator-info">
              <h2>Aditya Vikram Singh</h2>
              <p>
                Hi, I'm Aditya, the creator of Oveka AI. I built this tool because I was frustrated by how much time I spent pausing and rewinding educational videos just to take notes. 
              </p>
              <p>
                My goal is to make learning from video as efficient as reading a well-structured textbook.
              </p>
            </div>
          </section>

          <section className="about-section beta-notice">
            <h2>Beta Testing Phase</h2>
            <p>
              Oveka AI is currently in active beta. We are continually refining our AI models, processing speeds, and note structuring capabilities. During this phase, your feedback is crucial in shaping the future of the product.
            </p>
            <Button variant="outline" className="pill-btn mt-md" onClick={() => navigate('/feedback')}>
              Share Your Feedback
            </Button>
          </section>
        </div>

      </div>
    </div>
  );
};
