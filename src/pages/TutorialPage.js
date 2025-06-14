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
  Spinner
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import './TutorialPage.css';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';

const TutorialPage = () => {
  const { slug, tutorial } = useParams();
  const [tutorialData, setTutorialData] = useState(null);
  const [topicsList, setTopicsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState('0');

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
        console.log(tutorialData.tutorial)
        const slug1 = tutorialData.tutorial

        // Fetch all topics for this tutorial
        const topicsResponse = await fetch(`https://codewithsathya.pythonanywhere.com/tutorials/`);
        if (!topicsResponse.ok) {
          throw new Error('Failed to fetch topics list');
        }
        const topicsData = await topicsResponse.json();
        setTopicsList(topicsData);
        console.log(topicsList)

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

                <div
                  className="tutorial-content"
                  dangerouslySetInnerHTML={{ __html: tutorialData.content }}
                />

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
                            <a href={`/topics/${topic.slug}`}>
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