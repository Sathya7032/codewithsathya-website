import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';
import HeaderWithNavbar from '../components/HeaderWithNavbar';
import Footer from '../components/Footer';

const BlogViewPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://codewithsathya.pythonanywhere.com/api/blogs/${slug}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch blog post');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <StyledContainer>
        <SpinnerContainer>
          <Spinner animation="border" variant="light" />
        </SpinnerContainer>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert variant="danger">{error}</Alert>
      </StyledContainer>
    );
  }

  if (!blog) {
    return (
      <StyledContainer>
        <Alert variant="warning">Blog post not found</Alert>
      </StyledContainer>
    );
  }

  return (
    <>
      <HeaderWithNavbar />
      <StyledContainer fluid>
        <HeaderContainer>
          <HeaderOverlay />
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <BlogTitle>{blog.title}</BlogTitle>
              <BlogMeta>
                <MetaItem>Posted on {new Date(blog.created_at).toLocaleDateString()}</MetaItem>
                {blog.author && <MetaItem>By {blog.author}</MetaItem>}
              </BlogMeta>
            </Col>
          </Row>
        </HeaderContainer>

        <ContentContainer>
          <Row className="justify-content-center">
            <Col lg={8}>
              {blog.featured_image && (
                <FeaturedImage src={blog.featured_image} alt={blog.title} />
              )}
              <BlogContent dangerouslySetInnerHTML={{ __html: blog.content }} />
              {blog.tags && blog.tags.length > 0 && (
                <TagsContainer>
                  {blog.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
              )}
            </Col>
          </Row>
        </ContentContainer>
      </StyledContainer>
      <Footer />
    </>
  );
};

// Styled components
const StyledContainer = styled(Container)`
  background-color: #2f4f4f; // Dark slate grey
  color: #f0f0f0;
  min-height: 100vh;
  padding: 0;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const HeaderContainer = styled.div`
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url(${props => props.bgImage || 'none'});
  background-size: cover;
  background-position: center;
  padding: 5rem 1rem;
  margin-bottom: 2rem;
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(47, 79, 79, 0.85);
`;

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  color: #ffffff;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
  color: #cccccc;
`;

const MetaItem = styled.span`
  font-size: 0.9rem;
`;

const ContentContainer = styled.div`
  padding: 2rem 1rem;
`;

const FeaturedImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const BlogContent = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  
  h2, h3, h4 {
    color: #ffffff;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  a {
    color: #20c997;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    margin: 1.5rem 0;
  }
  
  code {
    background-color: #1e3a3a;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
  
  pre {
    background-color: #1e3a3a;
    padding: 1rem;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1.5rem 0;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }
  
  blockquote {
    border-left: 4px solid #20c997;
    padding-left: 1rem;
    margin: 1.5rem 0;
    color: #cccccc;
    font-style: italic;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #3a5f5f;
`;

const Tag = styled.span`
  background-color: #3a5f5f;
  color: #ffffff;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

export default BlogViewPage;