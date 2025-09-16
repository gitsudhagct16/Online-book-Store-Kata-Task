import React, { useState } from 'react';
import { Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';

const BookList = ({ books, onAddToCart, loading, error, cartLoading }) => {
  const [addingToCart, setAddingToCart] = useState(null);

  const handleAddToCart = async (book) => {
    setAddingToCart(book.id);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      onAddToCart(book);
    } catch (err) {
      console.error('Failed to add book to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Oops! Something went wrong</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (books.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <Alert.Heading>No books available</Alert.Heading>
        <p>Check back later for new arrivals!</p>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Books</h2>
        <Badge bg="secondary" pill>
          {books.length} book{books.length !== 1 ? 's' : ''} available
        </Badge>
      </div>

      <Row>
        {books.map(book => (
          <Col key={book.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={book.imageUrl}
                alt={book.title}
                style={{ height: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/200x300/6c757d/ffffff?text=${encodeURIComponent(book.title)}`;
                }}
              />

              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-truncate" title={book.title}>
                  {book.title}
                </Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                  by {book.author}
                </Card.Subtitle>

                <Card.Text
                  className="flex-grow-1 small"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {book.description}
                </Card.Text>

                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="text-primary fs-5">
                      ₹{book.price.toFixed(2)}
                    </strong>
                    <small className="text-muted">
                      {book.stockQuantity > 0 ? (
                        <span className="text-success">
                          ✓ {book.stockQuantity} in stock
                        </span>
                      ) : (
                        <span className="text-danger">
                          ✗ Out of stock
                        </span>
                      )}
                    </small>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-100"
                    onClick={() => handleAddToCart(book)}
                    disabled={book.stockQuantity === 0 || addingToCart === book.id || cartLoading}
                  >
                    {addingToCart === book.id ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Adding...
                      </>
                    ) : book.stockQuantity === 0 ? (
                      'Out of Stock'
                    ) : (
                      '🛒 Add to Cart'
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BookList;