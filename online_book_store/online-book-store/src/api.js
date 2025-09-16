// const mockBooks = [
//   {
//     id: 1,
//     title: "The Alchemist",
//     author: "Paulo Coelho",
//     price: 299.99,
//     description: "A philosophical tale about a shepherd boy's journey to fulfill his personal legend and find his treasure.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654371463i/18144590.jpg",
//     stock_quantity: 10
//   },
//   {
//     id: 2,
//     title: "Atomic Habits",
//     author: "James Clear",
//     price: 499.00,
//     description: "A comprehensive guide to building good habits and breaking bad ones through small, incremental changes.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1535115320i/40121378.jpg",
//     stock_quantity: 20
//   },
//   {
//     id: 3,
//     title: "Clean Code",
//     author: "Robert C. Martin",
//     price: 799.50,
//     description: "Essential principles and practices for writing maintainable, readable, and efficient code.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg",
//     stock_quantity: 30
//   },
//   {
//     id: 4,
//     title: "Deep Work",
//     author: "Cal Newport",
//     price: 450.00,
//     description: "Rules for focused success in a distracted world, showing how to cultivate deep, meaningful work.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1447957962i/25744928.jpg",
//     stock_quantity: 15
//   },
//   {
//     id: 5,
//     title: "The Pragmatic Programmer",
//     author: "Andrew Hunt",
//     price: 850.00,
//     description: "Timeless tips and techniques for becoming a more effective and productive programmer.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1401432508i/4099.jpg",
//     stock_quantity: 25
//   },
//   {
//     id: 6,
//     title: "Thinking, Fast and Slow",
//     author: "Daniel Kahneman",
//     price: 599.00,
//     description: "Insights into how the mind makes decisions, exploring the interplay between intuitive and deliberate thinking.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg",
//     stock_quantity: 18
//   },
//   {
//     id: 7,
//     title: "Design Patterns",
//     author: "Erich Gamma",
//     price: 999.00,
//     description: "Elements of reusable object-oriented software design, presenting fundamental patterns for better code architecture.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348027904i/85009.jpg",
//     stock_quantity: 12
//   },
//   {
//     id: 8,
//     title: "Refactoring",
//     author: "Martin Fowler",
//     price: 899.00,
//     description: "Improving the design of existing code through systematic techniques and proven refactoring methods.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1386925632i/44936.jpg",
//     stock_quantity: 20
//   },
//   {
//     id: 9,
//     title: "You Don't Know JS",
//     author: "Kyle Simpson",
//     price: 399.00,
//     description: "Deep dive into JavaScript's core mechanisms, covering scope, closures, prototypes, and async patterns.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1431016796i/25136217.jpg",
//     stock_quantity: 22
//   },
//   {
//     id: 10,
//     title: "Introduction to Algorithms",
//     author: "Thomas H. Cormen",
//     price: 1200.00,
//     description: "Comprehensive guide to algorithms and data structures, covering analysis, design, and implementation.",
//     image_url: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1387741681i/108986.jpg",
//     stock_quantity: 10
//   }
// ];

let BASE_URL = "http://localhost:8080/"

export const saveRefreshedToken = (response) => {
  const refreshedToken = response.headers.get("X-Refreshed-Token");
  if (refreshedToken) {
    localStorage.setItem("bookstore_token", refreshedToken);

  }
}

export const getBooks = async () => {

  try {
    const token = localStorage.getItem("bookstore_token");

    const response = await fetch(BASE_URL + "api/books", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    saveRefreshedToken(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
    throw new Error(`Failed to fetch books: ${error.message}`);
  }

};
export const validateOrder = (orderData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { cartItems, user } = orderData;

      if (!user) {
        reject(new Error('User information is required'));
        return;
      }

      if (!user.name || user.name.trim().length < 2) {
        reject(new Error('Valid user name is required'));
        return;
      }

      if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        reject(new Error('Valid user email is required'));
        return;
      }

      if (cartItems.length === 0) {
        reject(new Error('Cart cannot be empty'));
        return;
      }
      resolve({
        orderId: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'confirmed',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      });
    }, 1000);
  });
};

export const getBookById = (bookId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = mockBooks.find(b => b.id === bookId);
      if (book) {
        resolve(book);
      } else {
        reject(new Error(`Book with ID ${bookId} not found`));
      }
    }, 300);
  });
};

// Authentication API Functions
const mockUsers = [];
let currentUser = null;
let userCartItems = [];


