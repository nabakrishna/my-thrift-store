// ===== USER PROFILE PAGE WITH EDIT FUNCTIONALITY =====

let currentUserData = null;

document.addEventListener('DOMContentLoaded', function() {
    checkLoginAndLoadProfile();
});

function checkLoginAndLoadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showToast('Please login first', 'error');
        setTimeout(() => window.location.href = 'account.html', 1500);
        return;
    }
    
    currentUserData = currentUser;
    loadUserProfile(currentUser);
}

function loadUserProfile(user) {
    // Welcome message
    document.getElementById('welcome-name').textContent = user.name.split(' ')[0];
    
    // Account Information (View Mode)
    document.getElementById('profile-email').textContent = user.email || '-';
    document.getElementById('profile-phone').textContent = user.phone || '-';
    
    // Format join date
    if (user.createdAt) {
        const joinDate = new Date(user.createdAt);
        document.getElementById('profile-joined').textContent = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Shipping Details (View Mode)
    document.getElementById('profile-name').textContent = user.name || '-';
    document.getElementById('profile-address').textContent = user.address || '-';
    document.getElementById('profile-city').textContent = user.city || '-';
    document.getElementById('profile-zip').textContent = user.zipCode || '-';
    
    // Verification Status
    document.getElementById('email-status').innerHTML = user.emailVerified 
        ? '📧 Email: <span style="color: #28a745; font-weight: 600;">✓ Verified</span>' 
        : '📧 Email: <span style="color: #ff4444;">Not Verified</span>';
    
    document.getElementById('phone-status').innerHTML = user.phoneVerified 
        ? '📱 Phone: <span style="color: #28a745; font-weight: 600;">✓ Verified</span>' 
        : '📱 Phone: <span style="color: #ff4444;">Not Verified</span>';
}

// ===== TOGGLE EDIT MODE =====
function toggleEditMode() {
    document.getElementById('view-mode').style.display = 'none';
    document.getElementById('edit-mode').style.display = 'block';
    
    // Populate edit form with current data
    document.getElementById('edit-email').value = currentUserData.email;
    document.getElementById('edit-phone').value = currentUserData.phone;
    document.getElementById('edit-name').value = currentUserData.name;
    document.getElementById('edit-address').value = currentUserData.address || '';
    document.getElementById('edit-city').value = currentUserData.city || '';
    document.getElementById('edit-zip').value = currentUserData.zipCode || '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== CANCEL EDIT =====
function cancelEdit() {
    document.getElementById('view-mode').style.display = 'block';
    document.getElementById('edit-mode').style.display = 'none';
    
    // Clear password fields
    document.getElementById('edit-current-password').value = '';
    document.getElementById('edit-new-password').value = '';
    document.getElementById('edit-confirm-password').value = '';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== VALIDATION FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// ===== SAVE PROFILE CHANGES =====
document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('edit-profile-form');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
});

function saveProfileChanges() {
    // Get form values
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const name = document.getElementById('edit-name').value.trim();
    const address = document.getElementById('edit-address').value.trim();
    const city = document.getElementById('edit-city').value.trim();
    const zipCode = document.getElementById('edit-zip').value.trim();
    
    const currentPassword = document.getElementById('edit-current-password').value.trim();
    const newPassword = document.getElementById('edit-new-password').value.trim();
    const confirmPassword = document.getElementById('edit-confirm-password').value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate phone
    if (!isValidPhone(phone)) {
        showToast('Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    // Check if email is being changed and is already taken by another user
    if (email !== currentUserData.email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = users.find(u => u.email === email && u.email !== currentUserData.email);
        if (emailExists) {
            showToast('Email already taken by another user', 'error');
            return;
        }
    }
    
    // Password validation (if user wants to change password)
    let newPasswordToSave = currentUserData.password;
    if (currentPassword || newPassword || confirmPassword) {
        // Check current password
        if (currentPassword !== currentUserData.password) {
            showToast('Current password is incorrect', 'error');
            return;
        }
        
        // Validate new password
        if (newPassword.length < 6) {
            showToast('New password must be at least 6 characters', 'error');
            return;
        }
        
        // Check password match
        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }
        
        newPasswordToSave = newPassword;
        showToast('Password will be updated', 'info');
    }
    
    // Update user data
    const updatedUser = {
        ...currentUserData,
        email,
        phone,
        name,
        address,
        city,
        zipCode,
        password: newPasswordToSave
    };
    
    // Update in users array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUserData.email);
    
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update current user
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    currentUserData = updatedUser;
    
    // Reload profile view
    loadUserProfile(updatedUser);
    
    // Switch back to view mode
    cancelEdit();
    
    showToast('Profile updated successfully!', 'success');
}

// ===== OTHER FUNCTIONS =====
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        showToast('Logged out successfully', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
}

function viewOrders() {
    window.location.href = 'order-history.html';
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const colors = {
        success: '#4CAF50',
        error: '#ff4444',
        info: '#2196F3'
    };
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        background-color: ${colors[type] || colors.success};
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
