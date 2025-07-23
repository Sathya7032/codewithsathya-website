import React, { useState, useEffect } from 'react';
import './Updates.css';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('all');
  const [expandedUpdate, setExpandedUpdate] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('https://codewithsathya.pythonanywhere.com/updates/');
        if (!response.ok) {
          throw new Error('Failed to fetch updates');
        }
        const data = await response.json();
        setUpdates(data);
        setFilteredUpdates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  useEffect(() => {
    let results = updates;
    
    // Filter by technology
    if (selectedTech !== 'all') {
      results = results.filter(update => 
        update.technology.toLowerCase() === selectedTech.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(update =>
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUpdates(results);
  }, [searchTerm, selectedTech, updates]);

  const getUniqueTechnologies = () => {
    const techs = updates.map(update => update.technology);
    return ['all', ...new Set(techs)];
  };

  const toggleExpand = (id) => {
    setExpandedUpdate(expandedUpdate === id ? null : id);
  };

  if (loading) {
    return (
      <div className="updates-loading">
        <div className="spinner"></div>
        <p>Loading updates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="updates-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Updates</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <>
    <HeaderWithNavbar/>
    <div className="updates-container">
      <header className="updates-header">
        <h1>Technology Updates</h1>
        <p className="subtitle">Stay informed with the latest developments in your favorite technologies</p>
      </header>

      <div className="updates-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-container">
          <label htmlFor="tech-filter" className="filter-label">Filter by Technology:</label>
          <select
            id="tech-filter"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="tech-select"
          >
            {getUniqueTechnologies().map(tech => (
              <option key={tech} value={tech}>
                {tech === 'all' ? 'All Technologies' : tech.charAt(0).toUpperCase() + tech.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="updates-list">
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map(update => (
            <div key={update.id} className={`update-card ${expandedUpdate === update.id ? 'expanded' : ''}`}>
              <div className="update-header" onClick={() => toggleExpand(update.id)}>
                <div className="tech-badge">{update.technology}</div>
                <h3 className="update-title text-black">{update.title}</h3>
                <div className="expand-icon">
                  {expandedUpdate === update.id ? '−' : '+'}
                </div>
              </div>
              
              {expandedUpdate === update.id && (
                <div className="update-content">
                  <div className="update-meta">
                    <span className="author">By {update.author}</span>
                    <span className="date">
                      {new Date(update.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {update.is_featured && (
                      <span className="featured-badge">Featured</span>
                    )}
                  </div>
                  
                  <div 
                    className="update-body" 
                    dangerouslySetInnerHTML={{ __html: update.content }} 
                  />
                  
                  {update.source_url && (
                    <a 
                      href={update.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      Read more at source
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No updates found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedTech('all');
              }}
              className="reset-btn"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Updates;