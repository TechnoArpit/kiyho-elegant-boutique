// ========================================
// KIYHO Bags - E-commerce JavaScript
// ========================================

// Product Data - Luxury Bags
const products = [
    {
        id: 1,
        brand: "Hermès",
        name: "Mini Kelly",
        description: "Iconic structured handbag in premium Epsom leather with palladium hardware.",
        price: 12500,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: 2,
        brand: "Gucci",
        name: "GG Marmont",
        description: "Quilted leather shoulder bag with signature double G hardware in antique gold.",
        price: 2900,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: 3,
        brand: "Louis Vuitton",
        name: "Neverfull MM",
        description: "Spacious tote in iconic Monogram canvas with natural cowhide leather trim.",
        price: 1950,
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: 4,
        brand: "Prada",
        name: "Re-Edition 2005",
        description: "Vintage-inspired nylon shoulder bag with iconic triangle logo in black.",
        price: 1350,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: 5,
        brand: "Chanel",
        name: "Classic Flap",
        description: "Timeless quilted lambskin bag with signature chain strap and CC turn-lock.",
        price: 8500,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
        id: 6,
        brand: "Bottega Veneta",
        name: "Jodie Mini",
        description: "Soft padded leather hobo bag with signature intrecciato weave pattern.",
        price: 2750,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
];

// Global State
let currentUser = null;
let cart = [];

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format price to currency
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
}

// Show/hide elements
function showElement(element) {
    if (element) element.classList.add('show', 'active');
}

function hideElement(element) {
    if (element) element.classList.remove('show', 'active');
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear error message
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Clear all errors in a form
function clearAllErrors(formElement) {
    const errorElements = formElement.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

// Check if user is logged in
function checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        return true;
    }
    return false;
}

// Login function
function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
}

// Register function
function register(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.find(u => u.username === userData.username)) {
        return { success: false, message: 'Username already exists' };
    }
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    return { success: true };
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    cart = [];
    localStorage.removeItem('cart');
    window.location.href = 'login.html';
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!checkAuthStatus()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ========================================
// CART FUNCTIONS
// ========================================

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showCartNotification();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Calculate cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get total items in cart
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartCount) {
        cartCount.textContent = getCartItemCount();
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.brand} ${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        cartTotal.textContent = getCartTotal().toFixed(2);
    }
}

// Show cart notification
function showCartNotification() {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// ========================================
// PRODUCT FUNCTIONS
// ========================================

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div class="product-price">${formatPrice(product.price)}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// FORM VALIDATION
// ========================================

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    return password.length >= 6;
}

// Validate login form
function validateLoginForm(formData) {
    const errors = {};
    
    if (!formData.username.trim()) {
        errors.username = 'Username is required';
    }
    
    if (!formData.password) {
        errors.password = 'Password is required';
    }
    
    return errors;
}

// Validate registration form
function validateRegistrationForm(formData) {
    const errors = {};
    
    if (!formData.username.trim()) {
        errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
        errors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
}

// ========================================
// EVENT HANDLERS
// ========================================

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    // Clear previous errors
    clearAllErrors(form);
    
    // Validate form
    const errors = validateLoginForm(loginData);
    
    if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(field => {
            showError(field + '-error', errors[field]);
        });
        return;
    }
    
    // Attempt login
    const result = login(loginData.username, loginData.password);
    
    if (result.success) {
        window.location.href = 'index.html';
    } else {
        showError('main-error', result.message);
    }
}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const registerData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password')
    };
    
    // Clear previous errors
    clearAllErrors(form);
    
    // Validate form
    const errors = validateRegistrationForm(registerData);
    
    if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(field => {
            const errorId = field === 'confirmPassword' ? 'confirm-password-error' : field + '-error';
            showError(errorId, errors[field]);
        });
        return;
    }
    
    // Attempt registration
    const result = register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
    });
    
    if (result.success) {
        window.location.href = 'index.html';
    } else {
        showError('main-error', result.message);
    }
}

// Handle checkout form submission
function handleCheckout(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show thank you modal
    const modal = document.getElementById('thank-you-modal');
    const overlay = document.getElementById('modal-overlay');
    
    showElement(modal);
    showElement(overlay);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
}

// ========================================
// PAGE INITIALIZATION
// ========================================

// Initialize homepage
function initHomepage() {
    if (!requireAuth()) return;
    
    // Load cart
    loadCart();
    
    // Show welcome message
    const welcomeMessage = document.getElementById('welcome-message');
    const userName = document.getElementById('user-name');
    if (welcomeMessage && userName && currentUser) {
        userName.textContent = currentUser.username;
        showElement(welcomeMessage);
        
        // Hide welcome message after 3 seconds
        setTimeout(() => {
            hideElement(welcomeMessage);
        }, 3000);
    }
    
    // Render products
    renderProducts();
    
    // Update cart UI
    updateCartUI();
    
    // Set up event listeners
    setupEventListeners();
}

// Initialize login page
function initLoginPage() {
    // Redirect if already logged in
    if (checkAuthStatus()) {
        window.location.href = 'index.html';
        return;
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Initialize registration page
function initRegisterPage() {
    // Redirect if already logged in
    if (checkAuthStatus()) {
        window.location.href = 'index.html';
        return;
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// Initialize checkout page
function initCheckoutPage() {
    if (!requireAuth()) return;
    
    loadCart();
    
    // Redirect if cart is empty
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }
    
    // Render order summary
    renderOrderSummary();
    
    // Set up form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
        
        // Pre-fill email if user is logged in
        const emailField = document.getElementById('email');
        if (emailField && currentUser) {
            emailField.value = currentUser.email;
        }
    }
    
    // Set up modal close handlers
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            hideElement(document.getElementById('thank-you-modal'));
            hideElement(overlay);
        });
    }
}

// Render order summary on checkout page
function renderOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const subtotal = document.getElementById('subtotal');
    const finalTotal = document.getElementById('final-total');
    
    if (orderItems) {
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-info">
                    <div class="order-item-name">${item.brand} ${item.name}</div>
                    <div class="order-item-details">Quantity: ${item.quantity}</div>
                </div>
                <div class="order-item-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
        `).join('');
    }
    
    const total = getCartTotal();
    if (subtotal) subtotal.textContent = total.toFixed(2);
    if (finalTotal) finalTotal.textContent = total.toFixed(2);
}

// Set up event listeners
function setupEventListeners() {
    // Cart button
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCart = document.getElementById('close-cart');
    
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showElement(cartModal);
            showElement(cartOverlay);
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            hideElement(cartModal);
            hideElement(cartOverlay);
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            hideElement(cartModal);
            hideElement(cartOverlay);
        });
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // CTA button scroll to products
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            document.getElementById('bags').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Mobile menu toggle (basic implementation)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
}

// ========================================
// PAGE DETECTION AND INITIALIZATION
// ========================================

// Initialize appropriate page based on current URL
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'login.html':
            initLoginPage();
            break;
        case 'register.html':
            initRegisterPage();
            break;
        case 'checkout.html':
            initCheckoutPage();
            break;
        case 'index.html':
        case '':
        default:
            initHomepage();
            break;
    }
});

// Add CSS animation for cart notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);