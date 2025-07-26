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
  Button,
  Row,
  Col
} from 'react-bootstrap';
import './topics.css';
import { Link, useParams } from 'react-router-dom';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';
import { Search } from 'react-bootstrap-icons';

const TutorialTopics = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { slug } = useParams();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`https://codewithsathya.pythonanywhere.com/api/tutorials/${slug}/`);
        const sortedTopics = (response.data.topics || []).sort((a, b) => 
          new Date(b.updated_at) - new Date(a.updated_at)
        );
        setTopics(sortedTopics);
        setFilteredTopics(sortedTopics);
      } catch (err) {
        setError(err.message);
        setFilteredTopics([]);
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
      (topic.description && topic.description.toLowerCase().includes(searchTermLower)) ||
      (topic.tags && topic.tags.some(tag => 
        tag.toLowerCase().includes(searchTermLower)
      ))
    );
    
    setFilteredTopics(results);
  }, [searchTerm, topics]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="topics-container">
        <Container className="text-center py-5">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <h5 className="mt-3 text-light">Loading Tutorial Topics...</h5>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="topics-container">
        <Container className="py-5">
          <Alert variant="danger" className="shadow">
            <Alert.Heading>Error Loading Tutorial Content</Alert.Heading>
            <p>We couldn't load the tutorial topics at this time. Please try again later.</p>
            <p className="mb-0"><small>Technical details: {error}</small></p>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <>
      <HeaderWithNavbar/>
      <div className="topics-container bg-light">
        <Container className="py-5">
          <Row className="mb-4 align-items-end">
            <Col md={6}>
              <h1 className="text-dark mb-2">Tutorial Topics</h1>
              <p className="text-muted">Explore all available learning materials</p>
            </Col>
            <Col md={6}>
              <Form.Group>
                <InputGroup className="shadow-sm">
                  <Form.Control
                    type="search"
                    placeholder="Search topics by title, description or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-end-0"
                  />
                  <Button variant="primary" className="border-start-0">
                    <Search/>
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {filteredTopics.length === 0 ? (
            <Alert variant="info" className="shadow-sm">
              {searchTerm ? (
                <>
                  <h5>No matching topics found</h5>
                  <p className="mb-0">Try adjusting your search or browse all topics by clearing the search field.</p>
                </>
              ) : (
                <>
                  <h5>No topics available yet</h5>
                  <p className="mb-0">Check back soon as we're regularly adding new content.</p>
                </>
              )}
            </Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredTopics.map((topic) => (
                <Col key={topic.id}>
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Card.Title className="text-dark mb-0">
                          <Link to={`/topic/${topic.slug}`} className="text-decoration-none text-dark">
                            {topic.title}
                          </Link>
                        </Card.Title>
                        {topic.is_free && (
                          <Badge bg="success" className="ms-2">
                            FREE
                          </Badge>
                        )}
                      </div>

                      {topic.description && (
                        <Card.Text className="text-muted mb-3 flex-grow-1">
                          {topic.description.length > 120 
                            ? `${topic.description.substring(0, 120)}...` 
                            : topic.description}
                        </Card.Text>
                      )}

                      <div className="mb-3">
                        {topic.tags?.map((tag, index) => (
                          <Badge 
                            key={index} 
                            bg="light" 
                            text="dark" 
                            className="me-2 mb-2 border"
                            style={{ fontWeight: 'normal' }}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <Link to={`/topic/${topic.slug}`} className="w-100">
                          <Button variant="primary" className="w-100" style={{backgroundColor:"darkslategray"}}>
                            View Topic <i className="bi bi-arrow-right ms-2"></i>
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0 text-muted small">
                      <div className="d-flex justify-content-between">
                        <span title="Created date">
                          <i className="bi bi-calendar-plus me-1"></i> {formatDate(topic.created_at)}
                        </span>
                        <span title="Last updated">
                          <i className="bi bi-arrow-clockwise me-1"></i> {formatDate(topic.updated_at)}
                        </span>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
      <Footer/>
    </>
  );
};

export default TutorialTopics;