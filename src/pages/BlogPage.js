import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './BlogPage.css';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://codewithsathya.pythonanywhere.com/api/blogs/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Sort blogs in reverse order by ID (newest first)
        const sortedBlogs = [...data.results].sort((a, b) => b.id - a.id);
        setBlogs(sortedBlogs);
        setFilteredBlogs(sortedBlogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchTerm, blogs]);

  const toggleBlog = (id) => {
    if (expandedBlog === id) {
      setExpandedBlog(null);
    } else {
      setExpandedBlog(id);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
    <HeaderWithNavbar/>
    <div className="blog-container">
      <header className="blog-header">
        <h1>CodeWithSathya Blog</h1>
        <p>Insights and tutorials on programming technologies</p>
        
        {/* Professional Search Bar */}
        <div className="search-container-blog">
          <div className="search-bar-blog">
            <FiSearch className="search-icon-blog" />
            <input
              type="text"
              placeholder="Search blog posts by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-blog"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search-blog">
                <FiX />
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="search-results-count">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'} found
            </div>
          )}
        </div>
      </header>

      <main className="blog-list">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <article key={blog.id} className={`blog-post ${expandedBlog === blog.id ? 'expanded' : ''}`}>
              <div 
                className="blog-summary" 
                onClick={() => toggleBlog(blog.id)}
                aria-expanded={expandedBlog === blog.id}
              >
                <div className="blog-meta">
                  <span className="blog-category">{blog.technology}</span>
                  <span className="blog-date">{formatDate(blog.published_date)}</span>
                </div>
                <h2 className="blog-title">{blog.title}</h2>
                <Link to={`/blog/${blog.slug}`}><h5 style={{textDecoration:'none', color:'skyblue'}}>Read the full blog ---- <FaArrowRight/></h5></Link>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-tags">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="blog-author">By {blog.author}</div>
              </div>
            </article>
          ))
        ) : (
          <div className="no-results">
            <p>No blog posts found matching your search.</p>
            <button onClick={clearSearch} className="clear-search-button">
              Clear search
            </button>
          </div>
        )}
      </main>

      <footer className="blog-footer">
        <p>© {new Date().getFullYear()} CodeWithSathya. All rights reserved.</p>
      </footer>
    </div>
    <Footer/>
    </>
  );
};

export default BlogPage;