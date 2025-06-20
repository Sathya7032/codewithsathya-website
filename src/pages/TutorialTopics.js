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
  Tabs,
  Tab
} from 'react-bootstrap';
import './topics.css';
import { Link, useParams } from 'react-router-dom';
<<<<<<< HEAD
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { python } from '@codemirror/lang-python';
import { json } from '@codemirror/lang-json';
=======
import HeaderWithNavbar from '../components/HeaderWithNavbar'
import Footer from '../components/Footer'
>>>>>>> 2e6663f9aabc6d772efe20fb65e2a25d5ed0f890

const TutorialTopics = () => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const { slug } = useParams();

  const createMarkup = (htmlContent) => {
    // Process images within figure elements to make them responsive
    const processedHtml = htmlContent
      // Remove fixed width/height from images but keep aspect ratio
      .replace(/<img([^>]*)style="[^"]*aspect-ratio:([^;]+);[^"]*"/g, 
        '<img$1style="max-width:100%;height:auto;"')
      // Remove fixed width/height attributes
      .replace(/<img([^>]*)width="[^"]*"/g, '<img$1')
      .replace(/<img([^>]*)height="[^"]*"/g, '<img$1')
      // Make figure elements responsive
      .replace(/<figure class="image image_resized" style="width:[^;]+;"/g, 
        '<figure class="image-container" style="max-width:100%;"')
      // Add bootstrap responsive image class
      .replace(/<img([^>]*)>/g, '<img class="img-fluid"$1>');
  
    return { __html: processedHtml };
  };

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`https://codewithsathya.pythonanywhere.com/tutorials/${slug}/`);
        setTopics(response.data.topics || []);
        setFilteredTopics(response.data.topics || []);
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
      (topic.tags && topic.tags.some(tag => 
        tag.toLowerCase().includes(searchTermLower)
      ))
    );
    
    setFilteredTopics(results);
  }, [searchTerm, topics]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleExpand = (id) => {
    setExpandedTopicId(expandedTopicId === id ? null : id);
  };

  const getCodeMirrorLanguage = (codeSnippet) => {
    if (!codeSnippet) return null;
    
    // Simple detection - in a real app you might want more sophisticated detection
    if (codeSnippet.includes('function') || codeSnippet.includes('const')) return javascript();
    if (codeSnippet.includes('<html') || codeSnippet.includes('<div')) return html();
    if (codeSnippet.includes('def ') || codeSnippet.includes('import ')) return python();
    if (codeSnippet.trim().startsWith('{') || codeSnippet.trim().startsWith('[')) return json();
    
    return null;
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
<<<<<<< HEAD
                  </div>
=======
                    <Link to={`/topic/${topic.slug}`}>
                    <button style={{width:'100%', backgroundColor:'darkslategray'}} className='btn btn-dark'>View Topic</button></Link>
>>>>>>> 2e6663f9aabc6d772efe20fb65e2a25d5ed0f890

                  <div className="mb-3">
                    {topic.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-2 tag-badge">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {expandedTopicId === topic.id && (
                    <div className="mt-3">
                      <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                      >
                        <Tab eventKey="content" title="Content">
                          <div 
                            className="content-container mt-3"
                            dangerouslySetInnerHTML={createMarkup(topic.content)} 
                          />
                        </Tab>
                        <Tab eventKey="code" title="Code Snippet" disabled={!topic.code_snippet}>
                          {topic.code_snippet && (
                            <CodeMirror
                              value={topic.code_snippet}
                              extensions={[getCodeMirrorLanguage(topic.code_snippet)]}
                              readOnly={true}
                              theme="dark"
                              height="auto"
                              className="code-mirror-container"
                            />
                          )}
                        </Tab>
                        <Tab eventKey="json" title="JSON Data">
                          <CodeMirror
                            value={JSON.stringify(topic, null, 2)}
                            extensions={[json()]}
                            readOnly={true}
                            theme="light"
                            height="auto"
                            className="code-mirror-container"
                          />
                        </Tab>
                      </Tabs>
                    </div>
                  )}

                  <Link to={`/topic/${topic.slug}`}>
                    <button style={{width: '100%', backgroundColor: 'darkslategray'}} className='btn btn-dark'>
                      View Full Topic
                    </button>
                  </Link>      

                  <div className="d-flex justify-content-between mt-4 text-muted small">
                    <span>Created: {formatDate(topic.created_at)}</span>
                    <span>Updated: {formatDate(topic.updated_at)}</span>
                  </div>            
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