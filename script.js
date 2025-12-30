// ========================================
// CONFIGURATION - Easy to adjust settings
// ========================================
const CAROUSEL_CONFIG = {
    scrollSpeed: 1.2, // Scroll speed multiplier (0.1 = slow, 0.5 = medium, 1.0 = fast)
    // Examples (base speed is 60 px/sec):
    // 0.1 = very slow (6 px/sec)
    // 0.3 = slow (18 px/sec)
    // 0.5 = medium (30 px/sec) - default
    // 0.7 = fast (42 px/sec)
    // 1.0 = very fast (60 px/sec)
    // 1.5 = extremely fast (90 px/sec)
    enableDebugLogging: false, // Set to true to enable debug console logs
};

// ========================================
// Helper Functions
// ========================================

// Debug logging helper - only logs if enabled
function debugLog(...args) {
    if (CAROUSEL_CONFIG.enableDebugLogging) {
        console.log(...args);
    }
}

function debugError(...args) {
    if (CAROUSEL_CONFIG.enableDebugLogging) {
        console.error(...args);
    }
}

// Product data - Arrays of objects with image and link
// Format: { image: 'image-url', link: 'product-url' }
// To get product images:
//   Amazon: Visit product page → Right-click main product image → Copy image address
//   Etsy: Visit listing page → Right-click main listing image → Copy image address
const productData = {
    amazon: [
        { image: 'https://m.media-amazon.com/images/I/71RBA9J6-9L._AC_SX466_.jpg', link: 'https://amzn.to/491GYmM' },
        { image: 'https://m.media-amazon.com/images/I/71Kl8E6fm8L._AC_SX679_.jpg', link: 'https://amzn.to/4batmqy' },
        { image: 'https://m.media-amazon.com/images/I/71rlLPkr+bS._AC_SL1500_.jpg', link: 'https://amzn.to/4q0CRNC' },
        { image: 'https://m.media-amazon.com/images/I/91HBb4irxQL._AC_SL1500_.jpg', link: 'https://amzn.to/49zcSqL' },
        { image: 'https://m.media-amazon.com/images/I/71WPzEpqYfL._AC_SL1500_.jpg', link: 'https://amzn.to/3KTp9Nx' },
    ],
    etsy: [
        // Format: { image: 'image-url', link: 'listing-url' }
        // Example: { image: 'https://i.etsystatic.com/xxxxx.jpg', link: 'https://www.etsy.com/listing/1234567890/product' },
        { image: 'https://i.etsystatic.com/39488634/r/il/5186a4/7093515565/il_794xN.7093515565_70ye.jpg', link: 'https://theluxeyarnco.etsy.com/listing/1839404970' },
        { image: 'https://i.etsystatic.com/39488634/r/il/95b4e7/6749429503/il_794xN.6749429503_7x88.jpg', link: 'https://theluxeyarnco.etsy.com/listing/1885444577' },
        { image: 'https://i.etsystatic.com/39488634/r/il/6118f1/6905578281/il_794xN.6905578281_5l9r.jpg', link: 'https://theluxeyarnco.etsy.com/listing/4304548189' },
        { image: 'https://i.etsystatic.com/39488634/r/il/75c2dc/7527072301/il_794xN.7527072301_ptbv.jpg', link: 'https://theluxeyarnco.etsy.com/listing/4418847752' },
        { image: 'https://i.etsystatic.com/39488634/r/il/4ea53f/7328923037/il_794xN.7328923037_w5hj.jpg', link: 'https://theluxeyarnco.etsy.com/listing/4385979141' },
        { image: 'https://i.etsystatic.com/39488634/r/il/3d1aac/6891314183/il_794xN.6891314183_9w19.jpg', link: 'https://theluxeyarnco.etsy.com/listing/4301662946' },
        { image: 'https://i.etsystatic.com/39488634/r/il/bd08ea/5079527153/il_794xN.5079527153_re4s.jpg', link: 'https://theluxeyarnco.etsy.com/listing/1496295688' },
    ]
};

