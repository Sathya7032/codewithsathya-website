import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './SnippetsPage.css'
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';

const SnippetsPage = () => {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
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

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch('https://codewithsathya.pythonanywhere.com/snippets/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Sort snippets initially by creation date (newest first)
        const sortedSnippets = [...data].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setSnippets(sortedSnippets);
        setFilteredSnippets(sortedSnippets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  useEffect(() => {
    let result = [...snippets];
    
    // Apply technology filter
    if (selectedTech !== 'All Technologies') {
      result = result.filter(snippet => snippet.technology === selectedTech);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(snippet =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredSnippets(result);
  }, [snippets, searchTerm, sortConfig, selectedTech]);

  const toggleSnippet = (id) => {
    if (expandedSnippet === id) {
      setExpandedSnippet(null);
    } else {
      setExpandedSnippet(id);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getUniqueTechnologies = () => {
    const techs = snippets.map(snippet => snippet.technology);
    return ['All Technologies', ...new Set(techs)];
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
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
    <HeaderWithNavbar/>
    <div className="snippets-container">
      <header className="snippets-header">
        <h1>Code Snippets</h1>
        <p>Handy code examples for various technologies</p>
        
        <div className="filters-container">
          {/* Search Bar */}
          <div className="search-container-code">
            <div className="search-bar-code">
              <FiSearch className="search-icon-code" />
              <input
                type="text"
                placeholder="Search snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-code"
                
              />
              {searchTerm && (
                <button onClick={clearSearch} className="clear-search-code">
                  <FiX />
                </button>
              )}
            </div>
          </div>
          
          {/* Technology Dropdown */}
          <div className="tech-dropdown">
            <button 
              className="dropdown-button"
              onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
            >
              {selectedTech}
              {isTechDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {isTechDropdownOpen && (
              <div className="dropdown-menu">
                {getUniqueTechnologies().map((tech, index) => (
                  <button
                    key={index}
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
        
        {searchTerm && (
          <div className="search-results-count">
            {filteredSnippets.length} {filteredSnippets.length === 1 ? 'result' : 'results'} found
          </div>
        )}
      </header>

      {/* Sorting Controls */}
      <div className="sorting-controls">
        <span>Sort by:</span>
        <button 
          className={`sort-button ${sortConfig.key === 'title' ? 'active' : ''}`}
          onClick={() => requestSort('title')}
        >
          Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </button>
        <button 
          className={`sort-button ${sortConfig.key === 'created_at' ? 'active' : ''}`}
          onClick={() => requestSort('created_at')}
        >
          Date {sortConfig.key === 'created_at' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </button>
        <button 
          className={`sort-button ${sortConfig.key === 'technology' ? 'active' : ''}`}
          onClick={() => requestSort('technology')}
        >
          Technology {sortConfig.key === 'technology' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
        </button>
      </div>

      <main className="snippets-list">
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map((snippet) => (
            <article key={snippet.id} className={`snippet-item ${expandedSnippet === snippet.id ? 'expanded' : ''}`}>
              <div 
                className="snippet-summary" 
                onClick={() => toggleSnippet(snippet.id)}
                aria-expanded={expandedSnippet === snippet.id}
              >
                <div className="snippet-meta">
                  <span className="snippet-tech">{snippet.technology}</span>
                  <span className="snippet-date">{formatDate(snippet.created_at)}</span>
                </div>
                <h2 className="snippet-title">{snippet.title}</h2>
              
                <div className="snippet-tags">
                  {snippet.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="snippet-language">Language: {snippet.language}</div>
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
              onClick={() => {
                setSearchTerm('');
                setSelectedTech('All Technologies');
              }} 
              className="clear-filters-button"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <footer className="snippets-footer">
        <p>© {new Date().getFullYear()} CodeWithSathya. All rights reserved.</p>
      </footer>
    </div>
    <Footer/>
    </>
  );
};

export default SnippetsPage;
