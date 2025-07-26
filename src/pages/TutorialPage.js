import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Tab,
  Modal,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCheckCircle,
  faClock,
  faTrophy,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import "./TutorialPage.css";
import HeaderWithNavbar from "../components/HeaderWithNavbar";
import Footer from "../components/Footer";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function getLanguageFromTags(tags) {
  if (!tags || !Array.isArray(tags)) return 'text';
  if (tags.includes('core-java') || tags.includes('java')) return 'java';
  if (tags.includes('javascript')) return 'javascript';
  if (tags.includes('python')) return 'python';
  return 'text'; // default fallback
}

const QuizModal = ({ show, onHide, questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer.is_correct) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faTrophy} className="me-2 text-warning" />
          Test Your Knowledge
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!quizCompleted ? (
          <>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <Badge bg="info">
                Difficulty: {currentQuestion.difficulty === 'E' ? 'Easy' : 
                           currentQuestion.difficulty === 'M' ? 'Medium' : 'Hard'}
              </Badge>
            </div>
            
            <ProgressBar now={progressPercentage} className="mb-4" />
            
            <h5 className="mb-4">{currentQuestion.text}</h5>
            
            <div className="quiz-options">
              {currentQuestion.answers.map((answer) => (
                <Button
                  key={answer.id}
                  variant="outline-primary"
                  className={`d-block w-100 text-start mb-2 ${selectedAnswer && answer.is_correct ? 'bg-success text-white' : ''} ${
                    selectedAnswer && answer.id === selectedAnswer.id && !answer.is_correct ? 'bg-danger text-white' : ''
                  }`}
                  onClick={() => !showExplanation && handleAnswerSelect(answer)}
                  disabled={showExplanation}
                >
                  {answer.text}
                  {selectedAnswer && answer.is_correct && (
                    <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
                  )}
                </Button>
              ))}
            </div>
            
            {showExplanation && (
              <Alert variant="info" className="mt-3">
                <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                <div dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
              </Alert>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faTrophy} size="4x" className="text-warning mb-3" />
            <h4>Quiz Completed!</h4>
            <p className="lead">
              Your score: {score} out of {questions.length}
            </p>
            <p>
              {score === questions.length ? "Perfect! You're a Java expert!" :
               score >= questions.length / 2 ? "Good job! Keep learning!" :
               "Keep practicing! You'll get better!"}
            </p>
            <Button variant="primary" onClick={handleRestartQuiz}>
              Take Quiz Again
            </Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!quizCompleted && showExplanation && (
          <Button variant="primary" onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

const TutorialPage = () => {
  const { slug } = useParams();
  const [tutorialData, setTutorialData] = useState(null);
  const [topicsList, setTopicsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState("0");
  const [activeTab, setActiveTab] = useState("content");
  const [showQuiz, setShowQuiz] = useState(false);

  // Function to process HTML content and make images responsive
  const createMarkup = (htmlContent) => {
    if (!htmlContent) return { __html: "" };

    // Process images to make them responsive
    const processedHtml = htmlContent
      // Remove fixed width/height from images but keep aspect ratio
      .replace(
        /<img([^>]*)style="[^"]*aspect-ratio:([^;]+);[^"]*"/g,
        '<img$1style="max-width:100%;height:auto;"'
      )
      // Remove fixed width/height attributes
      .replace(/<img([^>]*)width="[^"]*"/g, "<img$1")
      .replace(/<img([^>]*)height="[^"]*"/g, "<img$1")
      // Make figure elements responsive
      .replace(
        /<figure class="image image_resized" style="width:[^;]+;"/g,
        '<figure class="image-container" style="max-width:100%;"'
      )
      // Add bootstrap responsive image class
      .replace(/<img([^>]*)>/g, '<img class="img-fluid"$1>');

    return { __html: processedHtml };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the specific tutorial content
        const tutorialResponse = await fetch(
          `https://codewithsathya.pythonanywhere.com/api/topics/${slug}`
        );
        if (!tutorialResponse.ok) {
          throw new Error("Failed to fetch tutorial");
        }
        const tutorialData = await tutorialResponse.json();
        setTutorialData(tutorialData);
        console.log(tutorialData);

        // Fetch all topics for this tutorial
        const topicsResponse = await fetch(
          `https://codewithsathya.pythonanywhere.com/api/tutorials/${tutorialData.tutorial}/`
        );
        if (!topicsResponse.ok) {
          throw new Error("Failed to fetch topics list");
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

  const language = getLanguageFromTags(tutorialData.tags);
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
                    <Badge
                      key={index}
                      bg="secondary"
                      className="me-2 tag-badge"
                    >
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
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="me-1 text-success"
                    />
                    {tutorialData.is_free ? "Free" : "Premium"}
                  </span>
                </div>

                {tutorialData.questions && tutorialData.questions.length > 0 && (
                  <div className="mb-4">
                    <Button 
                      variant="warning" 
                      onClick={() => setShowQuiz(true)}
                      className="d-flex align-items-center"
                    >
                      <FontAwesomeIcon icon={faTrophy} className="me-2" />
                      Take Quiz ({tutorialData.questions.length} Questions)
                    </Button>
                  </div>
                )}

                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-3"
                >
                  <Tab eventKey="content" title="Content">
                    <div
                      className="tutorial-content mt-3"
                      dangerouslySetInnerHTML={createMarkup(
                        tutorialData.content
                      )}
                    />
                     {tutorialData.code_snippet && (
                      <SyntaxHighlighter
                        language={language}
                        style={atomDark}
                        showLineNumbers={true}
                        wrapLines={true}
                        lineProps={{
                          style: {
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                          },
                        }}
                      >
                        {tutorialData.code_snippet}
                      </SyntaxHighlighter>
                    )}
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
                    style={{ width: "25%" }}
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
                <h5 className="sidebar-title">
                  {tutorialData.tutorial} Tutorial
                </h5>
                <Accordion
                  activeKey={activeKey}
                  onSelect={(k) => setActiveKey(k)}
                >
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>All Topics</Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ul className="toc-list">
                        {topicsList.map((topic) => (
                          <li
                            key={topic.id}
                            className={topic.slug === slug ? "active" : ""}
                          >
                            <a
                              href={`/tutorial/${tutorialData.tutorial}/${topic.slug}`}
                            >
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

      {tutorialData.questions && tutorialData.questions.length > 0 && (
        <QuizModal 
          show={showQuiz} 
          onHide={() => setShowQuiz(false)} 
          questions={tutorialData.questions} 
        />
      )}
    </>
  );
};

export default TutorialPage;