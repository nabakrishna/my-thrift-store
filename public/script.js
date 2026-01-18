// ===== GLOBAL STATE =====
let currentProductImageIndex = 0;
let currentProductImages = [];
let currentUserData = JSON.parse(localStorage.getItem('currentUser')) || null;

// ===== PRODUCTS DATA =====
const products = [
    { 
        id: 1, 
        name: 'Regular Fit Wool Blend Coat', 
        size: 'Size L', 
        price: 25.00,
        category: 'winter',
        images: ['images/wintercoat0.jpg','images/wintercoat1.jpg'],
        brand: 'ZARA',
        colour: 'Brown/Multi',
        condition: 'Good (Signs of Wear)',
        materials: 'Faux Fur, Polyester',
        description: 'This is a beautiful faux fur coat from Lets Frans. Perfect for winter...'
    },
    { 
        id: 2, 
        name: ' Vintage Denim Jacket', 
        size: 'Size L', 
        price: 30.00,
        category: ['jackets','winter'],
        images: ['images/denimjacketzara1.jpg','images/denimjacketzara2.jpg'],
        brand: 'Vintage',
        colour: 'Light Blue',
        condition: 'Excellent',
        materials: 'Denim, Cotton',
        description: 'A classic 90s vintage denim jacket.'
    },
    { 
        id: 3, 
        name: 'Summer T-Shirt', 
        size: 'Size M', 
        price: 15.00,
        category: 'shirt',
        images: ['images/summertshirt0.jpg','images/summertshirt1.jpg'],
        brand: 'Summer Vibes',
        colour: 'White',
        condition: 'Excellent',
        materials: 'Cotton',
        description: 'A lightweight summer t-shirt perfect for hot days.'
    },
    {
        id: 4,
        name:'Slim Fit Shirt',
        size: 'Size M',
        price: 18.00,
        category: 'shirt',
        images: ['images/shirt0.jpg','images/shirt1.jpg'],
        brand: 'ZARA',
        color: 'Brown',
        condition: 'Good',
        materials: 'Cotton',
        description: 'A stylish slim fit shirt suitable for casual and formal occasions.'
    },
    { 
        id: 5, 
        name: ' Cargo Pants', 
        size: 'Size L', 
        price: 25.00,
        category: 'pants',
        images: ['images/cargopants0.jpg','images/cargopants1.jpg','images/cargopants2.jpg'],
        brand: 'ZARA',
        colour: 'Dark Brown',
        condition: 'Good',
        materials: 'Cotton Blend',
        description: 'Comfortable cargo pants with multiple pockets.'
    },
    { 
        id: 6, 
        name: 'Winter Sweater', 
        size: 'Size M', 
        price: 30.00,
        category: 'winter',
        images: ['images/winterseater0.jpg','images/winterseater1.jpg'],
        brand: 'ZARA',
        colour: 'Grey',
        condition: 'Excellent',
        materials: 'Wool Blend',
        description: 'Warm and cozy winter sweater.'
    },
    { 
        id: 7, 
        name: 'Vinatge Jenes Pants', 
        size: 'Size L', 
        price: 20.00,
        category: 'pants',
        images: ['images/blackjenes0.jpg','images/blackjenes1.jpg','images/blackjenes2.jpg'],
        brand: 'ZARA',
        colour: ' Black',
        condition: 'Excellent',
        materials: 'Polyester',
        description: 'Perfect beach shorts for summer days.'
    },
    {
        id: 8,
        name: 'Classic Jeans',
        size: 'Size L',
        price: 45.00,
        category: 'pants',
        images: ['images/jenespantzara0.jpg','images/jenespantzara1.jpg','images/jenespantzara2.jpg'],
        brand: 'ZARA',
        colour: 'Light Blue',
        condition: 'Good',
        materials: 'Denim',
        description: 'Classic denim jeans from ZARA with a comfortable fit.'
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeHomepage();
    initializeProductPage();
    initializeWishlistPage();
    initializeCartPage();
    initializeAccountPage();
    initializeCheckoutPage();
    initializeCategoryFilter();
    updateAccountLink();
    
    updateWishlistBadge();
    updateCartBadge();
}

// ===== NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ===== ADMIN ACCESS =====
function promptForAdmin() {
    const correctCode = "admin123";
    const userCode = prompt("Please enter the admin access code:");
    
    if (userCode === correctCode) {
        window.location.href = "entry.html";
    } else if (userCode) {
        showToast("Incorrect code. Access denied.", "error");
    }
}

// ===== IMAGE GALLERY =====
function showImage(index) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage && currentProductImages[index]) {
        mainImage.src = currentProductImages[index];
    }
}

