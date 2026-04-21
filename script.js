/* ========================================
   The Luxe Yarn Co - Custom Shopify Integration
   ======================================== */

// Testimonial Carousel
document.addEventListener('DOMContentLoaded', function() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentIndex = 0;
    let autoRotate;

    if (testimonials.length === 0) return;

    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Testimonial ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        testimonials[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');
        currentIndex = index;
        testimonials[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
        resetAutoRotate();
    }

    function nextSlide() {
        const next = (currentIndex + 1) % testimonials.length;
        goToSlide(next);
    }

    function resetAutoRotate() {
        clearInterval(autoRotate);
        autoRotate = setInterval(nextSlide, 5000);
    }

    // Start auto-rotation
    autoRotate = setInterval(nextSlide, 5000);
});

// Shopify Configuration
const SHOPIFY_DOMAIN = 'ycq1ca-jy.myshopify.com';
const STOREFRONT_TOKEN = '5f1115e8ba06b85dfc55f6fc89f136e5'; // Has inventory access
const CART_TOKEN = '1a15380bfdef78c677355b167aa5cd12'; // Buy Button token for cart
const COLLECTION_ID = 'gid://shopify/Collection/538471760173';

// Initialize Shopify Buy SDK for cart functionality
let shopifyClient = null;
let shopifyUI = null;
let cart = null;
let allProducts = []; // Store products for resize handling

async function initShopify() {
    // Load the Buy Button SDK
    const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    await new Promise((resolve) => {
        if (window.ShopifyBuy && window.ShopifyBuy.UI) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        script.onload = resolve;
        document.head.appendChild(script);
    });

    // Initialize client with cart token for checkout functionality
    shopifyClient = ShopifyBuy.buildClient({
        domain: SHOPIFY_DOMAIN,
        storefrontAccessToken: CART_TOKEN,
    });

    // Initialize UI with just the cart
    shopifyUI = await ShopifyBuy.UI.onReady(shopifyClient);

    // Create cart component
    shopifyUI.createComponent('cart', {
        node: document.getElementById('cart-container'),
        options: {
            "cart": {
                "styles": {
                    "button": {
                        "font-family": "Nunito, sans-serif",
                        "font-weight": "600",
                        ":hover": { "background-color": "#c9a190" },
                        "background-color": "#d4a5a5",
                        ":focus": { "background-color": "#c9a190" },
                        "border-radius": "50px"
                    },
                    "title": {
                        "font-family": "Playfair Display, serif",
                        "color": "#4a4a4a"
                    },
                    "header": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "lineItems": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "subtotalText": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "subtotal": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "notice": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#7a7a7a"
                    },
                    "currency": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "close": {
                        "color": "#4a4a4a",
                        ":hover": { "color": "#4a4a4a" }
                    },
                    "cart": {
                        "background-color": "#fffaf5"
                    },
                    "footer": {
                        "background-color": "#fffaf5"
                    }
                },
                "text": {
                    "total": "Subtotal",
                    "notice": "Shipping calculated at checkout (free orders $35+)",
                    "button": "Checkout"
                },
                "popup": false
            },
            "toggle": {
                "styles": {
                    "toggle": {
                        "font-family": "Nunito, sans-serif",
                        "background-color": "#d4a5a5",
                        ":hover": { "background-color": "#c9a190" },
                        ":focus": { "background-color": "#c9a190" }
                    },
                    "count": {
                        "font-family": "Nunito, sans-serif"
                    }
                }
            },
            "lineItem": {
                "styles": {
                    "variantTitle": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#7a7a7a"
                    },
                    "title": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "price": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "quantity": {
                        "font-family": "Nunito, sans-serif",
                        "color": "#4a4a4a"
                    },
                    "quantityIncrement": {
                        "color": "#4a4a4a",
                        "border-color": "#d4a5a5"
                    },
                    "quantityDecrement": {
                        "color": "#4a4a4a",
                        "border-color": "#d4a5a5"
                    },
                    "quantityInput": {
                        "color": "#4a4a4a",
                        "border-color": "#d4a5a5"
                    }
                }
            }
        }
    });

    // Fetch and render products
    await fetchAndRenderProducts();
}