export const loginUser = async (credentials) => {
  try {
    const response = await fetch(BASE_URL + "api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();

    // Assuming backend returns { token, name }
    const { token, name } = data;

    // Construct user object like your mock version
    const user = {
      id: Date.now(), // or use a real ID if backend provides it
      name,
      email: credentials.email
    };

    // Save to localStorage
    localStorage.setItem("bookstore_token", token);
    localStorage.setItem("bookstore_user", JSON.stringify(user));

    return { user, token };
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
};


export const registerUser = async (userData) => {

  try {
    const { name, email, password } = userData;

    const response = await fetch(BASE_URL + "api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password, name })
    });

    if (!response.ok) {
      throw new Error(`Register failed: ${response.status}`);
    }
    return { success: true }
  } catch (error) {
    throw new Error(`Register error: ${error.message}`);
  }
};

export const logoutUser = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      userCartItems = [];
      localStorage.removeItem('bookstore_token');
      localStorage.removeItem('bookstore_user');
      localStorage.removeItem('bookstore_cart');
      resolve();
    }, 300);
  });
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem('bookstore_token');
      const user = localStorage.getItem('bookstore_user');

      if (token && user) {
        try {
          currentUser = JSON.parse(user);
          resolve({ user: currentUser, token });
        } catch (error) {
          reject(new Error('Invalid session data'));
        }
      } else {
        reject(new Error('No active session'));
      }
    }, 500);
  });
};

// Cart API Functions
export const getCartItems = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error('User not authenticated'));
        return;
      }

      // Load cart from localStorage
      const savedCart = localStorage.getItem('bookstore_cart');
      if (savedCart) {
        try {
          userCartItems = JSON.parse(savedCart);
        } catch (error) {
          userCartItems = [];
        }
      }

      resolve(userCartItems);
    }, 400);
  });
};

export const addToCart = (book, quantity = 1) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (!currentUser) {
        reject(new Error('User not authenticated'));
        return;
      }

      const existingItemIndex = userCartItems.findIndex(item => item.id === book.id);

      if (existingItemIndex !== -1) {
        userCartItems[existingItemIndex].quantity += quantity;
      } else {
        userCartItems.push({ ...book, quantity });
      }

      // Save to localStorage
      localStorage.setItem('bookstore_cart', JSON.stringify(userCartItems));

      resolve(userCartItems);
    }, 500);
  });
};

export const updateCartItem = (bookId, quantity) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error('User not authenticated'));
        return;
      }

      if (quantity <= 0) {
        userCartItems = userCartItems.filter(item => item.id !== bookId);
      } else {
        const itemIndex = userCartItems.findIndex(item => item.id === bookId);
        if (itemIndex !== -1) {
          userCartItems[itemIndex].quantity = quantity;
        }
      }

      // Save to localStorage
      localStorage.setItem('bookstore_cart', JSON.stringify(userCartItems));

      resolve(userCartItems);
    }, 400);
  });
};

export const removeFromCart = (bookId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error('User not authenticated'));
        return;
      }

      userCartItems = userCartItems.filter(item => item.id !== bookId);

      // Save to localStorage
      localStorage.setItem('bookstore_cart', JSON.stringify(userCartItems));

      resolve(userCartItems);
    }, 400);
  });
};

export const clearCart = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!currentUser) {
        reject(new Error('User not authenticated'));
        return;
      }

      userCartItems = [];

      // Save to localStorage
      localStorage.setItem('bookstore_cart', JSON.stringify(userCartItems));

      resolve(userCartItems);
    }, 300);
  });
};

export const processOrder = async (orderData) => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("bookstore_user"));

    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const { cartItems, user } = orderData;

    if (!user) {
      throw new Error("User information is required");
    }

    if (!user.name || user.name.trim().length < 2) {
      throw new Error("Valid user name is required");
    }

    if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new Error("Valid user email is required");
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const token = localStorage.getItem("bookstore_token");

    let reqBody = {
      cartItems: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity
      }))
    };

    const response = await fetch(BASE_URL + "api/cart/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(reqBody)
    });

    if (!response.ok) {
      throw new Error(`Order failed: ${response.status}`);
    }
    // Clear cart after successful order
    localStorage.setItem("bookstore_cart", JSON.stringify([]));

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return {
      orderId,
      status: "confirmed",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      orderDate: new Date().toLocaleDateString(),
    };
  } catch (error) {
  
    console.error("Order processing error:", error.message);
    return {
      error: true,
      message: error.message
    };
  }
};