function nextImage() {
    currentProductImageIndex = (currentProductImageIndex + 1) % currentProductImages.length;
    showImage(currentProductImageIndex);
    updateDots(currentProductImageIndex);
}

function prevImage() {
    currentProductImageIndex = (currentProductImageIndex - 1 + currentProductImages.length) % currentProductImages.length;
    showImage(currentProductImageIndex);
    updateDots(currentProductImageIndex);
}

function updateDots(index) {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function currentSlide(n) {
    if (n >= 0 && n < currentProductImages.length) {
        currentProductImageIndex = n;
        showImage(n);
        updateDots(n);
    }
}

// ===== HOMEPAGE =====
function initializeHomepage() {
    const container = document.getElementById('products');
    if (!container) return;

    displayProducts(products, 'products');
    
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.brand.toLowerCase().includes(query) ||
                p.size.toLowerCase().includes(query)
            );
            displayProducts(filtered, 'products');
        });
    }
}

function displayProducts(prods, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (prods.length === 0) {
        const emptyMsg = containerId === 'products' ? 'No products found.' : 'Your wishlist is empty.';
        container.innerHTML = `<p class="empty-message">${emptyMsg}</p>`;
        return;
    }

    prods.forEach(p => {
        const isWishlisted = wishlist.includes(p.id);
        const isInCart = cart.some(item => item.id === p.id);
        const activeClass = isWishlisted ? 'active' : '';

        let actionButtons = '';
        
        if (containerId === 'wishlist-items') {
            actionButtons = `
                <button class="card-add-to-cart ${isInCart ? 'disabled' : ''}" 
                    onclick="${isInCart ? 'showToast(\"Already in cart\", \"error\")' : `addToCart(${p.id})`}" 
                    title="${isInCart ? 'Item already in cart' : 'Add to cart'}">
                    ${isInCart ? '✓ In Cart' : 'Add to Cart'}
                </button>
                <button class="card-remove-wishlist" onclick="toggleWishlist(${p.id})">Remove</button>
            `;
        } else {
            actionButtons = `
                <button class="card-add-to-cart ${isInCart ? 'disabled' : ''}" 
                    onclick="${isInCart ? 'showToast(\"Already in cart\", \"error\")' : `addToCart(${p.id})`}" 
                    title="${isInCart ? 'Item already in cart' : 'Add to cart'}">
                    ${isInCart ? '✓ In Cart' : 'Add to Cart'}
                </button>
            `;
        }

        container.innerHTML += `
            <div class="product-card" data-category="${p.category}" data-product-id="${p.id}">
                <div class="product-image-container">
                    <a href="product.html?id=${p.id}">
                        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
                    </a>
                    <button class="wishlist-btn ${activeClass}" onclick="toggleWishlist(${p.id})" aria-label="Add to Wishlist" title="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="product-details">
                    <h3><a href="product.html?id=${p.id}" class="product-name-link">${p.name}</a></h3>
                    <p class="product-brand">${p.brand}</p>
                    <p class="product-size">${p.size}</p>
                    <p class="product-price">£${p.price.toFixed(2)}</p>
                    ${actionButtons}
                </div>
            </div>
        `;
    });
}

// ===== PRODUCT PAGE =====
function initializeProductPage() {
    if (document.getElementById('product-detail-container')) {
        loadProductDetails();
    }
}

