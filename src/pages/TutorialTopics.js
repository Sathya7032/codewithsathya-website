import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Card, 
  Badge, 
  Spinner, 
  Alert, 
  Form, 
  InputGroup,
  Button
} from 'react-bootstrap';
import './topics.css';
import { useParams } from 'react-router-dom';
import HeaderWithNavbar from '../components/HeaderWithNavbar'
import Footer from '../components/Footer'

const TutorialTopics = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`https://codewithsathya.pythonanywhere.com/tutorials/${slug}/`);
        setTopics(response.data.topics || []);
        setFilteredTopics(response.data.topics || []);
      } catch (err) {
        setError(err.message);
        setFilteredTopics([]); // Ensure filteredTopics is set even on error
      } finally {
        setLoading(false);
      }
    };
  
    fetchTopics();
  }, [slug]);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTopics(topics);
      return;
    }
  
    const searchTermLower = searchTerm.toLowerCase();
    const results = topics.filter(topic => 
      topic.title.toLowerCase().includes(searchTermLower) ||
      (topic.tags && topic.tags.some(tag => 
        tag.toLowerCase().includes(searchTermLower)
      )
    ));
    
    setFilteredTopics(results);
  }, [searchTerm, topics]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleExpand = (id) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="topics-container">
        <Container className="text-center py-5">
          <Spinner animation="border" variant="light" />
          <h5 className="mt-3 text-light">Loading Tutorials...</h5>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topics-container">
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Data</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <>
    <HeaderWithNavbar/>
    <div className="topics-container">
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h1 className="text-light mb-3 mb-md-0">Tutorial Topics</h1>
          
          <Form.Group className="search-box-topics">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search by title or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-topics"
              />
              <Button variant="outline-light" className="search-button-topics">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form.Group>
        </div>

        {filteredTopics.length === 0 ? (
          <Alert variant="info" className="text-center">
            {searchTerm ? 'No matching topics found.' : 'No topics available.'}
          </Alert>
        ) : (
          filteredTopics.map((topic) => (
            <Card key={topic.id} className="mb-4 topic-card">
              <Card.Body>
                <div 
                  className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
                  onClick={() => toggleExpand(topic.id)}
                >
                  <Card.Title 
                    className={`text-dark ${expandedTopicId === topic.id ? 'active-title' : ''}`}
                  >
                    {topic.title}
                    <i className={`bi bi-chevron-${expandedTopicId === topic.id ? 'up' : 'down'} ms-2`}></i>
                  </Card.Title>
                  {topic.is_free && (
                    <Badge bg="success" className="fs-6">
                      FREE
                    </Badge>
                  )}
                </div>

                <div className="mb-3">
                  {topic.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-2 tag-badge">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {expandedTopicId === topic.id && (
                  <>
                    <hr className="divider" />

                    <div
                      className="content-html"
                      dangerouslySetInnerHTML={{ __html: topic.content }}
                    />

                    {topic.code_snippet && (
                      <pre className="code-snippet mt-3">
                        <code>{topic.code_snippet}</code>
                      </pre>
                    )}

                    {topic.video_url && (
                      <div className="mt-3">
                        <h6 className="text-muted">Video Tutorial:</h6>
                        <div className="ratio ratio-16x9">
                          <iframe
                            src={topic.video_url}
                            title={topic.title}
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-4 text-muted small">
                      <span>Created: {formatDate(topic.created_at)}</span>
                      <span>Updated: {formatDate(topic.updated_at)}</span>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </div>
    <Footer/>
    </>
  );
};

export default TutorialTopics;