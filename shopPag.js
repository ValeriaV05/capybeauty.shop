document.addEventListener('DOMContentLoaded', async () => {
    const productListContainer = document.getElementById('productContainer');
    const paginationContainer = document.getElementById('pagination');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const productsPerPage = 8;
    let currentPage = 1;
    let productsData = [];

    async function fetchProducts() {
        await fetch(`https://fakestoreapi.com/products`)
            .then(response => response.json())
            .then(products => {
                productsData = products;
                displayProducts();
                displayPagination();
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const currentProducts = productsData.slice(startIndex, endIndex);

        productListContainer.innerHTML = '';

        currentProducts.forEach(product => {
            const productElement = createProductElement(product);
            productListContainer.appendChild(productElement);
        });
    }

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
            <span><strong>${product.category ? product.category : ''}</strong></span>
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

    function redirectToSProduct(product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'sproduct.html';
    }

    function generateStars(rating) {
        const starIcons = Array.from({length: 5}, (_, index) => {
            const isFilled = index < rating;
            return `<i class="fas fa-star${isFilled ? '' : '-empty'}"></i>`;
        });

        return starIcons.join('');
    }

    function displayPagination() {
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(productsData.length / productsPerPage);
        const maxPagesToShow = 5;

        let startPage = 1;
        let endPage = Math.min(maxPagesToShow, totalPages);

        if (currentPage > Math.floor(maxPagesToShow / 2)) {
            startPage = currentPage - Math.floor(maxPagesToShow / 2);
            endPage = startPage + maxPagesToShow - 1;
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }
        }

        if (startPage > 1) {
            const firstPageLink = document.createElement('a');
            firstPageLink.textContent = '1';
            firstPageLink.href = '#';
            firstPageLink.addEventListener('click', () => handlePageClick(1));
            paginationContainer.appendChild(firstPageLink);

            if (startPage > 2) {
                const ellipsisStart = document.createElement('a');
                ellipsisStart.textContent = '...';
                paginationContainer.appendChild(ellipsisStart);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageLink = document.createElement('a');
            pageLink.textContent = i;
            pageLink.href = '#';
            pageLink.addEventListener('click', () => handlePageClick(i));

            if (i === currentPage) {
                pageLink.classList.add('active');
            }

            paginationContainer.appendChild(pageLink);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsisEnd = document.createElement('a');
                ellipsisEnd.textContent = '...';
                paginationContainer.appendChild(ellipsisEnd);
            }

            const lastPageLink = document.createElement('a');
            lastPageLink.textContent = totalPages;
            lastPageLink.href = '#';
            lastPageLink.addEventListener('click', () => handlePageClick(totalPages));
            paginationContainer.appendChild(lastPageLink);
        }

        const nextPageLink = document.createElement('a');
        nextPageLink.innerHTML = '<i class="fal fa-long-arrow-alt-right"></i>';
        nextPageLink.href = '#';
        nextPageLink.addEventListener('click', () => handlePageClick(currentPage + 1));
        paginationContainer.appendChild(nextPageLink);
    }


    function handlePageClick(page) {
        currentPage = page;
        displayProducts();
        displayPagination();
    }

    await fetchProducts();
});