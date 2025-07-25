import React, { useState, useEffect, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FiSearch, FiX, FiChevronDown, FiChevronUp, FiFilter, FiClock, FiCode } from 'react-icons/fi';
import './SnippetsPage.css';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';

const SnippetsPage = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSnippet, setExpandedSnippet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'descending'
  });
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState('All Technologies');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');

  // Fetch snippets on component mount
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch('https://codewithsathya.pythonanywhere.com/api/snippets/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSnippets(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  // Get unique technologies for filter dropdown
  const technologies = useMemo(() => {
    const techs = snippets.map(snippet => snippet.technology);
    return ['All Technologies', ...new Set(techs)].filter(Boolean);
  }, [snippets]);

  // Get unique languages for filter dropdown
  const languages = useMemo(() => {
    const langs = snippets.map(snippet => snippet.language);
    return ['All Languages', ...new Set(langs)].filter(Boolean);
  }, [snippets]);

  // Filter and sort snippets based on current filters and sort config
  const filteredSnippets = useMemo(() => {
    let result = [...snippets];
    
    // Apply technology filter
    if (selectedTech !== 'All Technologies') {
      result = result.filter(snippet => snippet.technology === selectedTech);
    }
    
    // Apply language filter
    if (selectedLanguage !== 'All Languages') {
      result = result.filter(snippet => snippet.language === selectedLanguage);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(snippet =>
        snippet.title.toLowerCase().includes(term) ||
        snippet.description.toLowerCase().includes(term) ||
        (snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle date comparison
        if (sortConfig.key === 'created_at') {
          return sortConfig.direction === 'ascending' 
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        
        // Handle string comparison
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [snippets, searchTerm, sortConfig, selectedTech, selectedLanguage]);

  // Toggle snippet expansion
  const toggleSnippet = (id) => {
    setExpandedSnippet(prev => prev === id ? null : id);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTech('All Technologies');
    setSelectedLanguage('All Languages');
    setSortConfig({ key: 'created_at', direction: 'descending' });
  };

  // Handle sort requests
  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading snippets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error loading snippets:</p>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <>
      <HeaderWithNavbar />
      <div className="snippets-container">
        <header className="snippets-header">
          <h1>Code Snippets</h1>
          <p className="subtitle">Quick reference for common coding patterns</p>
          
          <div className="filters-container">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="clear-search">
                    <FiX />
                  </button>
                )}
              </div>
            </div>
            
            {/* Technology Filter Dropdown */}
            <div className="filter-dropdown">
              <button 
                className={`dropdown-button ${selectedTech !== 'All Technologies' ? 'active-filter' : ''}`}
                onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
              >
                <FiFilter className="filter-icon" />
                {selectedTech}
                {isTechDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {isTechDropdownOpen && (
                <div className="dropdown-menu">
                  {technologies.map((tech, index) => (
                    <button
                      key={`tech-${index}`}
                      className={`dropdown-item ${tech === selectedTech ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTech(tech);
                        setIsTechDropdownOpen(false);
                      }}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Active filters indicator */}
          {(selectedTech !== 'All Technologies' || selectedLanguage !== 'All Languages' || searchTerm) && (
            <div className="active-filters">
              <span>Active filters:</span>
              {selectedTech !== 'All Technologies' && (
                <span className="filter-tag">
                  Technology: {selectedTech}
                  <button onClick={() => setSelectedTech('All Technologies')} className="remove-filter">
                    <FiX />
                  </button>
                </span>
              )}
              {selectedLanguage !== 'All Languages' && (
                <span className="filter-tag">
                  Language: {selectedLanguage}
                  <button onClick={() => setSelectedLanguage('All Languages')} className="remove-filter">
                    <FiX />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="filter-tag">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="remove-filter">
                    <FiX />
                  </button>
                </span>
              )}
              <button onClick={clearFilters} className="clear-all-filters">
                Clear all
              </button>
            </div>
          )}
        </header>

        {/* Sorting Controls */}
        <div className="sorting-controls">
          <span className="sort-label">Sort by:</span>
          <button 
            className={`sort-button ${sortConfig.key === 'title' ? 'active' : ''}`}
            onClick={() => requestSort('title')}
          >
            Title {sortConfig.key === 'title' && (
              sortConfig.direction === 'ascending' ? '↑' : '↓'
            )}
          </button>
          <button 
            className={`sort-button ${sortConfig.key === 'technology' ? 'active' : ''}`}
            onClick={() => requestSort('technology')}
          >
            Technology {sortConfig.key === 'technology' && (
              sortConfig.direction === 'ascending' ? '↑' : '↓'
            )}
          </button>
          <button 
            className={`sort-button ${sortConfig.key === 'language' ? 'active' : ''}`}
            onClick={() => requestSort('language')}
          >
            Language {sortConfig.key === 'language' && (
              sortConfig.direction === 'ascending' ? '↑' : '↓'
            )}
          </button>
          <button 
            className={`sort-button ${sortConfig.key === 'created_at' ? 'active' : ''}`}
            onClick={() => requestSort('created_at')}
          >
            <FiClock /> Date {sortConfig.key === 'created_at' && (
              sortConfig.direction === 'ascending' ? '↑' : '↓'
            )}
          </button>
        </div>

        {/* Snippets List */}
        <main className="snippets-list">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map((snippet) => (
              <article 
                key={snippet.id} 
                className={`snippet-item ${expandedSnippet === snippet.id ? 'expanded' : ''}`}
              >
                <div 
                  className="snippet-summary" 
                  onClick={() => toggleSnippet(snippet.id)}
                  aria-expanded={expandedSnippet === snippet.id}
                >
                  <div className="snippet-meta">
                    <span className="snippet-tech-badge">
                      {snippet.technology}
                    </span>
                    <span className="snippet-date">
                      {formatDate(snippet.created_at)}
                    </span>
                  </div>
                  <h2 className="snippet-title">{snippet.title}</h2>
                  <p className="snippet-description">
                    {snippet.description.replace(/<[^>]+>/g, '').substring(0, 100)}...
                  </p>
                
                  <div className="snippet-footer">
                    <div className="snippet-tags">
                      {snippet.tags && snippet.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                    <span className="snippet-language">
                      <FiCode /> {snippet.language}
                    </span>
                  </div>
                </div>

                {expandedSnippet === snippet.id && (
                  <div className="snippet-content">
                    <div 
                      className="content-html" 
                      dangerouslySetInnerHTML={{ __html: snippet.description }} 
                    />
                    <div className="code-container">
                      <SyntaxHighlighter
                        language={snippet.language.toLowerCase()}
                        style={atomDark}
                        showLineNumbers={true}
                        wrapLines={true}
                        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                      >
                        {snippet.code}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </article>
            ))
          ) : (
            <div className="no-results">
              <p>No snippets found matching your criteria.</p>
              <button 
                onClick={clearFilters}
                className="clear-filters-button"
              >
                Reset all filters
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default SnippetsPage;