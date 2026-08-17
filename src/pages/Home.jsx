import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { BetaBadge } from '../components/BetaBadge';
import { FileText, Video, Sparkles, MessageSquare, Zap, Target, BookOpen } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="home-page">
      
      {/* Hero Section */}
      <section className="hero-section bg-gradient-hero">
        <div className="container hero-container">
          <div className="hero-content reveal-on-scroll">
            <BetaBadge className="hero-badge" />
            <h1 className="hero-title">
              Turn YouTube Learning into <br/>
              <span className="text-highlight">Structured Notes</span>
            </h1>
            <p className="hero-description">
              Oveka AI instantly converts educational videos into clean, readable study material. Stop pausing every 10 seconds and start retaining what you watch.
            </p>
            <div className="hero-actions">
              <Button size="xl" onClick={() => navigate('/notes')} className="hero-primary-btn pill-btn shadow-btn">
                START GENERATING NOTES
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate('/feedback')} className="hero-secondary-btn pill-btn">
                GIVE FEEDBACK
              </Button>
            </div>
          </div>

          {/* Product Preview Mockup */}
          <div className="hero-product-preview reveal-on-scroll delay-200">
            <div className="preview-glow"></div>
            <div className="preview-card layer-back"></div>
            <div className="preview-card layer-middle"></div>
            <div className="preview-card layer-front">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="preview-url-bar">youtube.com/watch?v=...</div>
              </div>
              <div className="preview-body">
                <div className="preview-title-skeleton"></div>
                <div className="preview-text-skeleton short"></div>
                <div className="preview-content-box">
                  <div className="preview-heading-skeleton"></div>
                  <div className="preview-text-skeleton"></div>
                  <div className="preview-text-skeleton"></div>
                  <div className="preview-text-skeleton short"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to transform your video learning.</p>
          </div>
          
          <div className="cards-grid">
            <div className="feature-card step-card reveal-on-scroll delay-100">
              <div className="card-icon-wrapper">
                <span className="step-number">01</span>
              </div>
              <h3>Paste a URL</h3>
              <p>Drop any educational YouTube link into Oveka AI. We accept videos of almost any length.</p>
            </div>

            <div className="feature-card step-card reveal-on-scroll delay-200">
              <div className="card-icon-wrapper">
                <span className="step-number">02</span>
              </div>
              <h3>AI Processing</h3>
              <p>Our advanced models extract the core concepts, filtering out filler words and tangents.</p>
            </div>

            <div className="feature-card step-card reveal-on-scroll delay-300">
              <div className="card-icon-wrapper">
                <span className="step-number">03</span>
              </div>
              <h3>Get Structured Notes</h3>
              <p>Receive beautifully formatted study notes organized with headings and key bullet points.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-section bg-gradient-section">
        <div className="container">
          <div className="section-header reveal-on-scroll">
            <h2 className="section-title">Built for Smarter YouTube Learning</h2>
            <p className="section-subtitle">Designed to remove the friction between watching content and retaining knowledge.</p>
          </div>
          
          <div className="cards-grid">
            <div className="feature-card value-card reveal-on-scroll delay-100">
              <div className="value-icon-wrapper">
                <FileText className="value-icon" size={28} />
              </div>
              <h3>Structured Formatting</h3>
              <p>Notes are automatically formatted with proper hierarchy, making them easy to skim and review.</p>
            </div>

            <div className="feature-card value-card reveal-on-scroll delay-200">
              <div className="value-icon-wrapper">
                <Zap className="value-icon" size={28} />
              </div>
              <h3>Faster Revision</h3>
              <p>Read through an hour-long lecture in 5 minutes. Quickly find the exact concept you need.</p>
            </div>

            <div className="feature-card value-card reveal-on-scroll delay-300">
              <div className="value-icon-wrapper">
                <Target className="value-icon" size={28} />
              </div>
              <h3>Learn Without Pausing</h3>
              <p>Focus entirely on understanding the video. Let Oveka AI handle the tedious note-taking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beta CTA Section */}
      <section className="cta-section">
        <div className="container cta-container reveal-on-scroll">
          <div className="cta-content">
            <BetaBadge className="mb-md" />
            <h2>Help shape the future of learning</h2>
            <p>Oveka AI is currently in beta. Try it out and let us know what you think.</p>
            <Button size="xl" onClick={() => navigate('/notes')} className="pill-btn mt-md shadow-btn">
              START GENERATING NOTES
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
