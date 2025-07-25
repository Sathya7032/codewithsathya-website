import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiPlay,
  FiBook,
  FiClock,
  FiEye,
} from "react-icons/fi";
import "./TutorialsPage.css";
import HeaderWithNavbar from "../components/HeaderWithNavbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState([]);
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "published_date",
    direction: "descending",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    technology: "All",
    difficulty: "All",
    hasVideo: "All",
  });

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch(
          "https://codewithsathya.pythonanywhere.com/api/tutorials/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTutorials(data.results);
        setFilteredTutorials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  useEffect(() => {
    let result = [...tutorials];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      result = result.filter(
        (tutorial) =>
          tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tutorial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tutorial.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply technology filter
    if (filters.technology !== "All") {
      result = result.filter(
        (tutorial) => tutorial.technology === filters.technology
      );
    }

    // Apply difficulty filter
    if (filters.difficulty !== "All") {
      result = result.filter(
        (tutorial) => tutorial.difficulty === filters.difficulty
      );
    }

    // Apply video filter
    if (filters.hasVideo !== "All") {
      result = result.filter((tutorial) =>
        filters.hasVideo === "Yes" ? tutorial.video_url : !tutorial.video_url
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Special handling for dates
        if (
          sortConfig.key === "published_date" ||
          sortConfig.key === "created_at"
        ) {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredTutorials(result);
  }, [tutorials, searchTerm, sortConfig, filters]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getUniqueValues = (key) => {
    const values = tutorials.map((tutorial) => tutorial[key]);
    return ["All", ...new Set(values)];
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tutorials...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <>
      <HeaderWithNavbar />
      <div className="tutorials-container">
        {/* Hero Section */}
        <section className="tutorials-hero">
          <div className="hero-content">
            <h1>Expand Your Knowledge</h1>
            <p>
              Browse our collection of professional tutorials to enhance your
              skills
            </p>

            {/* Search Bar */}
            <div className="search-container-tutorials">
              <div className="search-bar-tutorials">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-tutorials"
                />
                {searchTerm && (
                  <button onClick={clearSearch} className="clear-search-tutorials">
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="tutorials-main">
          {/* Sidebar Filters */}
          <aside className="tutorials-sidebar">
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button
                className="toggle-filters"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {isFilterOpen ? "Hide" : "Show"} Filters
                {isFilterOpen ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>

            <div className={`filters-content ${isFilterOpen ? "open" : ""}`}>
              {/* Technology Filter */}
              <div className="filter-group">
                <h4>Technology</h4>
                <div className="filter-options">
                  {getUniqueValues("technology").map((tech, index) => (
                    <button
                      key={`tech-${index}`}
                      className={`filter-option ${
                        filters.technology === tech ? "active" : ""
                      }`}
                      onClick={() =>
                        setFilters({ ...filters, technology: tech })
                      }
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="filter-group">
                <h4>Difficulty</h4>
                <div className="filter-options">
                  {getUniqueValues("difficulty").map((diff, index) => (
                    <button
                      key={`diff-${index}`}
                      className={`filter-option ${
                        filters.difficulty === diff ? "active" : ""
                      }`}
                      onClick={() =>
                        setFilters({ ...filters, difficulty: diff })
                      }
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Filter */}
              <div className="filter-group">
                <h4>Has Video</h4>
                <div className="filter-options">
                  {["All", "Yes", "No"].map((option, index) => (
                    <button
                      key={`video-${index}`}
                      className={`filter-option ${
                        filters.hasVideo === option ? "active" : ""
                      }`}
                      onClick={() =>
                        setFilters({ ...filters, hasVideo: option })
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="reset-filters"
                onClick={() =>
                  setFilters({
                    technology: "All",
                    difficulty: "All",
                    hasVideo: "All",
                  })
                }
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Tutorials List */}
          <main className="tutorials-list">
            {/* Sorting and Results Info */}
            <div className="list-header">
              <div className="results-count">
                {filteredTutorials.length}{" "}
                {filteredTutorials.length === 1 ? "result" : "results"} found
              </div>
              <div className="sort-options">
                <span>Sort by:</span>
                <button
                  className={`sort-button ${
                    sortConfig.key === "title" ? "active" : ""
                  }`}
                  onClick={() => requestSort("title")}
                >
                  Title{" "}
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </button>
                <button
                  className={`sort-button ${
                    sortConfig.key === "published_date" ? "active" : ""
                  }`}
                  onClick={() => requestSort("published_date")}
                >
                  Date{" "}
                  {sortConfig.key === "published_date" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </button>
                <button
                  className={`sort-button ${
                    sortConfig.key === "views" ? "active" : ""
                  }`}
                  onClick={() => requestSort("views")}
                >
                  Popularity{" "}
                  {sortConfig.key === "views" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </button>
              </div>
            </div>

            {/* Tutorial Cards */}
            {filteredTutorials.length > 0 ? (
              <div className="tutorials-grid">
                {filteredTutorials.map((tutorial) => (
                  <article key={tutorial.id} className="tutorial-card">
                    <div className="card-image">
                      {tutorial.thumbnail ? (
                        <img src={tutorial.thumbnail} alt={tutorial.title} />
                      ) : (
                        <div className="thumbnail-placeholder">
                          <FiBook size={48} />
                        </div>
                      )}
                      {tutorial.video_url && (
                        <div className="video-badge">
                          <FiPlay size={16} />
                          <span>Includes Video</span>
                        </div>
                      )}
                    </div>
                    <div className="card-content">
                      <div className="card-meta">
                        <span
                          className={`difficulty-badge ${tutorial.difficulty}`}
                        >
                          {tutorial.difficulty}
                        </span>
                        <span className="tech-tag">{tutorial.technology}</span>
                      </div>
                      <h3 className="card-title">{tutorial.title}</h3>
                      <p className="card-description">
                        {truncateText(tutorial.content)}
                      </p>
                      
                      <Link to={`/topics/${tutorial.slug}`}><button style={{width:'100%', backgroundColor:'darkslategray'}} className="btn btn-success">View Topics</button></Link>
                      <div className="card-footer">
                        <div className="footer-meta">
                          <span className="meta-item">
                            <FiClock size={14} />
                            {formatDate(tutorial.published_date)}
                          </span>
                          <span className="meta-item">
                            <FiEye size={14} />
                            {tutorial.views} views
                          </span>
                        </div>
                        <div className="card-tags">
                          {tutorial.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No tutorials found matching your criteria</h3>
                <p>Try adjusting your filters or search term</p>
                <button
                  className="clear-all"
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      technology: "All",
                      difficulty: "All",
                      hasVideo: "All",
                    });
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TutorialsPage;
