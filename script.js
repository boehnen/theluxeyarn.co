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
let shopSettings = {}; // Store shop-level metafields

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

    // Poll for cart restoration from localStorage, then update collection link
    let cartCheckAttempts = 0;
    const checkCartReady = () => {
        cartCheckAttempts++;
        const cart = shopifyUI.components.cart?.[0];
        if (cart && cart.model && cart.model.lineItems && cart.model.lineItems.length > 0) {
            updateCollectionLink();
        } else if (cartCheckAttempts < 15) {
            // Keep checking until cart is ready (up to 3 seconds)
            setTimeout(checkCartReady, 200);
        }
    };
    setTimeout(checkCartReady, 200);

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
                            stockStatus: metafield(namespace: "custom", key: "stock_status") {
                                value
                            }
                        }
                    }
                }
            }
            shop {
                leadTimeWeeks: metafield(namespace: "custom", key: "lead_time_weeks") {
                    value
                }
                vacationStart: metafield(namespace: "custom", key: "vacation_start_date") {
                    value
                }
                vacationReturn: metafield(namespace: "custom", key: "vacation_return_date") {
                    value
                }
                ordersPaused: metafield(namespace: "custom", key: "custom_orders_paused") {
                    value
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

        // Extract shop settings
        const shop = data.data.shop;
        shopSettings = {
            leadTimeWeeks: parseInt(shop.leadTimeWeeks?.value) || 3,
            vacationStart: shop.vacationStart?.value || null,
            vacationReturn: shop.vacationReturn?.value || null,
            ordersPaused: shop.ordersPaused?.value === 'true'
        };

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

function getVacationState() {
    const now = new Date();
    const returnDate = shopSettings.vacationReturn ? new Date(shopSettings.vacationReturn) : null;
    const startDate = shopSettings.vacationStart ? new Date(shopSettings.vacationStart) : null;

    if (!returnDate || returnDate <= now) {
        return 'none';
    } else if (!startDate) {
        return 'in-progress';
    } else if (startDate > now) {
        return 'upcoming';
    } else {
        return 'in-progress';
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function renderAnnouncementBar() {
    const existing = document.getElementById('announcement-bar');
    if (existing) existing.remove();

    const vacationState = getVacationState();
    let message = '';
    let icon = '';

    if (shopSettings.ordersPaused && vacationState === 'in-progress') {
        icon = '✈️';
        message = `I'm away until ${formatDate(shopSettings.vacationReturn)}. Custom orders paused while I catch up.`;
    } else if (shopSettings.ordersPaused) {
        icon = '⏸️';
        message = 'Custom and made-to-order items paused while I catch up.';
    } else if (vacationState === 'in-progress') {
        icon = '✈️';
        message = `I'm away until ${formatDate(shopSettings.vacationReturn)}. Orders ship after I return.`;
    } else if (vacationState === 'upcoming') {
        icon = '📦';
        message = `I'll be away ${formatDate(shopSettings.vacationStart)} to ${formatDate(shopSettings.vacationReturn)}. Order soon to ship before I leave!`;
    } else {
        icon = '🧶';
        message = `Currently making pieces ~${shopSettings.leadTimeWeeks} weeks out`;
    }

    const bar = document.createElement('div');
    bar.id = 'announcement-bar';
    bar.className = 'announcement-bar';
    bar.innerHTML = `<span class="announcement-icon">${icon}</span> ${message}`;

    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        mainContainer.insertBefore(bar, mainContainer.firstChild);
    }
}

function renderProducts(products, screenWidth) {
    const container = document.getElementById('product-grid');
    container.innerHTML = '';

    const isMobile = screenWidth < 768;
    const maxProducts = isMobile ? 6 : 8;
    const displayProducts = products.slice(0, maxProducts);

    displayProducts.forEach(product => {
        const variant = product.variants.edges[0]?.node;
        const images = product.images.edges.map(e => e.node);
        const image = images[0];
        const hoverImage = images[1] || images[0];
        const price = parseFloat(variant?.price?.amount || 0);
        const totalInventory = product.totalInventory;

        // Get stock status from metafield (single source of truth)
        const stockStatus = product.stockStatus?.value || 'in-stock';

        // Determine badge and button state based on stock_status metafield
        let badge = '';
        let buttonText = 'Add to Cart';
        let isDisabled = false;

        // Shipping estimate
        let shippingText = '';

        if (stockStatus === 'sold-out') {
            badge = '<span class="product-badge sold-out">Sold Out</span>';
            buttonText = 'Sold Out';
            isDisabled = true;
        } else if (stockStatus === 'made-to-order') {
            if (shopSettings.ordersPaused) {
                badge = '<span class="product-badge mto">Made to Order</span>';
                buttonText = 'Currently Paused';
                isDisabled = true;
            } else {
                badge = '<span class="product-badge mto">Made to Order</span>';
                buttonText = 'Add to Cart';
                shippingText = `Ships in ~${shopSettings.leadTimeWeeks} weeks`;
            }
        } else if (stockStatus === 'in-stock') {
            shippingText = 'Ships in 1-2 days';
            // Show low-stock badges only for in-stock items with positive inventory
            if (totalInventory === 1) {
                badge = '<span class="product-badge last-one">Last One!</span>';
            } else if (totalInventory > 1 && totalInventory <= 3) {
                badge = '<span class="product-badge low-stock">Only ' + totalInventory + ' left</span>';
            }
        }

        const card = document.createElement('div');
        card.className = 'product-card' + (isDisabled ? ' unavailable' : '');
        const productUrl = `https://shop.theluxeyarn.co/products/${product.handle}`;

        card.innerHTML = `
            <a href="${productUrl}" target="_blank" class="product-image-wrapper">
                ${badge}
                <img src="${image?.url || ''}" alt="${image?.altText || product.title}" class="product-image product-image-main" loading="lazy">
                <img src="${hoverImage?.url || ''}" alt="${hoverImage?.altText || product.title}" class="product-image product-image-hover" loading="lazy">
            </a>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">$${price.toFixed(2)}</p>
            ${shippingText ? `<p class="product-shipping">${shippingText}</p>` : ''}
            <button class="product-button" data-variant-id="${variant?.id}" ${isDisabled ? 'disabled' : ''}>
                ${buttonText}
            </button>
        `;

        const button = card.querySelector('.product-button');
        if (!isDisabled) {
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

        // Update collection link with cart items
        updateCollectionLink();

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

// Update "View Full Collection" link to include cart items
function updateCollectionLink() {
    const link = document.querySelector('.btn-shop');
    if (!link) return;

    const baseUrl = 'https://shop.theluxeyarn.co';
    const targetPage = '/collections/all';

    // Check if we have a cart with items
    if (shopifyUI && shopifyUI.components.cart && shopifyUI.components.cart[0]) {
        const cart = shopifyUI.components.cart[0];
        if (cart.model && cart.model.lineItems && cart.model.lineItems.length > 0) {
            // Use /cart/add endpoint which adds to native Shopify cart and redirects
            // Format: /cart/add?id=variantId&quantity=qty&id=variantId2&quantity=qty2&return_to=/path
            const params = new URLSearchParams();
            cart.model.lineItems.forEach(item => {
                const variantId = item.variant.id.replace('gid://shopify/ProductVariant/', '');
                params.append('id[]', variantId);
                params.append('quantity[]', item.quantity);
            });
            params.append('return_to', targetPage);

            link.href = `${baseUrl}/cart/add?${params.toString()}`;
            return;
        }
    }

    // No cart items, link to collections
    link.href = `${baseUrl}${targetPage}`;
}

// Initialize everything
initShopify();