function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = products.find(p => p.id === productId);
    const container = document.getElementById('product-detail-container');

    if (!product) {
        container.innerHTML = "<h2>Product not found.</h2>";
        return;
    }

    currentProductImageIndex = 0;
    currentProductImages = product.images;
    document.title = `${product.name} - TheThriftBee`;

    // Gallery HTML
    let imageGalleryHTML = `
        <div class="product-gallery">
            <button class="gallery-arrow prev-btn" onclick="prevImage()" aria-label="Previous image">&#10094;</button>
            <div class="main-image">
                <img src="${product.images[0]}" alt="${product.name}" id="main-product-image">
            </div>
            <button class="gallery-arrow next-btn" onclick="nextImage()" aria-label="Next image">&#10095;</button>
            <div class="gallery-dots">
    `;
    
    product.images.forEach((img, index) => {
        imageGalleryHTML += `<span class="dot ${index === 0 ? 'active' : ''}" onclick="currentSlide(${index})" aria-label="Image ${index + 1}"></span>`;
    });
    imageGalleryHTML += `</div></div>`;

    // Check if product is in cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const isInCart = cart.some(item => item.id === product.id);
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isWishlisted = wishlist.includes(product.id);
    const watchButtonText = isWishlisted ? 'Watching' : 'Watch Item';
    const watchButtonClass = isWishlisted ? 'active' : '';

    const addToCartButtonClass = isInCart ? 'disabled' : '';
    const addToCartButtonText = isInCart ? '✓ Already in Cart' : 'Add to Cart';
    const addToCartOnClick = isInCart ? 'showToast("Already in cart", "error")' : `addToCart(${product.id})`;

    let productInfoHTML = `
        <div class="product-info">
            <h1>${product.name}</h1>
            <p class="product-brand-label"><strong>${product.brand}</strong></p>
            <p class="product-page-size">${product.size}</p>
            <p class="product-page-price">£${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="btn-add-to-cart ${addToCartButtonClass}" onclick="${addToCartOnClick}" title="${isInCart ? 'Item is already in your cart' : 'Add to cart'}">
                    ${addToCartButtonText}
                </button>
                <button class="btn-watch-item ${watchButtonClass}" id="watch-item-btn" onclick="toggleWishlist(${product.id}, true)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                       <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span id="watch-item-text">${watchButtonText}</span>
                </button>
                <button class="btn-order-now" onclick="orderNow(${product.id})" ${isInCart ? 'style="display:none;"' : ''}>Order Now</button>
            </div>
            <div class="product-details-section">
                <h3>Details</h3>
                <ul class="product-details-list">
                    <li><strong>Brand:</strong> ${product.brand}</li>
                    <li><strong>Colour:</strong> ${product.colour}</li>
                    <li><strong>Size:</strong> ${product.size}</li>
                    <li><strong>Condition:</strong> ${product.condition}</li>
                    <li><strong>Materials:</strong> ${product.materials}</li>
                </ul>
            </div>
            <div class="product-description-section">
                <h3>Description</h3>
                <p>${product.description}</p>
            </div>
        </div>
    `;

    container.innerHTML = imageGalleryHTML + productInfoHTML;
}

// ===== WISHLIST =====
function initializeWishlistPage() {
    if (document.getElementById('wishlist-items')) {
        loadWishlistItems();
    }
}

function loadWishlistItems() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistProducts = wishlist
        .map(id => products.find(p => p.id === id))
        .filter(p => p != null);
    displayProducts(wishlistProducts, 'wishlist-items');
}

function toggleWishlist(id, updateButtonOnPage = false) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const productIndex = wishlist.indexOf(id);
    const product = products.find(p => p.id === id);

    if (productIndex > -1) {
        wishlist.splice(productIndex, 1);
        showToast(`${product.name} removed from wishlist`, "error");
    } else {
        wishlist.push(id);
        showToast(`${product.name} added to wishlist!`, "success");
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();

    if (updateButtonOnPage) {
        updateWatchItemButton(id);
    }

    if (document.getElementById('wishlist-items')) {
        loadWishlistItems();
    }

    // Update product card wishlist button if visible
    const productCard = document.querySelector(`[data-product-id="${id}"]`);
    if (productCard) {
        const wishlistBtn = productCard.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.classList.toggle('active', !wishlistBtn.classList.contains('active'));
        }
    }
}

function updateWishlistBadge() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const badge = document.getElementById('wishlist-count-badge');

    if (badge) {
        if (wishlist.length > 0) {
            badge.textContent = wishlist.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function updateWatchItemButton(id) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const btn = document.getElementById('watch-item-btn');
    const btnText = document.getElementById('watch-item-text');

    if (btn && btnText) {
        const isWishlisted = wishlist.includes(id);
        btn.classList.toggle('active', isWishlisted);
        btnText.textContent = isWishlisted ? 'Watching' : 'Watch Item';
    }
}

// ===== CART (NO QUANTITY - EACH ITEM IS UNIQUE) =====
function initializeCartPage() {
    if (document.getElementById('cart-items')) {
        loadCartItems();
    }
}
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === id);

    if (!product) return;

    // 1. Check if product already exists
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        showToast(`${product.name} is already in your cart!`, "error");
        return;
    }

    // 2. Add to LocalStorage
    cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        size: product.size,
        images: product.images,
        brand: product.brand,
        condition: product.condition
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    showToast(`${product.name} added to cart!`, "success");
    updateCartBadge();
    
    // ===== THE FIX: INSTANT UI UPDATE =====
    
    // Update the button on the Homepage/Category page
    const productCard = document.querySelector(`[data-product-id="${id}"]`);
    if (productCard) {
        const cardBtn = productCard.querySelector('.card-add-to-cart');
        if (cardBtn) {
            cardBtn.classList.add('disabled');
            cardBtn.innerHTML = '✓ In Cart';
            cardBtn.onclick = () => showToast("Already in cart", "error");
        }
    }

    // Update the button if you are on the Product Detail page
    const detailBtn = document.querySelector('.btn-add-to-cart');
    // We check if the ID of the product page matches the ID being added
    const params = new URLSearchParams(window.location.search);
    if (detailBtn && parseInt(params.get('id')) === id) {
        detailBtn.classList.add('disabled');
        detailBtn.innerHTML = '✓ Already in Cart';
        detailBtn.onclick = () => showToast("Already in cart", "error");
        
        // Hide "Order Now" button if it exists on product page
        const orderNowBtn = document.querySelector('.btn-order-now');
        if (orderNowBtn) orderNowBtn.style.display = 'none';
    }
}