// Copy discount code to clipboard
function copyDiscountCode() {
    const code = 'NewYear10';
    navigator.clipboard.writeText(code).then(function() {
        const btn = document.querySelector('.discount-copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8L6 11L13 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        btn.style.background = '#4caf50';
        setTimeout(function() {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    });
}

window.onload = function() {
    debugLog('[DEBUG] Window loaded, initializing...');
    debugLog('[DEBUG] Product data:', productData);
    
    setTimeout(function() {
        var discountModal = new bootstrap.Modal(document.getElementById('discountModal'));
        discountModal.show();
    }, 1600);

    // Initialize product showcases (async)
    debugLog('[DEBUG] Initializing Amazon showcase with', productData.amazon.length, 'products');
    initProductShowcase('amazonShowcase', productData.amazon).catch((error) => {
        debugError('[DEBUG] Error initializing Amazon showcase:', error);
    });
    
    debugLog('[DEBUG] Initializing Etsy showcase with', productData.etsy.length, 'products');
    initProductShowcase('etsyShowcase', productData.etsy).catch((error) => {
        debugError('[DEBUG] Error initializing Etsy showcase:', error);
    });

    // Add sparkle effects on link hover (at cursor position)
    const links = document.querySelectorAll('.link');
    
    links.forEach(link => {
        let sparkleInterval;
        let mouseX = 0;
        let mouseY = 0;
        
        link.addEventListener('mouseenter', function() {
            // Create more pronounced sparkles at cursor position
            sparkleInterval = setInterval(() => {
                // Create multiple sparkles at once for more pronounced effect
                createSparkle(this, mouseX, mouseY);
                createSparkle(this, mouseX, mouseY);
            }, 80);
        });
        
        link.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            // Update mouse position relative to the button
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        
        link.addEventListener('mouseleave', function() {
            clearInterval(sparkleInterval);
        });
    });
    
    function createSparkle(link, mouseX, mouseY) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        
        // Random angle and distance for more pronounced spread
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40; // Increased distance
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        sparkle.style.setProperty('--sparkle-x', x + 'px');
        sparkle.style.setProperty('--sparkle-y', y + 'px');
        sparkle.style.left = mouseX + 'px';
        sparkle.style.top = mouseY + 'px';
        
        link.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000); // Longer duration for more visibility
    }
}

async function initProductShowcase(showcaseId, products) {
    debugLog('[DEBUG] initProductShowcase called', { showcaseId, productCount: products.length });
    
    const showcase = document.getElementById(showcaseId);
    if (!showcase) {
        debugError('[DEBUG] Showcase element not found:', showcaseId);
        return;
    }
    
    if (products.length === 0) {
        debugLog('[DEBUG] No products provided for', showcaseId);
        return;
    }
    
    const carousel = showcase.querySelector('.product-carousel');
    if (!carousel) {
        debugError('[DEBUG] Carousel element not found in', showcaseId);
        return;
    }
    
    debugLog('[DEBUG] Processing', products.length, 'products for', showcaseId);
    
    // Process products - each has image and link
    const processedProducts = products.map((product, index) => {
        debugLog(`[DEBUG] Processing product ${index + 1}/${products.length}:`, product);
        return {
            url: product.link,
            image: product.image,
            alt: `Product ${index + 1}`
        };
    });
    
    debugLog('[DEBUG] Processed products:', processedProducts);
    
    // Create infinite loop by duplicating items (5 sets for smoother looping)
    const itemWidth = 100 + 10; // width + gap
    const setWidth = processedProducts.length * itemWidth;
    let autoScrollSpeed = CAROUSEL_CONFIG.scrollSpeed; // Get scroll speed from config (pixels per second)
    let isHovered = false;
    let animationFrameId = null;
    let lastScrollTime = performance.now();
    
    debugLog('[DEBUG] Carousel dimensions:', {
        itemWidth,
        setWidth,
        totalProducts: processedProducts.length,
        totalSets: 5
    });
    
    // Populate products (5 sets for seamless infinite scroll)
    debugLog('[DEBUG] Populating carousel with 5 sets of products...');
    for (let set = 0; set < 5; set++) {
        processedProducts.forEach((product, index) => {
            const item = document.createElement('div');
            item.className = 'product-item';
            item.innerHTML = `
                <a href="${product.url}" target="_blank">
                    <img src="${product.image}" alt="${product.alt}" class="product-image" loading="lazy" onerror="this.src='https://via.placeholder.com/100?text=Product'">
                </a>
            `;
            carousel.appendChild(item);
        });
    }
    
    const totalItems = carousel.children.length;
    debugLog('[DEBUG] Carousel populated with', totalItems, 'items');
    
    // Wait for DOM to update, then set initial scroll position to middle set (set 2 of 5)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const initialScroll = setWidth * 2;
            carousel.scrollLeft = initialScroll;
            debugLog('[DEBUG] Initial scroll position set to:', initialScroll, {
                scrollWidth: carousel.scrollWidth,
                clientWidth: carousel.clientWidth,
                setWidth: setWidth,
                totalItems: carousel.children.length
            });
        });
    });
    
    // Improved infinite scroll logic with smoother transitions
    function checkInfiniteScroll() {
        const scrollLeft = carousel.scrollLeft;
        const scrollWidth = carousel.scrollWidth;
        const threshold4 = setWidth * 4;
        const threshold1 = setWidth;
        
        // If scrolled past the 4th set, jump back to 2nd set (seamless loop)
        if (scrollLeft >= threshold4) {
            const newScroll = setWidth * 2 + (scrollLeft - threshold4);
            debugLog('[DEBUG] Loop reset: scrolled past 4th set', {
                oldScroll: scrollLeft,
                newScroll: newScroll,
                threshold: threshold4
            });
            carousel.style.scrollBehavior = 'auto';
            carousel.scrollLeft = newScroll;
            requestAnimationFrame(() => {
                carousel.style.scrollBehavior = 'smooth';
            });
        }
        // If scrolled before the 1st set, jump forward to 3rd set (seamless loop)
        else if (scrollLeft <= threshold1) {
            const newScroll = setWidth * 3 - (setWidth - scrollLeft);
            debugLog('[DEBUG] Loop reset: scrolled before 1st set', {
                oldScroll: scrollLeft,
                newScroll: newScroll,
                threshold: threshold1
            });
            carousel.style.scrollBehavior = 'auto';
            carousel.scrollLeft = newScroll;
            requestAnimationFrame(() => {
                carousel.style.scrollBehavior = 'smooth';
            });
        }
    }
    
    // Auto-scroll function with frame-rate independent timing
    let scrollLogCounter = 0;
    
    function autoScroll(currentTime) {
        if (!isHovered) {
            if (!lastScrollTime) lastScrollTime = currentTime;
            const deltaTime = Math.min(currentTime - lastScrollTime, 100); // Cap delta time to prevent jumps
            lastScrollTime = currentTime;
            
            // Calculate scroll delta - autoScrollSpeed is a multiplier
            // Base speed: 60 pixels per second (higher base = better granularity at low speeds)
            // Multiply by speed setting to get final speed
            const baseSpeedPixelsPerSecond = 60;
            const pixelsPerSecond = baseSpeedPixelsPerSecond * autoScrollSpeed;
            const pixelsPerMillisecond = pixelsPerSecond / 1000;
            const scrollDelta = pixelsPerMillisecond * deltaTime;
            
            // Only scroll if content is wider than container and we have a positive delta
            if (carousel.scrollWidth > carousel.clientWidth && scrollDelta > 0) {
                const currentScroll = carousel.scrollLeft;
                const newScroll = currentScroll + scrollDelta;
                
                // Directly set scrollLeft with sub-pixel precision for smooth scrolling
                carousel.style.scrollBehavior = 'auto';
                carousel.scrollLeft = newScroll;
                
                // Log every 60 frames (roughly once per second at 60fps)
                scrollLogCounter++;
                if (scrollLogCounter % 60 === 0) {
                    debugLog('[DEBUG] Auto-scrolling', {
                        showcaseId,
                        scrollLeft: currentScroll.toFixed(2),
                        scrollWidth: carousel.scrollWidth,
                        clientWidth: carousel.clientWidth,
                        scrollDelta: scrollDelta.toFixed(4),
                        deltaTime: deltaTime.toFixed(2),
                        pixelsPerSecond: (60 * autoScrollSpeed).toFixed(2),
                        speedMultiplier: autoScrollSpeed.toFixed(2),
                        scrollSpeedSetting: CAROUSEL_CONFIG.scrollSpeed
                    });
                }
                
                checkInfiniteScroll();
            }
        }
        animationFrameId = requestAnimationFrame(autoScroll);
    }
    
    // Start auto-scroll after ensuring DOM is ready
    function startAutoScroll() {
        // Wait for next frame to ensure layout is complete
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                lastScrollTime = performance.now();
                debugLog('[DEBUG] Starting auto-scroll for', showcaseId, {
                    scrollWidth: carousel.scrollWidth,
                    clientWidth: carousel.clientWidth,
                    scrollLeft: carousel.scrollLeft,
                    itemCount: carousel.children.length
                });
                autoScroll(lastScrollTime);
            });
        });
    }
    
    startAutoScroll();
    
    // Pause on hover
    showcase.addEventListener('mouseenter', () => {
        isHovered = true;
        debugLog('[DEBUG] Auto-scroll paused (hover) for', showcaseId);
    });
    
    showcase.addEventListener('mouseleave', () => {
        isHovered = false;
        lastScrollTime = performance.now();
        debugLog('[DEBUG] Auto-scroll resumed for', showcaseId);
    });
    
    debugLog('[DEBUG] Product showcase initialized:', showcaseId);
}

// Optional: Fetch Etsy products from RSS feed
// You can uncomment and modify this function to fetch from Etsy RSS
/*
async function fetchEtsyProducts() {
    try {
        // Etsy shop RSS feed URL format
        const rssUrl = 'https://www.etsy.com/shop/theluxeyarnco/rss';
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        
        if (data.items) {
            productData.etsy = data.items.slice(0, 5).map(item => ({
                image: item.enclosure?.link || item.thumbnail || 'https://via.placeholder.com/100',
                url: item.link,
                alt: item.title
            }));
            
            // Reinitialize showcase with fetched data
            initProductShowcase('etsyShowcase', productData.etsy);
        }
    } catch (error) {
        console.error('Error fetching Etsy products:', error);
    }
}
// Uncomment to use: fetchEtsyProducts();
*/

