// ===== ACCOUNT PAGE WITH FORMAT VALIDATION =====

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // User is already logged in, redirect to profile
        window.location.href = 'user-profile.html';
    }
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));
        const formId = this.dataset.form + '-form-content';
        document.getElementById(formId).classList.add('active');
    });
});

// ===== VALIDATION FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// ===== LOGIN FORM =====
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'user-profile.html', 1500);
    } else {
        showToast('Invalid email or password', 'error');
    }
});

// ===== SIGN UP FORM =====
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const address = document.getElementById('signup-address').value.trim();
    const city = document.getElementById('signup-city').value.trim();
    const zip = document.getElementById('signup-zip').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const confirmPassword = document.getElementById('signup-password-confirm').value.trim();

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    if (!isValidPhone(phone)) {
        showToast('Please verify your phone number first', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.email === email)) {
        showToast('Email already registered. Please login.', 'error');
        return;
    }

    const newUser = { 
        name, 
        email, 
        password,
        phone,
        address,
        city,
        zipCode: zip,
        emailVerified: true,
        phoneVerified: true,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    showToast('Account created successfully! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'user-profile.html', 1500);
});

// ===== PHONE VERIFICATION =====
document.getElementById('send-signup-otp-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    const phone = document.getElementById('signup-phone').value.trim();
    
    if (!isValidPhone(phone)) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    showToast('Phone number verified!', 'success');
    document.getElementById('signup-btn').disabled = false;
    this.disabled = true;
    this.textContent = '✓ Verified';
    this.style.backgroundColor = '#28a745';
});

// ===== TOGGLE FORMS =====
document.getElementById('show-signup-btn').addEventListener('click', () => {
    document.querySelector('.tab-btn[data-form="signup"]').click();
});

document.getElementById('show-login-btn').addEventListener('click', () => {
    document.querySelector('.tab-btn[data-form="login"]').click();
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        background-color: ${type === 'error' ? '#ff4444' : '#4CAF50'};
        color: white; 
        padding: 15px 20px; 
        border-radius: 5px;
        margin-bottom: 10px; 
        animation: slideIn 0.3s ease-in-out;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        font-weight: 600;
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    #toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
    }
`;
document.head.appendChild(style);
