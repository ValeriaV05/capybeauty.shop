document.addEventListener('DOMContentLoaded', async () => {
    const productListContainer = document.querySelector('.pro-container');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const productListContainer2 = document.getElementById('pro-container2');

    await fetch(`https://fakestoreapi.com/products`)
        .then(response => response.json())
        .then(products => {
            products.slice(0, 8).forEach(product => {
                const productElement = createProductElement(product);
                productListContainer2.appendChild(productElement);
            });
        })
        .catch(error => console.error('Error fetching products:', error));

    await fetch(`https://fakestoreapi.com/products`)
        .then(response => response.json())
        .then(products => {
            products.slice(8, 16).forEach(product => {
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
        <img class="img" src="${product.image}" alt="${product.title}">
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

    function generateStars(rating) {
        const starIcons = Array.from({length: 5}, (_, index) => {
            const isFilled = index < rating;
            return `<i class="fas fa-star${isFilled ? '' : '-empty'}"></i>`;
        });

        return starIcons.join('');
    }

    function redirectToSProduct(product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'sproduct.html';
    }
});
