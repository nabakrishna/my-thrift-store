// ===== ORDER HISTORY PAGE =====

document.addEventListener('DOMContentLoaded', function() {
    checkLoginAndLoadOrders();
});

function checkLoginAndLoadOrders() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showToast('Please login first', 'error');
        setTimeout(() => window.location.href = 'account.html', 1500);
        return;
    }
    
    loadOrders(currentUser);
}

function loadOrders(user) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.email === user.email);
    const container = document.getElementById('orders-content');
    
    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <div class="empty-orders-icon">📦</div>
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet. Start shopping now!</p>
                <a href="index.html" class="shop-now-btn">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let ordersHTML = '';
    userOrders.forEach(order => {
        const orderItems = order.cart.map(item => `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>£${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
        
        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">${order.orderID}</div>
                    <div class="order-date">📅 ${order.timestamp}</div>
                </div>
                
                <div class="order-details">
                    <h3>Items Ordered:</h3>
                    ${orderItems}
                </div>
                
                <div class="shipping-info">
                    <p><strong>Shipping To:</strong> ${order.fullName}</p>
                    <p>${order.address}, ${order.city} - ${order.zipCode}</p>
                    <p>📞 ${order.phone}</p>
                </div>
                
                <div class="order-total">
                    Total: £${order.totalAmount.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = ordersHTML;
}

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
