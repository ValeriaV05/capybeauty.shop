document.addEventListener('DOMContentLoaded', async () => {
    const productListContainer = document.querySelector('.pro-container');
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (product) {
        document.getElementById('MainImg').src = product.image;
        document.getElementById('BrandName').textContent = product.category;
        document.getElementById('ProductName').textContent = product.title;
        document.getElementById('ProductPrice').textContent = `${product.price} $ `;
        document.getElementById('ProductDescription').textContent = product.description ? product.description : '';
    } else {
        console.error('Product data not found in local storage.');
    }

    await fetch(`https://fakestoreapi.com/products`)
        .then(response => response.json())
        .then(products => {
            products.slice(3, 11).forEach(product => {
                const productElement = createProductElement(product);
                productListContainer.appendChild(productElement);
            });
        })
        .catch(error => console.error('Error fetching products:', error));

    function createProductElement(product) {
        const productElement = document.createElement('div');
        productElement.classList.add('pro');
        productElement.addEventListener('click', () => redirectToSProduct(product));
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart-button');
        addToCartButton.innerHTML = '<i class="fal fa-shopping-cart cart"></i>';
        addToCartButton.addEventListener('click', (event) => addToCart(event, product));

        productElement.innerHTML = `
                    <img class="img" src="${product.image}" alt="">
                    <div class="des">
                        <span><strong>${product.category}</strong></span>
                        <h5>${product.title}</h5>
                        <div class="star">
                            ${generateStars(product.rating.rate ? product.rating.rate : 1.0)}
                        </div>
                        <div class="price">
                            <h4>${product.price} $</h4>
                        </div>
                    </div>
                `;
        productElement.appendChild(addToCartButton);
        return productElement;
    }

    function generateStars(rating) {
        const starIcons = Array.from({length: 5}, (_, index) => {
            const isFilled = index < rating;
            return `<i class="fas fa-star${isFilled ? '' : '-empty'}"></i>`;
        });

        return starIcons.join('');
    }

    function addToCart(event, product) {
        const existingCartItem = cartItems.find(item => item.product.id === product.id);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cartItems.push({
                product: product,
                quantity: 1,
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        event.stopPropagation();
    }

    function redirectToSProduct(product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'sproduct.html';
    }
});

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function addToCart() {
    const quantityInput = document.getElementById('quantityInput');
    const quantity = parseInt(quantityInput.value, 10);
    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid positive quantity.');
        return;
    }
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    const existingCartItem = cartItems.find(item => item.product.id === selectedProduct.id);

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    } else {
        cartItems.push({
            product: selectedProduct,
            quantity: quantity,
        });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


function renderCartItems() {
    const cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = '';

    let totalSum = 0;

    cartItems.forEach(item => {
        const row = document.createElement('tr');

        const itemTotal = item.product.price * item.quantity;
        totalSum += itemTotal;

        row.innerHTML = `
            <td><a href="#" onclick="removeCartItem(${item.product.id})"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${item.product.image}" alt=""></td>
            <td style="white-space: normal; word-wrap: break-word;">${item.product.title}</td>
            <td>${item.product.price} ₴</td>
            <td><input type="number" value="${item.quantity}" onchange="updateCartItemQuantity(${item.product.id}, this.value)"></td>
            <td>${itemTotal} ₴</td>
        `;

        cartBody.appendChild(row);
    });

    const totalSumContent = document.getElementById('totalSum');
    totalSumContent.textContent = `${totalSum} ₴`;
    const totalSumCell = document.getElementById('sum');
    totalSumCell.textContent = `${totalSum} ₴`;
}

function removeCartItem(productId) {
    cartItems = cartItems.filter(item => item.product.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCartItems();
}

function updateCartItemQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) {
        alert('Please enter a valid positive quantity.');
        return;
    }
    const cartItem = cartItems.find(item => item.product.id === productId);

    if (cartItem) {
        cartItem.quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCartItems();
    }
}

renderCartItems();