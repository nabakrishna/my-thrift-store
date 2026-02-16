
(function() {
    // ===== USER PROFILE PAGE - PRODUCTION VERSION =====
    
    var profileUserData = null;

    document.addEventListener('DOMContentLoaded', function() {
        // Add animation styles
        var style = document.createElement('style');
        style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
        document.head.appendChild(style);
        
        // Initialize
        checkLogin();
        
        // Setup form listener
        var form = document.getElementById('edit-profile-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                saveProfile();
            });
        }
    });

    function checkLogin() {
        var stored = localStorage.getItem('currentUser');
        
        if (!stored) {
            showMsg('Please login first', 'error');
            setTimeout(function() {
                window.location.href = 'account.html';
            }, 1500);
            return;
        }
        
        try {
            profileUserData = JSON.parse(stored);
            loadProfile(profileUserData);
        } catch (e) {
            showMsg('Error loading profile', 'error');
        }
    }

    function loadProfile(user) {
        if (!user) return;
        
        // Welcome name
        var welcome = document.getElementById('welcome-name');
        if (welcome) welcome.textContent = user.name ? user.name.split(' ')[0] : 'User';
        
        // Account info
        setText('profile-email', user.email);
        setText('profile-phone', user.phone);
        
        // Join date
        var joined = document.getElementById('profile-joined');
        if (joined) {
            if (user.createdAt) {
                var d = new Date(user.createdAt);
                joined.textContent = d.toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});
            } else {
                joined.textContent = 'Recently';
            }
        }
        
        // Shipping
        setText('profile-name', user.name);
        setText('profile-address', user.address || 'Not set');
        setText('profile-city', user.city || 'Not set');
        setText('profile-zip', user.zipCode || 'Not set');
        
        // Verification
        var emailSt = document.getElementById('email-status');
        if (emailSt) {
            emailSt.innerHTML = user.emailVerified 
                ? '📧 Email: <span style="color:#28a745;font-weight:600">✓ Verified</span>' 
                : '📧 Email: <span style="color:#ff4444">Not Verified</span>';
        }
        
        var phoneSt = document.getElementById('phone-status');
        if (phoneSt) {
            phoneSt.innerHTML = user.phoneVerified 
                ? '📱 Phone: <span style="color:#28a745;font-weight:600">✓ Verified</span>' 
                : '📱 Phone: <span style="color:#ff4444">Not Verified</span>';
        }
    }

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val || '-';
    }

    function setVal(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val || '';
    }

    function getVal(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    // Toggle Edit Mode
    window.toggleEditMode = function() {
        var view = document.getElementById('view-mode');
        var edit = document.getElementById('edit-mode');
        
        if (view) view.style.display = 'none';
        if (edit) edit.style.display = 'block';
        
        if (profileUserData) {
            setVal('edit-email', profileUserData.email);
            setVal('edit-phone', profileUserData.phone);
            setVal('edit-name', profileUserData.name);
            setVal('edit-address', profileUserData.address);
            setVal('edit-city', profileUserData.city);
            setVal('edit-zip', profileUserData.zipCode);
        }
        
        window.scrollTo({top:0, behavior:'smooth'});
    };

    // Cancel Edit
    window.cancelEdit = function() {
        var view = document.getElementById('view-mode');
        var edit = document.getElementById('edit-mode');
        
        if (view) view.style.display = 'block';
        if (edit) edit.style.display = 'none';
        
        setVal('edit-current-password', '');
        setVal('edit-new-password', '');
        setVal('edit-confirm-password', '');
        
        window.scrollTo({top:0, behavior:'smooth'});
    };

    // Save Profile
    function saveProfile() {
        var email = getVal('edit-email');
        var phone = getVal('edit-phone');
        var name = getVal('edit-name');
        var address = getVal('edit-address');
        var city = getVal('edit-city');
        var zip = getVal('edit-zip');
        
        var currPwd = getVal('edit-current-password');
        var newPwd = getVal('edit-new-password');
        var confPwd = getVal('edit-confirm-password');
        
        // Validate
        if (!name) {
            showMsg('Please enter your name', 'error');
            return;
        }
        
        var emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailReg.test(email)) {
            showMsg('Please enter a valid email', 'error');
            return;
        }
        
        var phoneReg = /^[0-9]{10}$/;
        if (!phoneReg.test(phone)) {
            showMsg('Please enter a valid 10-digit phone', 'error');
            return;
        }
        
        // Check email unique
        if (email !== profileUserData.email) {
            var users = JSON.parse(localStorage.getItem('users')) || [];
            for (var i = 0; i < users.length; i++) {
                if (users[i].email === email) {
                    showMsg('Email already taken', 'error');
                    return;
                }
            }
        }
        
        // Password validation
        var finalPwd = profileUserData.password;
        if (currPwd || newPwd || confPwd) {
            if (currPwd !== profileUserData.password) {
                showMsg('Current password is incorrect', 'error');
                return;
            }
            if (newPwd.length < 6) {
                showMsg('New password must be at least 6 characters', 'error');
                return;
            }
            if (newPwd !== confPwd) {
                showMsg('Passwords do not match', 'error');
                return;
            }
            finalPwd = newPwd;
        }
        
        // Update user object
        var updated = {
            id: profileUserData.id || Date.now(),
            name: name,
            email: email,
            phone: phone,
            password: finalPwd,
            address: address,
            city: city,
            zipCode: zip,
            emailVerified: profileUserData.emailVerified || false,
            phoneVerified: profileUserData.phoneVerified || false,
            createdAt: profileUserData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Save to users array
        var users = JSON.parse(localStorage.getItem('users')) || [];
        var found = false;
        for (var j = 0; j < users.length; j++) {
            if (users[j].email === profileUserData.email || users[j].id === profileUserData.id) {
                users[j] = updated;
                found = true;
                break;
            }
        }
        if (!found) users.push(updated);
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updated));
        profileUserData = updated;
        
        loadProfile(updated);
        window.cancelEdit();
        showMsg('Profile updated successfully!', 'success');
    }

    // Logout
    window.handleLogout = function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            showMsg('Logged out successfully', 'success');
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        }
    };

    // View Orders
    window.viewOrders = function() {
        window.location.href = 'order-history.html';
    };

    // Toast Message
    function showMsg(msg, type) {
        type = type || 'success';
        
        var container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999';
            document.body.appendChild(container);
        }
        
        var colors = {success:'#4CAF50', error:'#ff4444', info:'#2196F3'};
        var bg = colors[type] || colors.success;
        
        var toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'background:'+bg+';color:#fff;padding:15px 20px;border-radius:5px;margin-bottom:10px;box-shadow:0 4px 8px rgba(0,0,0,0.2);font-weight:600;animation:slideIn 0.3s';
        container.appendChild(toast);
        
        setTimeout(function() {
            toast.style.animation = 'slideOut 0.3s';
            setTimeout(function() {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 3000);
    }

})();