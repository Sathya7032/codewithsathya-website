import React, { useState, useEffect } from 'react';
import './Technologies.css';
import { API_BASE_URL } from '../Api';

const Technologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Array of vibrant colors for tech cards
  const cardColors = [
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(135deg, #a6ffcb 0%, #12d8fa 50%, #1fa2ff 100%)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  ];

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/technologies/`);
        if (!response.ok) {
          throw new Error('Failed to fetch technologies');
        }
        const data = await response.json();
        setTechnologies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
        <p className="loading-text">Loading Technologies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="technologies-section">
      <div className="container">
        <div className="section-header">
          <h2>Technologies We Cover</h2>
          <p className="subtitle">
            Explore the programming languages and frameworks we provide resources for. 
            Master the tools that power modern applications.
          </p>
          <div className="header-divider"></div>
        </div>

        <div className="technologies-grid">
          {technologies.map((tech, index) => (
            <div 
              key={tech.id} 
              className="tech-card"
              style={{ 
                background: cardColors[index % cardColors.length],
                borderTop: `5px solid ${getBorderColor(index)}`
              }}
            >
              <div className="tech-card-header">
                <div className="tech-logo-container">
                  <img 
                    src={tech.logo} 
                    alt={`${tech.name} logo`} 
                    className="tech-logo" 
                  />
                </div>
                <h3>{tech.name}</h3>
              </div>
              <div className="tech-card-body">
                <p>{tech.description}</p>
                <div className="tech-tags">
                  {tech.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="tech-tag"
                      style={{ backgroundColor: getTagColor(tagIndex) }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="tech-card-footer">
                <a 
                  href={`/technologies/${tech.slug}`} 
                  className="learn-btn"
                  style={{ backgroundColor: getButtonColor(index) }}
                >
                  Learn {tech.name} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper functions for dynamic colors
function getBorderColor(index) {
  const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#7d5fff', '#ff6b81', '#70a1ff', '#eccc68'];
  return colors[index % colors.length];
}

function getTagColor(index) {
  const colors = ['rgba(48, 48, 60, 0.2)', 'rgba(30, 144, 255, 0.2)', 'rgba(46, 213, 115, 0.2)', 'rgba(91, 145, 244, 0.2)'];
  return colors[index % colors.length];
}

function getButtonColor(index) {
  const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#7d5fff'];
  return colors[index % colors.length];
}

export default Technologies;