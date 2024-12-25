let userHasAccount = false;

document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update the cart count
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Function to display cart items
    function displayCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalHeader = document.getElementById('cart-total-header');
        const cartTotalModal = document.getElementById('cart-total-modal');

        if (cartItemsContainer && cartTotalHeader && cartTotalModal) {
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
                cartTotalHeader.textContent = '0';
                cartTotalModal.textContent = '0';
                return;
            }

            const products = [
                { id: 1, name: "Cat's food-PURINA", price: 7800 },
                { id: 2, name: "Cat's food-KOTT", price: 9000 },
                { id: 3, name: "Dog's food-CHAPPI", price: 15000 },
                { id: 4, name: "Fish's food-REPTO CAL", price: 2200 },
                { id: 5, name: "Cat's food-MONGE", price: 10900 },
                { id: 6, name: "Bird's food-FIORY", price: 5600 },
                { id: 7, name: "Rabbit's food-FIORY", price: 8100 },
                { id: 8, name: "Dog's food-MONGE", price: 900 }
            ];

            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('cart-item');

                    const itemName = document.createElement('span');
                    itemName.textContent = product.name;

                    const itemPrice = document.createElement('span');
                    itemPrice.textContent = `${product.price} KZT`;

                    const itemQuantity = document.createElement('span');
                    itemQuantity.textContent = `Количество: ${cartItem.quantity}`;

                    const removeBtn = document.createElement('span');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.classList.add('remove-icon');
                    removeBtn.style.cursor = 'pointer';
                    removeBtn.addEventListener('click', () => removeFromCart(cartItem.id));

                    itemDiv.appendChild(itemName);
                    itemDiv.appendChild(itemPrice);
                    itemDiv.appendChild(itemQuantity);
                    itemDiv.appendChild(removeBtn);

                    cartItemsContainer.appendChild(itemDiv);
                    totalPrice += product.price * cartItem.quantity;
                }
            });

            // Update totals in both header and modal
            cartTotalHeader.textContent = totalPrice;
            cartTotalModal.textContent = totalPrice;
        }
    }

    // Function to add items to the cart
    function addToCart(itemId) {
        const existingItem = cart.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: itemId, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        showNotification('Товар добавлен в корзину!', 'success');
    }

    // Function to remove items from the cart
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        showNotification('Товар удалён из корзины!', 'info');
    }

    // Function to clear the cart
    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        showNotification('Корзина очищена!', 'warning');
    }

    // Event listeners for "Add to Cart" buttons
    document.querySelectorAll('.bbtn a').forEach((button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const itemId = parseInt(button.getAttribute('data-id'));
            if (!isNaN(itemId)) {
                addToCart(itemId);
            }
        });
    });

    // Event listener for "Clear Cart" button
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function () {
            clearCart();
        });
    }

    // Event listeners for showing and hiding the cart modal
    const shoppingBagIcon = document.getElementById('shopping-bag-icon');
    const cartModal = document.getElementById('cart');
    const closeCartButton = document.getElementById('close-cart');

    if (shoppingBagIcon && cartModal && closeCartButton) {
        shoppingBagIcon.addEventListener('click', function (e) {
            e.preventDefault();
            displayCartItems();
            cartModal.style.display = 'block';
        });

        closeCartButton.addEventListener('click', function () {
            cartModal.style.display = 'none';
        });
    }

    // Notification Function
    function showNotification(message, type = 'info') {
        // Create container if not present
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        // Create notification element
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.marginBottom = '10px';
        notif.style.padding = '15px 20px';
        notif.style.borderRadius = '8px';
        notif.style.color = '#fff';
        notif.style.fontWeight = 'bold';
        notif.style.fontSize = '14px';
        notif.style.transition = 'opacity 0.5s ease';

        // Styling by type
        if (type === 'success') notif.style.backgroundColor = '#2ecc71';
        else if (type === 'warning') notif.style.backgroundColor = '#f1c40f';
        else if (type === 'info') notif.style.backgroundColor = '#3498db';

        // Add notification
        container.appendChild(notif);

        // Auto-remove
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => {
                if (notif.parentNode) {
                    notif.parentNode.removeChild(notif);
                }
            }, 500);
        }, 3000);
    }

    // Initialize cart display on page load
    updateCartCount();
    displayCartItems();
});