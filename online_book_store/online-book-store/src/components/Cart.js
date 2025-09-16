import React from 'react';
import { Row, Col, Card, Button, Form, Alert, Badge, ListGroup } from 'react-bootstrap';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout, onContinueShopping, loading }) => {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 1 && quantity <= 99) {
      onUpdateQuantity(itemId, quantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-5">
        <Alert variant="info">
          <Alert.Heading>Your cart is empty</Alert.Heading>
          <p>Add some books to your cart to get started!</p>
          <Button variant="outline-primary" onClick={() => (onContinueShopping ? onContinueShopping() : window.history.back())}>
            Continue Shopping
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Shopping Cart</h2>
        <Badge bg="primary" pill>
          {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cart Items</h5>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={onClearCart}
                disabled={cartItems.length === 0 || loading}
              >
                Clear Cart
              </Button>
            </Card.Header>
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id}>
                  <Row className="align-items-center">
                    <Col xs={3} sm={2}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="img-fluid rounded"
                        style={{ maxHeight: '80px' }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/80x120/6c757d/ffffff?text=${encodeURIComponent(item.title.substring(0, 10))}`;
                        }}
                      />
                    </Col>

                    <Col xs={9} sm={4}>
                      <h6 className="mb-1">{item.title}</h6>
                      <small className="text-muted">by {item.author}</small>
                      <div className="mt-1">
                        <small className="text-success">
                          ₹{item.price.toFixed(2)} each
                        </small>
                      </div>
                    </Col>

                    <Col xs={6} sm={3} className="mt-2 mt-sm-0">
                      <Form.Group>
                        <Form.Label className="small text-muted">Quantity</Form.Label>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <Form.Control
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="mx-2 text-center"
                            style={{ width: '60px' }}
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 99}
                          >
                            +
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>

                    <Col xs={6} sm={2} className="mt-2 mt-sm-0">
                      <div className="text-end">
                        <div className="fw-bold text-primary">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-1"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col lg={4} className="mt-4 mt-lg-0">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax (estimated)</span>
                <span>₹{(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong className="text-primary fs-5">
                  ₹{(getTotalPrice() * 1.08).toFixed(2)}
                </strong>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="success"
                  size="lg"
                  onClick={onCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={() => (onContinueShopping ? onContinueShopping() : window.history.back())}
                >
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </div>
  );
};

export default Cart;