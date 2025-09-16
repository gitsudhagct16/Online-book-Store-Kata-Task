import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Badge, Button, Spinner } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BookList from './components/BookList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import { getBooks, getCartItems, addToCart as apiAddToCart, updateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from './api';

const AppContent = () => {
  const { user, isAuthenticated, logout, authLoading, loading: authInitializing } = useAuth();
  const [currentPage, setCurrentPage] = useState('books');
  const [authPage, setAuthPage] = useState('login'); // 'login' or 'register'
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadBooksAndCart();
    } else {
      loadBooksOnly();
    }
  }, [isAuthenticated]);

  const loadBooksOnly = async () => {
    try {
      setLoading(true);
      const booksData = await getBooks();
      setBooks(booksData);
      setCart([]);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadBooksAndCart = async () => {
    try {
      setLoading(true);
      const [booksData, cartData] = await Promise.all([
        getBooks(),
        getCartItems()
      ]);
      setBooks(booksData);
      setCart(cartData);
      setError(null);
    } catch (err) {
      if (err.message === 'User not authenticated') {
        // Handle auth error by loading books only
        await loadBooksOnly();
      } else {
        setError('Failed to load data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (book) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      setCurrentPage('login');
      return;
    }

    try {
      setCartLoading(true);
      const updatedCart = await apiAddToCart(book);
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleUpdateCartQuantity = async (bookId, newQuantity) => {
    try {
      setCartLoading(true);
      const updatedCart = await updateCartItem(bookId, newQuantity);
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to update cart:', err);
      alert('Failed to update cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleRemoveFromCart = async (bookId) => {
    try {
      setCartLoading(true);
      const updatedCart = await apiRemoveFromCart(bookId);
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      alert('Failed to remove item from cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setCartLoading(true);
      const updatedCart = await apiClearCart();
      setCart(updatedCart);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      alert('Failed to clear cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleOrderComplete = async () => {
    try {
      const updatedCart = await apiClearCart();
      setCart(updatedCart);
      setCurrentPage('books');

      // Navigate to home page
      window.location.href = "/";

      // Reload the page
      window.location.reload();

    } catch (err) {
      console.error('Failed to clear cart after order:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCart([]);
      setCurrentPage('books');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Show loading spinner while checking authentication
  if (authInitializing) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    const { login, register, authError } = useAuth();

    if (authPage === 'login') {
      return (
        <Login
          onLogin={async (credentials) => {
            const result = await login(credentials);
            if (result.success) {
              setCurrentPage('books');
            }
          }}
          onSwitchToRegister={() => setAuthPage('register')}
          loading={authLoading}
          error={authError}
        />
      );
    } else {
      return (
        <Register
          onRegister={async (userData) => {

            const result = await register(userData);

            if (result.success) {
              setAuthPage('login')
            }
          }}
          onSwitchToLogin={() => setAuthPage('login')}
          loading={authLoading}
          error={authError}
        />
      );
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'books':
        return (
          <BookList
            books={books}
            onAddToCart={handleAddToCart}
            loading={loading}
            error={error}
            cartLoading={cartLoading}
          />
        );
      case 'cart':
        return (
          <Cart
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckout={() => setCurrentPage('checkout')}
            onContinueShopping={() => setCurrentPage('books')}
            loading={cartLoading}
          />
        );
      case 'checkout':
        return (
          <Checkout
            cartItems={cart}
            totalPrice={getTotalPrice()}
            onOrderComplete={handleOrderComplete}
            onBackToCart={() => setCurrentPage('cart')}
            user={user}
          />
        );
      default:
        return (
          <BookList
            books={books}
            onAddToCart={handleAddToCart}
            loading={loading}
            error={error}
            cartLoading={cartLoading}
          />
        );
    }
  };

  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand
            onClick={() => setCurrentPage('books')}
            style={{ cursor: 'pointer' }}
          >
            📚Sudha's Bookstore
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('books');
                }}
                className={currentPage === 'books' ? 'active' : ''}
                style={{ cursor: 'pointer' }}
              >
                Books
              </Nav.Link>
              <Nav.Link
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage('cart');
                }}
                className={currentPage === 'cart' ? 'active' : ''}
                style={{ cursor: 'pointer' }}
              >
                Cart {getTotalItems() > 0 && <Badge bg="danger">{getTotalItems()}</Badge>}
              </Nav.Link>
            </Nav>

            <Nav>
              <Navbar.Text className="me-3">
                Welcome, <strong>{user?.name}</strong>
              </Navbar.Text>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-1"
                    />
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {renderCurrentPage()}
      </Container>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;