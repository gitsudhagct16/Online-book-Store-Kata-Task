import React, { useState } from 'react';
import { Row, Col, Card, Button, Alert, Spinner, ListGroup, Modal } from 'react-bootstrap';
import { processOrder } from '../api';

const Checkout = ({ cartItems, totalPrice, onOrderComplete, onBackToCart, user }) => {

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);


  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setErrors({});

    try {
      const orderData = {
        cartItems,
        totalPrice: totalPrice * 1.08,
        user
      };

      const confirmation = await processOrder(orderData);

      setOrderConfirmation(confirmation);
      setShowConfirmation(true);

    } catch (error) {
      const errorMessage = error.message || 'An error occurred while processing your order. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOrder = () => {
    onOrderComplete();
    setShowConfirmation(false);
  };

  const getTaxAmount = () => totalPrice * 0.08;
  const getFinalTotal = () => totalPrice + getTaxAmount();

  if (cartItems.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <Alert.Heading>No items in cart</Alert.Heading>
        <p>Please add some items to your cart before checking out.</p>
        <Button variant="primary" onClick={onBackToCart}>
          Go to Cart
        </Button>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Checkout</h2>
        <Button variant="outline-secondary" onClick={onBackToCart}>
          ← Back to Cart
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Details</h5>
            </Card.Header>
            <Card.Body>
              {errors.general && (
                <Alert variant="danger">{errors.general}</Alert>
              )}

              <div className="mb-4">
                <h6>Customer Information</h6>
                <p className="mb-1"><strong>Name:</strong> {user?.name}</p>
                <p className="mb-3"><strong>Email:</strong> {user?.email}</p>
              </div>

              <div className="mb-4">
                <h6>Order Items</h6>
                <ListGroup variant="flush">
                  {cartItems.map(item => (
                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{item.title}</h6>
                        <small className="text-muted">by {item.author} • Qty: {item.quantity}</small>
                      </div>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>

              <div className="d-grid">
                <Button
                  onClick={handlePlaceOrder}
                  variant="success"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing Order...
                    </>
                  ) : (
                    `Place Order - ₹${getFinalTotal().toFixed(2)}`
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mt-4 mt-lg-0">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {cartItems.map(item => (
                <ListGroup.Item key={item.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{item.title}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>₹{getTaxAmount().toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong className="text-primary fs-5">
                  ₹{getFinalTotal().toFixed(2)}
                </strong>
              </div>
            </Card.Body>
          </Card>

          {/* <Alert variant="info" className="mt-3">
            <Alert.Heading className="fs-6">Secure Checkout</Alert.Heading>
            <small>
              🔒 Your information is encrypted and secure<br />
              📦 Free shipping on all orders<br />
              🔄 30-day return policy
            </small>
          </Alert> */}
        </Col>
      </Row>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Confirmed! 🎉</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderConfirmation && (
            <div className="text-center">
              <Alert variant="success">
                <h5>Thank you for your order!</h5>
                <p className="mb-0">Order ID: <strong>{orderConfirmation.orderId}</strong></p>
              </Alert>

              <div className="mt-3">
                <p><strong>Order Total:</strong> ₹{getFinalTotal().toFixed(2)}</p>
                <p><strong>Estimated Delivery:</strong> {orderConfirmation.estimatedDelivery}</p>
              </div>

              <Alert variant="info" className="mt-3">
                <small>
                  📧 A confirmation email has been sent to {user?.email}<br />
                  📦 You can track your order using the order ID above
                </small>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmOrder}>
            Continue Shopping
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Checkout;