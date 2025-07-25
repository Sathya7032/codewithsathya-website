import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './TechnologyDetail.css';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';

const TechnologyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        const response = await fetch(`https://codewithsathya.pythonanywhere.com/api/technologies/${slug}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch technology details');
        }
        const data = await response.json();
        setTechnology(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnology();
  }, [slug]);

  if (loading) {
    return (
      <div className="tech-loading-container">
        <div className="tech-spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
        <p>Loading {slug} details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tech-error-container">
        <div className="tech-error-card">
          <div className="tech-error-icon">⚠️</div>
          <h3>Error Loading Technology</h3>
          <p>{error}</p>
          <button 
            className="tech-retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
          <button 
            className="tech-back-btn"
            onClick={() => navigate('/technologies')}
          >
            Back to Technologies
          </button>
        </div>
      </div>
    );
  }

  if (!technology) {
    return (
      <div className="tech-not-found">
        <h2>Technology not found</h2>
        <p>The requested technology ({slug}) could not be found.</p>
        <button 
          className="tech-back-btn"
          onClick={() => navigate('/technologies')}
        >
          Back to Technologies
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
    <HeaderWithNavbar/>
    <div className="tech-detail-container">
      <div className="tech-header">
        <div className="tech-header-content">
          <div className="tech-logo-container">
            <img 
              src={technology.logo} 
              alt={`${technology.name} logo`} 
              className="tech-logo" 
            />
          </div>
          <div className="tech-title-container">
            <h1>{technology.name}</h1>
            <div className="tech-tags">
              {technology.tags.map((tag, index) => (
                <span key={index} className="tech-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tech-nav-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tutorials' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutorials')}
        >
          Tutorials ({technology.tutorials.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          Blog Posts ({technology.blog_posts.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'snippets' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippets')}
        >
          Code Snippets ({technology.code_snippets.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => setActiveTab('updates')}
        >
          Updates ({technology.tech_updates.length})
        </button>
      </div>

      <div className="tech-content">
        {activeTab === 'overview' && (
          <div className="tech-overview">
            <div className="tech-description">
              <h2>About {technology.name}</h2>
              <p>{technology.description}</p>
            </div>
            
            <div className="tech-stats">
              <div className="stat-card">
                <h3>Tutorials</h3>
                <p>{technology.tutorials.length}</p>
              </div>
              <div className="stat-card">
                <h3>Blog Posts</h3>
                <p>{technology.blog_posts.length}</p>
              </div>
              <div className="stat-card">
                <h3>Code Snippets</h3>
                <p>{technology.code_snippets.length}</p>
              </div>
              <div className="stat-card">
                <h3>Updates</h3>
                <p>{technology.tech_updates.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tutorials' && (
          <div className="tech-tutorials">
            {technology.tutorials.length > 0 ? (
              technology.tutorials.map(tutorial => (
                <Link 
                  to={`/topics/${tutorial.slug}`} 
                  key={tutorial.id} 
                  className="tech-item-card"
                >
                  <div className="item-thumbnail">
                    {tutorial.thumbnail && (
                      <img src={tutorial.thumbnail} alt={tutorial.title} />
                    )}
                  </div>
                  <div className="item-content">
                    <h3>{tutorial.title}</h3>
                    <div className="item-meta">
                      <span className="difficulty">{tutorial.difficulty}</span>
                      <span className="date">{formatDate(tutorial.published_date)}</span>
                    </div>
                    
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-items">
                <p>No tutorials available for {technology.name} yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="tech-blog-posts">
            {technology.blog_posts.length > 0 ? (
              technology.blog_posts.map(post => (
                <Link 
                  to={`/blog/${post.slug}`} 
                  key={post.id} 
                  className="tech-item-card"
                >
                  <div className="item-thumbnail">
                    {post.thumbnail && (
                      <img src={post.thumbnail} alt={post.title} />
                    )}
                  </div>
                  <div className="item-content">
                    <h3>{post.title}</h3>
                    <div className="item-meta">
                      <span className="author">By {post.author}</span>
                      <span className="date">{formatDate(post.published_date)}</span>
                    </div>
                    <p className="item-excerpt">
                      {post.excerpt || post.content.substring(0, 150)}...
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-items">
                <p>No blog posts available for {technology.name} yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'snippets' && (
          <div className="tech-code-snippets">
            {technology.code_snippets.length > 0 ? (
              technology.code_snippets.map(snippet => (
                <Link 
                  to={`/snippets/${snippet.slug}`} 
                  key={snippet.id} 
                  className="tech-snippet-card"
                >
                  <div className="snippet-header">
                    <h3>{snippet.title}</h3>
                    <span className="language">{snippet.language}</span>
                  </div>
                  <div className="snippet-description">
                    <p>{snippet.description}</p>
                  </div>
                  <pre className="snippet-preview">
                    <code>{snippet.code.substring(0, 100)}...</code>
                  </pre>
                </Link>
              ))
            ) : (
              <div className="no-items">
                <p>No code snippets available for {technology.name} yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="tech-updates">
            {technology.tech_updates.length > 0 ? (
              technology.tech_updates.map(update => (
                <Link 
                  to={`/updates/${update.slug}`} 
                  key={update.id} 
                  className="tech-update-card"
                >
                  <div className="update-header">
                    <h3>{update.title}</h3>
                    {update.is_featured && (
                      <span className="featured-badge">Featured</span>
                    )}
                  </div>
                  <div className="update-meta">
                    <span className="author">By {update.author}</span>
                    <span className="date">{formatDate(update.published_date)}</span>
                  </div>
                  <div 
                    className="update-excerpt"
                    dangerouslySetInnerHTML={{ 
                      __html: update.content.substring(0, 200) + '...' 
                    }}
                  />
                </Link>
              ))
            ) : (
              <div className="no-items">
                <p>No updates available for {technology.name} yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default TechnologyDetail;