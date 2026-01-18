// ===== CHECKOUT PAGE WITH FORMAT VALIDATION =====

let emailVerified = false;
let phoneVerified = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    setupEmailValidation();
    setupPhoneValidation();
    setupFormSubmission();
    displayCartSummary();
});

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setupEmailValidation() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;
    
    emailInput.addEventListener('blur', function() {
        validateEmailFormat(this.value.trim());
    });
}

function validateEmailFormat(email) {
    const emailInput = document.getElementById('email');
    
    if (!email) {
        emailVerified = false;
        removeVerificationStatus('email');
        return;
    }
    
    if (isValidEmail(email)) {
        emailVerified = true;
        showVerificationSuccess('email', `Email verified: ${email}`);
        checkCompleteOrderButton();
    } else {
        emailVerified = false;
        showNotification('Please enter a valid email address', 'error');
        removeVerificationStatus('email');
    }
}

// ===== PHONE VALIDATION =====
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

function setupPhoneValidation() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('blur', function() {
        validatePhoneFormat(this.value.trim());
    });
}

function validatePhoneFormat(phone) {
    const phoneInput = document.getElementById('phone');
    
    if (!phone) {
        phoneVerified = false;
        removeVerificationStatus('phone');
        return;
    }
    
    if (isValidPhone(phone)) {
        phoneVerified = true;
        showVerificationSuccess('phone', `Phone verified: ${phone}`);
        checkCompleteOrderButton();
    } else {
        phoneVerified = false;
        showNotification('Please enter a valid 10-digit phone number', 'error');
        removeVerificationStatus('phone');
    }
}

// ===== VERIFICATION STATUS DISPLAY =====
function showVerificationSuccess(fieldType, message) {
    const inputField = document.getElementById(fieldType);
    if (!inputField) return;
    
    removeVerificationStatus(fieldType);
    
    const successDiv = document.createElement('div');
    successDiv.className = 'verification-success';
    successDiv.id = `${fieldType}-verification-status`;
    successDiv.innerHTML = `✓ ${message}`;
    
    inputField.parentNode.appendChild(successDiv);
    
    inputField.classList.add('verified');
    inputField.classList.remove('error');
}

function removeVerificationStatus(fieldType) {
    const existingStatus = document.getElementById(`${fieldType}-verification-status`);
    if (existingStatus) {
        existingStatus.remove();
    }
    
    const inputField = document.getElementById(fieldType);
    if (inputField) {
        inputField.classList.remove('verified');
    }
}

// ===== CHECK IF ORDER CAN BE COMPLETED =====
function checkCompleteOrderButton() {
    const completeBtn = document.getElementById('complete-order-btn');
    if (completeBtn) {
        completeBtn.disabled = !(emailVerified && phoneVerified);
    }
}

// ===== SETUP FORM SUBMISSION =====
function setupFormSubmission() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (!isValidPhone(phone)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        if (!emailVerified || !phoneVerified) {
            showNotification('Please verify both email and phone', 'error');
            return;
        }
        
        handleCheckoutSubmit();
    });
}

// ===== HANDLE CHECKOUT SUBMISSION =====
function handleCheckoutSubmit() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Ensure prices are numbers
    const cleanCart = cart.map(item => ({
        ...item,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1
    }));
    
    const totalAmount = calculateCartTotal(cleanCart);
    
    const orderData = {
        fullName: document.getElementById('full-name').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        zipCode: document.getElementById('zip-code').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        cart: cleanCart,
        timestamp: new Date().toLocaleString(),
        orderID: '#' + Date.now(),
        totalAmount: parseFloat(totalAmount.toFixed(2))
    };

    console.log('Order data:', orderData);

    try {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        localStorage.removeItem('cart');
        
        console.log('Order saved. Showing modal...');
        showSuccessModal(orderData);

    } catch (error) {
        console.error('Error:', error);
        showNotification('Error placing order: ' + error.message, 'error');
    }
}

// ===== CALCULATE CART TOTAL (WITH SAFETY CHECKS) =====
function calculateCartTotal(cart = null) {
    if (!cart) {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        total += (price * quantity);
    });
    
    return isNaN(total) ? 0 : total;
}

// ===== DISPLAY CART SUMMARY =====
function displayCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotalElement.textContent = 'Total: £0.00';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-summary-item">
                <span>${item.name || 'Product'} x ${quantity}</span>
                <span>£${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    
    // Display total with proper formatting
    if (isNaN(total)) {
        cartTotalElement.textContent = 'Total: £0.00';
        console.warn('Total calculation resulted in NaN, displaying 0.00');
    } else {
        cartTotalElement.textContent = `Total: £${total.toFixed(2)}`;
    }
    
    console.log('Cart summary displayed. Total:', total);
}

// ===== SUCCESS MODAL =====
function showSuccessModal(orderData) {
    console.log('Creating success modal');
    
    const modal = document.createElement('div');
    modal.className = 'success-modal-overlay';
    
    const totalAmount = parseFloat(orderData.totalAmount) || 0;
    
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for shopping with TheThriftBee!</p>
            <p style="font-weight: 600;">We'll contact you at: <strong>${orderData.phone}</strong></p>
            <p style="color: #666; font-size: 0.9rem;">Order ID: ${orderData.orderID}</p>
            <p style="color: #28a745; font-size: 1.1rem; font-weight: 700;">Total: £${totalAmount.toFixed(2)}</p>
            <button class="modal-btn" onclick="window.location.href='index.html'">Continue Shopping</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('Modal added to page');
}

// ===== NOTIFICATION =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'error' ? '#ff4444' : '#4CAF50'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== STYLES =====
const style = document.createElement('style');
style.textContent = `
    .success-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .success-modal-content {
        background: white;
        padding: 40px;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: scaleIn 0.3s ease;
    }
    
    .success-icon {
        width: 80px;
        height: 80px;
        background-color: #28a745;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        margin: 0 auto 20px;
    }
    
    .modal-btn {
        padding: 12px 30px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 20px;
        transition: background-color 0.3s ease;
    }
    
    .modal-btn:hover {
        background-color: #218838;
    }
    
    .verification-success {
        color: #28a745;
        font-weight: 600;
        padding: 10px;
        background: #f0fff4;
        border-radius: 5px;
        margin-top: 8px;
        font-size: 0.9rem;
        animation: slideDown 0.3s ease;
    }
    
    input.verified {
        border-color: #28a745 !important;
        background-color: #f0fff4;
    }
    
    input.error {
        border-color: #ff4444 !important;
        background-color: #fff5f5;
    }
    
    #complete-order-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .cart-summary-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);
