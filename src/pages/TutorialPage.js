import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Accordion,
  Spinner,
  Tabs,
  Tab
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { python } from '@codemirror/lang-python';
import { json } from '@codemirror/lang-json';
import './TutorialPage.css';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';

const TutorialPage = () => {
  const { slug } = useParams();
  const [tutorialData, setTutorialData] = useState(null);
  const [topicsList, setTopicsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState('0');
  const [activeTab, setActiveTab] = useState('content');

  // Function to process HTML content and make images responsive
  const createMarkup = (htmlContent) => {
    if (!htmlContent) return { __html: '' };
    
    // Process images to make them responsive
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

  // Function to determine CodeMirror language
  const getCodeMirrorLanguage = (codeSnippet) => {
    if (!codeSnippet) return null;
    
    if (codeSnippet.includes('function') || codeSnippet.includes('const')) return javascript();
    if (codeSnippet.includes('<html') || codeSnippet.includes('<div')) return html();
    if (codeSnippet.includes('def ') || codeSnippet.includes('import ')) return python();
    if (codeSnippet.trim().startsWith('{') || codeSnippet.trim().startsWith('[')) return json();
    
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the specific tutorial content
        const tutorialResponse = await fetch(`https://codewithsathya.pythonanywhere.com/topics/${slug}`);
        if (!tutorialResponse.ok) {
          throw new Error('Failed to fetch tutorial');
        }
        const tutorialData = await tutorialResponse.json();
        setTutorialData(tutorialData);

        // Fetch all topics for this tutorial
        const topicsResponse = await fetch(`https://codewithsathya.pythonanywhere.com/tutorials/${tutorialData.tutorial}/`);
        if (!topicsResponse.ok) {
          throw new Error('Failed to fetch topics list');
        }
        const topicsData = await topicsResponse.json();
        setTopicsList(topicsData.topics || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (!tutorialData) {
    return (
      <Container className="py-5">
        <div className="alert alert-warning">Tutorial not found</div>
      </Container>
    );
  }

  return (
    <>
      <HeaderWithNavbar />
      <Container fluid className="tutorial-container py-4">
        <Row>
          <Col lg={8} className="pe-lg-4">
            <Card className="mb-4 tutorial-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1 className="tutorial-title">{tutorialData.title}</h1>
                  <Button variant="outline-primary" size="sm">
                    <FontAwesomeIcon icon={faBookmark} className="me-2" />
                    Bookmark
                  </Button>
                </div>

                <div className="mb-4">
                  {tutorialData.tags.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-2 tag-badge">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="tutorial-meta mb-4">
                  <span className="me-3">
                    <FontAwesomeIcon icon={faClock} className="me-1" />
                    {new Date(tutorialData.created_at).toLocaleDateString()}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1 text-success" />
                    {tutorialData.is_free ? 'Free' : 'Premium'}
                  </span>
                </div>

                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                >
                  <Tab eventKey="content" title="Content">
                    <div 
                      className="tutorial-content mt-3"
                      dangerouslySetInnerHTML={createMarkup(tutorialData.content)} 
                    />
                  </Tab>
                  <Tab eventKey="code" title="Code" disabled={!tutorialData.code_snippet}>
                    {tutorialData.code_snippet && (
                      <CodeMirror
                        value={tutorialData.code_snippet}
                        extensions={[getCodeMirrorLanguage(tutorialData.code_snippet)]}
                        readOnly={true}
                        theme="dark"
                        height="auto"
                        className="code-mirror-container"
                      />
                    )}
                  </Tab>
                  <Tab eventKey="json" title="JSON">
                    <CodeMirror
                      value={JSON.stringify(tutorialData, null, 2)}
                      extensions={[json()]}
                      readOnly={true}
                      theme="light"
                      height="auto"
                      className="code-mirror-container"
                    />
                  </Tab>
                </Tabs>

                {tutorialData.video_url && (
                  <div className="mt-4 video-container">
                    <h4>Video Tutorial</h4>
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={tutorialData.video_url}
                        title={tutorialData.title}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="sidebar-col">
            <Card className="sidebar-card mb-4">
              <Card.Body>
                <h5 className="sidebar-title">Course Progress</h5>
                <div className="progress mb-3">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: '25%' }}
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <Button variant="primary" className="w-100 mb-3">
                  Mark as Complete
                </Button>
              </Card.Body>
            </Card>

            <Card className="sidebar-card">
              <Card.Body>
                <h5 className="sidebar-title">{tutorialData.tutorial} Tutorial</h5>
                <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>All Topics</Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ul className="toc-list">
                        {topicsList.map((topic) => (
                          <li
                            key={topic.id}
                            className={topic.slug === slug ? 'active' : ''}
                          >
                            <a href={`/tutorial/${tutorialData.tutorial}/${topic.slug}`}>
                              {topic.title}
                              {topic.order && (
                                <span className="float-end text-muted">
                                  {topic.order}
                                </span>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default TutorialPage;