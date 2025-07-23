import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content-v1">
        <h1 className="hero-title">
          <span className="title-accent">Master</span> Modern Tech Skills
        </h1>
        <p className="hero-subtitle">
          Premium tutorials, code snippets, and tech insights to accelerate your learning journey
        </p>
        
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">📝</div>
            <h3>Expert Blogs</h3>
            <p>In-depth technical articles</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">💻</div>
            <h3>Code Snippets</h3>
            <p>Production-ready examples</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🎓</div>
            <h3>Tutorials</h3>
            <p>Step-by-step guides</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🚀</div>
            <h3>Tech Updates</h3>
            <p>Latest industry trends</p>
          </div>
        </div>
        
        <div className="cta-buttons">
          <button className="primary-btn">Start Learning</button>
          <button className="secondary-btn">Explore Content</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;