/* ========================================
   The Luxe Yarn Co - Shopify Buy Button
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

// Shopify Buy Button
(function () {
    var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    if (window.ShopifyBuy) {
        if (window.ShopifyBuy.UI) {
            ShopifyBuyInit();
        } else {
            loadScript();
        }
    } else {
        loadScript();
    }

    function loadScript() {
        var script = document.createElement('script');
        script.async = true;
        script.src = scriptURL;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
        script.onload = ShopifyBuyInit;
    }

    function ShopifyBuyInit() {
        var client = ShopifyBuy.buildClient({
            domain: 'ycq1ca-jy.myshopify.com',
            storefrontAccessToken: '1a15380bfdef78c677355b167aa5cd12',
        });

        ShopifyBuy.UI.onReady(client).then(function (ui) {
            ui.createComponent('collection', {
                id: '538440794413',
                node: document.getElementById('collection-component-1776710229535'),
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: {
                    "product": {
                        "styles": {
                            "product": {
                                "@media (min-width: 601px)": {
                                    "max-width": "calc(33.33% - 20px)",
                                    "margin-left": "20px",
                                    "margin-bottom": "30px",
                                    "width": "calc(33.33% - 20px)"
                                },
                                "@media (max-width: 600px)": {
                                    "max-width": "calc(50% - 10px)",
                                    "margin-left": "10px",
                                    "margin-bottom": "20px"
                                },
                                "img": {
                                    "height": "calc(100% - 15px)",
                                    "position": "absolute",
                                    "left": "0",
                                    "right": "0",
                                    "top": "0",
                                    "border-radius": "16px"
                                },
                                "imgWrapper": {
                                    "padding-top": "calc(100% + 15px)",
                                    "position": "relative",
                                    "height": "0"
                                }
                            },
                            "title": {
                                "font-family": "Nunito, sans-serif",
                                "font-size": "14px",
                                "font-weight": "600",
                                "color": "#4a4a4a"
                            },
                            "button": {
                                "font-family": "Nunito, sans-serif",
                                "font-size": "13px",
                                "font-weight": "600",
                                "padding": "10px 20px",
                                ":hover": {
                                    "background-color": "#c9a190"
                                },
                                "background-color": "#d4a5a5",
                                ":focus": {
                                    "background-color": "#c9a190"
                                },
                                "border-radius": "50px"
                            },
                            "price": {
                                "font-family": "Nunito, sans-serif",
                                "font-size": "14px",
                                "color": "#8b7355"
                            },
                            "compareAt": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#8b7355"
                            },
                            "unitPrice": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#8b7355"
                            }
                        },
                        "text": {
                            "button": "Add to cart"
                        }
                    },
                    "productSet": {
                        "styles": {
                            "products": {
                                "@media (min-width: 601px)": {
                                    "margin-left": "-20px"
                                },
                                "@media (max-width: 600px)": {
                                    "margin-left": "-10px"
                                }
                            }
                        }
                    },
                    "modalProduct": {
                        "contents": {
                            "img": false,
                            "imgWithCarousel": true,
                            "button": false,
                            "buttonWithQuantity": true
                        },
                        "styles": {
                            "product": {
                                "@media (min-width: 601px)": {
                                    "max-width": "100%",
                                    "margin-left": "0px",
                                    "margin-bottom": "0px"
                                }
                            },
                            "button": {
                                "font-family": "Nunito, sans-serif",
                                "font-weight": "600",
                                ":hover": {
                                    "background-color": "#c9a190"
                                },
                                "background-color": "#d4a5a5",
                                ":focus": {
                                    "background-color": "#c9a190"
                                },
                                "border-radius": "50px"
                            },
                            "title": {
                                "font-family": "Playfair Display, serif",
                                "font-weight": "600",
                                "font-size": "24px",
                                "color": "#4a4a4a"
                            },
                            "price": {
                                "font-family": "Nunito, sans-serif",
                                "font-weight": "500",
                                "font-size": "18px",
                                "color": "#8b7355"
                            },
                            "compareAt": {
                                "font-family": "Nunito, sans-serif",
                                "font-weight": "normal",
                                "font-size": "15px",
                                "color": "#8b7355"
                            },
                            "unitPrice": {
                                "font-family": "Nunito, sans-serif",
                                "font-weight": "normal",
                                "font-size": "15px",
                                "color": "#8b7355"
                            }
                        },
                        "text": {
                            "button": "Add to cart"
                        }
                    },
                    "option": {
                        "styles": {
                            "label": {
                                "font-family": "Nunito, sans-serif"
                            },
                            "select": {
                                "font-family": "Nunito, sans-serif"
                            }
                        }
                    },
                    "cart": {
                        "styles": {
                            "button": {
                                "font-family": "Nunito, sans-serif",
                                "font-weight": "600",
                                ":hover": {
                                    "background-color": "#c9a190"
                                },
                                "background-color": "#d4a5a5",
                                ":focus": {
                                    "background-color": "#c9a190"
                                },
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
                                ":hover": {
                                    "color": "#4a4a4a"
                                }
                            },
                            "empty": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#7a7a7a"
                            },
                            "noteDescription": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#4a4a4a"
                            },
                            "discountText": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#4a4a4a"
                            },
                            "discountIcon": {
                                "fill": "#4a4a4a"
                            },
                            "discountAmount": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#4a4a4a"
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
                                ":hover": {
                                    "background-color": "#c9a190"
                                },
                                ":focus": {
                                    "background-color": "#c9a190"
                                }
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
                            "fullPrice": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#7a7a7a"
                            },
                            "discount": {
                                "font-family": "Nunito, sans-serif",
                                "color": "#d4a5a5"
                            },
                            "discountIcon": {
                                "fill": "#d4a5a5"
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
                },
            });
        });
    }
})();
