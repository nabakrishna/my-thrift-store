/* === TOAST NOTIFICATION FUNCTION === */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* === FORM SUBMISSION === */
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const productName = document.getElementById('product-name').value.trim();
    const productSize = document.getElementById('product-size').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productCategory = document.getElementById('product-category').value;
    const productBrand = document.getElementById('product-brand').value.trim();
    const productColour = document.getElementById('product-colour').value.trim();
    const productCondition = document.getElementById('product-condition').value;
    const productMaterials = document.getElementById('product-materials').value.trim();
    const productDescription = document.getElementById('product-description').value.trim();
    const productImages = document.getElementById('product-images').files;

    // Validation
    if (!productName || !productSize || !productPrice || !productCategory || !productBrand || 
        !productColour || !productCondition || !productMaterials || !productDescription) {
        showToast("Please fill in all required fields", "error");
        return;
    }

    if (productImages.length === 0) {
        showToast("Please upload at least one image", "error");
        return;
    }

    if (productPrice <= 0) {
        showToast("Price must be greater than 0", "error");
        return;
    }

    // In a real application, you would:
    // 1. Upload images to a server
    // 2. Get image URLs back
    // 3. Create product object with those URLs
    // 4. Save to database

    // For now, we'll simulate this:
    showToast("Product added successfully! (Demo mode)");
    
    // Log the data (in production, this would be sent to your backend)
    console.log({
        name: productName,
        size: productSize,
        price: productPrice,
        category: productCategory,
        brand: productBrand,
        colour: productColour,
        condition: productCondition,
        materials: productMaterials,
        description: productDescription,
        imageCount: productImages.length
    });

    // Reset form
    setTimeout(() => {
        this.reset();
        showToast("Form cleared. Ready for next product.");
    }, 1500);
});