async function fetchAndRenderProducts() {
    const query = `
        query {
            collection(id: "${COLLECTION_ID}") {
                products(first: 8) {
                    edges {
                        node {
                            id
                            title
                            handle
                            images(first: 2) {
                                edges {
                                    node {
                                        url
                                        altText
                                    }
                                }
                            }
                            variants(first: 1) {
                                edges {
                                    node {
                                        id
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        availableForSale
                                        quantityAvailable
                                        currentlyNotInStock
                                    }
                                }
                            }
                            totalInventory
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        allProducts = data.data.collection.products.edges.map(edge => edge.node);
        renderProducts(allProducts, window.innerWidth);

        // Re-render on resize to adjust product count
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                renderProducts(allProducts, window.innerWidth);
            }, 250);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function renderProducts(products, screenWidth) {
    const container = document.getElementById('product-grid');
    container.innerHTML = '';

    // Show 6 on mobile, 8 on desktop
    const isMobile = screenWidth < 768;
    const maxProducts = isMobile ? 6 : 8;
    const displayProducts = products.slice(0, maxProducts);

    displayProducts.forEach(product => {
        const variant = product.variants.edges[0]?.node;
        const images = product.images.edges.map(e => e.node);
        const image = images[0];
        const hoverImage = images[1] || images[0]; // Second image for hover, fallback to first
        const price = parseFloat(variant?.price?.amount || 0);
        const available = variant?.availableForSale;
        const quantity = variant?.quantityAvailable;




        // Determine inventory badge (quantity may be null if not tracked)
        let badge = '';
        if (!available) {
            badge = '<span class="product-badge sold-out">Sold Out</span>';
        } else if (quantity !== null && quantity === 0) {
            badge = '<span class="product-badge sold-out">Sold Out</span>';
        } else if (quantity !== null && quantity === 1) {
            badge = '<span class="product-badge last-one">Last One!</span>';
        } else if (quantity !== null && quantity <= 3) {
            badge = '<span class="product-badge low-stock">Only ' + quantity + ' left</span>';
        }
        // If quantity is null, product is available but inventory isn't tracked - no badge

        // Check if product is actually available (null quantity means unlimited/not tracked)
        const isAvailable = available && (quantity === null || quantity > 0);

        const card = document.createElement('div');
        card.className = 'product-card' + (!isAvailable ? ' unavailable' : '');
        const productUrl = `https://shop.theluxeyarn.co/products/${product.handle}`;

        card.innerHTML = `
            <a href="${productUrl}" target="_blank" class="product-image-wrapper">
                ${badge}
                <img src="${image?.url || ''}" alt="${image?.altText || product.title}" class="product-image product-image-main" loading="lazy">
                <img src="${hoverImage?.url || ''}" alt="${hoverImage?.altText || product.title}" class="product-image product-image-hover" loading="lazy">
            </a>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${price.toFixed(2)}</p>
            <button class="product-button" data-variant-id="${variant?.id}" ${!isAvailable ? 'disabled' : ''}>
                ${!isAvailable ? 'Sold Out' : 'Add to Cart'}
            </button>
        `;

        // Add to cart functionality
        const button = card.querySelector('.product-button');
        if (isAvailable) {
            button.addEventListener('click', () => addToCart(variant.id, button));
        }

        container.appendChild(card);
    });
}

async function addToCart(variantId, button) {
    button.disabled = true;
    button.textContent = 'Adding...';

    try {
        const cart = shopifyUI.components.cart[0];

        const lineItemsToAdd = [{
            variantId: variantId,
            quantity: 1
        }];

        let updatedCheckout;

        // Check if cart has a checkout, if not create one
        if (!cart.model || !cart.model.id) {
            // Create a new checkout with the item
            updatedCheckout = await shopifyClient.checkout.create({
                lineItems: lineItemsToAdd
            });
            // Store checkout ID for future use
            cart.model = updatedCheckout;
        } else {
            // Add to existing checkout
            updatedCheckout = await shopifyClient.checkout.addLineItems(cart.model.id, lineItemsToAdd);
            cart.model = updatedCheckout;
        }

        // Use SDK's native method to sync and render
        await cart.fetchData();

        // Update toggle
        if (cart.toggles && cart.toggles[0]) {
            cart.toggles[0].view.render();
        }

        // Open the cart
        cart.open();

        button.textContent = 'Added!';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.disabled = false;
        }, 1500);
    } catch (error) {
        console.error('Error adding to cart:', error);
        button.textContent = 'Error';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.disabled = false;
        }, 1500);
    }
}

// Initialize everything
initShopify();