function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart-count-badge');

    if (badge) {
        const itemCount = cart.length; // No quantity - just count items
        
        if (itemCount > 0) {
            badge.textContent = itemCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === id);
    
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart.splice(itemIndex, 1);
        showToast(`${product.name} removed from cart`, "error");
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    if (document.getElementById('cart-items')) {
        loadCartItems();
    }
}


function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('cart-total');

    if (!container || !totalDisplay) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
        totalDisplay.textContent = 'Total: £0.00';
        return;
    }

    cart.forEach(item => {
        const price = parseFloat(item.price) || 0;
        total += price;

        // Create clickable cart item with links to product details
        const cartItemHTML = `
            <div class="cart-item">
                <a href="product.html?id=${item.id}" class="cart-item-image-link" title="View product details">
                    <img src="${item.images[0]}" alt="${item.name}" class="cart-item-img" loading="lazy">
                </a>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">
                        <a href="product.html?id=${item.id}" class="cart-item-link" title="View product details">${item.name}</a>
                    </h3>
                    <p class="cart-item-brand"><strong>${item.brand}</strong></p>
                    <p class="cart-item-size">${item.size}</p>
                    <p class="cart-item-condition">Condition: ${item.condition}</p>
                    <p class="cart-item-price" style="font-weight: 700; color: #28a745;">£${price.toFixed(2)}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove from cart">Remove</button>
            </div>
        `;
        
        container.innerHTML += cartItemHTML;
    });

    totalDisplay.textContent = `Total: £${total.toFixed(2)}`;

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = proceedToCheckout;
    }
}


function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        showToast("Your cart is empty! Add items before checkout.", "error");
        return false;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showToast("Please login to proceed to checkout.", "error");
        setTimeout(() => window.location.href = 'account.html', 1500);
        return false;
    }

    window.location.href = 'checkout.html';
    return false;
}

function orderNow(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === id);
    
    if (cart.some(item => item.id === id)) {
        showToast(`${product.name} is already in your cart!`, "error");
        return;
    }

    addToCart(id);
    setTimeout(() => {
        proceedToCheckout();
    }, 500);
}

// ===== CHECKOUT PAGE =====
function initializeCheckoutPage() {
    if (document.getElementById('checkout-form')) {
        // Checkout logic is in checkout.js
    }
}

 // ===== CATEGORY FILTER =====
function initializeCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // UI Update
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get the category from the button
            const selectedCategory = this.getAttribute('data-category');
            console.log("Filtering by:", selectedCategory); // Debugging
            
            filterProductsByCategory(selectedCategory);
        });
    });
}
// Filter products based on selected category
function filterProductsByCategory(selectedCategory) {
    if (selectedCategory === 'all') {
        displayProducts(products, 'products');
        return;
    }

    const filtered = products.filter(p => {
        // If p.category is an array: ['winter', 'jackets']
        if (Array.isArray(p.category)) {
            return p.category.includes(selectedCategory);
        }
        // If p.category is just a string: 'winter'
        return p.category === selectedCategory;
    });

    console.log("Found items:", filtered.length); // Debugging
    displayProducts(filtered, 'products');
}

// ===== ACCOUNT PAGE =====
function initializeAccountPage() {
    const container = document.querySelector('.account-container');
    if (!container) return;

    // Account page doesn't need tab logic here - it's handled by account.js
}

// ===== GLOBAL UTILITIES =====
function updateAccountLink() {
    const accountLink = document.getElementById('account-link');
    if (!accountLink) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        accountLink.href = 'user-profile.html';
        accountLink.title = 'My Profile';
    } else {
        accountLink.href = 'account.html';
        accountLink.title = 'Login / Sign Up';
    }
}



//f
document.addEventListener('DOMContentLoaded', function() {
    // Get all links in your footer or specific container
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', async function(event) {
            event.preventDefault();
            const url = this.getAttribute('href');
            
            try {
                const response = await fetch(url, { method: 'HEAD' });
                
                if (response.ok && response.status !== 404) {
                    window.location.href = url;
                } else {
                    window.location.href = '404.html';
                }
            } catch (error) {
                window.location.href = '404.html';
            }
        });
    });
});