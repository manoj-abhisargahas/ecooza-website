// ===================================
// Ecooza Website - Main JavaScript
// ===================================

(function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

    // ===================================
    // Header Scroll Effect
    // ===================================
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            scrollToTopBtn.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            scrollToTopBtn.classList.remove('visible');
        }
    }

    // ===================================
    // Mobile Menu Toggle
    // ===================================
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile menu when clicking outside
    function handleClickOutside(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    }

    // ===================================
    // Mobile Dropdown Toggle
    // ===================================
    function handleMobileDropdown(e) {
        if (window.innerWidth <= 768) {
            const dropdownItem = e.currentTarget;
            e.preventDefault();
            
            // Close other dropdowns
            dropdownItems.forEach(item => {
                if (item !== dropdownItem) {
                    item.classList.remove('active');
                }
            });
            
            dropdownItem.classList.toggle('active');
        }
    }

    // ===================================
    // Smooth Scroll
    // ===================================
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = header.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 20;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ===================================
    // Scroll to Top
    // ===================================
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===================================
    // Intersection Observer for Animations
    // ===================================
    function initObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe animated elements
        const animatedElements = document.querySelectorAll('.industry-card, .category-card, .feature-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ===================================
    // Handle Internal Links
    // ===================================
    function handleInternalLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    smoothScroll(href);
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                }
            });
        });
    }

    // ===================================
    // Active Nav Link on Scroll
    // ===================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // ===================================
    // Lazy Loading Images
    // ===================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // ===================================
    // Form Validation (for future use)
    // ===================================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    // ===================================
    // Debounce Function
    // ===================================
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===================================
    // Page Load Animation
    // ===================================
    function initPageLoadAnimation() {
        document.body.style.opacity = '0';
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.3s ease';
            document.body.style.opacity = '1';
        });
    }

    // ===================================
    // Event Listeners
    // ===================================
    function initEventListeners() {
        // Scroll events
        window.addEventListener('scroll', debounce(() => {
            handleScroll();
            updateActiveNavLink();
        }, 10));

        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Click outside to close mobile menu
        document.addEventListener('click', handleClickOutside);

        // Dropdown toggles for mobile
        dropdownItems.forEach(item => {
            const navLink = item.querySelector('.nav-link');
            if (navLink) {
                navLink.addEventListener('click', handleMobileDropdown);
            }
        });

        // Scroll to top button
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', scrollToTop);
        }

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Close mobile menu on resize to desktop
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                // Remove active class from dropdowns on resize to desktop
                if (window.innerWidth > 768) {
                    dropdownItems.forEach(item => {
                        item.classList.remove('active');
                    });
                }
            }, 250);
        });
    }

    // ===================================
    // Cookie Consent (optional)
    // ===================================
    function initCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            // Create cookie consent banner if needed
            // This is a placeholder for future implementation
            console.log('Cookie consent not set');
        }
    }

    // ===================================
    // Initialize Analytics (placeholder)
    // ===================================
    function initAnalytics() {
        // Google Analytics or other analytics code goes here
        // This is a placeholder for future implementation
        console.log('Analytics initialized');
    }

    // ===================================
    // Gift Consultation Form
    // ===================================
    function initGiftConsultationForm() {
        const giftForm = document.getElementById('giftConsultationForm');
        if (!giftForm) return;

        giftForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In production, send data to server
            console.log('Gift consultation form submitted');
            
            // Show success message (you can customize this)
            alert('Thank you for your interest! Our gifting consultant will contact you within 24 hours.');
            
            // Reset form
            giftForm.reset();
        });
    }

    // ===================================
    // Contact Form Validation & Submission
    // ===================================
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const successMessage = document.getElementById('successMessage');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors();
            
            // Validate form
            let isValid = true;
            
            // Full Name validation
            const fullName = document.getElementById('fullName');
            if (!fullName.value.trim()) {
                showError('fullName', 'Full name is required');
                isValid = false;
            }
            
            // Company Name validation
            const companyName = document.getElementById('companyName');
            if (!companyName.value.trim()) {
                showError('companyName', 'Company name is required');
                isValid = false;
            }
            
            // Email validation
            const email = document.getElementById('email');
            if (!email.value.trim()) {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email.value)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Phone validation
            const phone = document.getElementById('phone');
            if (!phone.value.trim()) {
                showError('phone', 'Phone number is required');
                isValid = false;
            } else if (!validatePhone(phone.value)) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Message validation
            const message = document.getElementById('message');
            if (!message.value.trim()) {
                showError('message', 'Message is required');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            if (isValid) {
                // Here you would normally send the data to your server
                // For now, we'll just show the success message
                
                // Hide form and show success message
                contactForm.style.display = 'none';
                successMessage.classList.add('show');
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // In production, you would do something like:
                // submitFormToServer(new FormData(contactForm));
                
                console.log('Form submitted successfully');
            } else {
                // Scroll to first error
                const firstError = document.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        const errorSpan = document.getElementById(fieldId + 'Error');
        
        formGroup.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }
    
    function clearFormErrors() {
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });
    }
    
    // ===================================
    // Products Page Functionality
    // ===================================
    function initProductsPage() {
        // Filter Toggle (Mobile)
        const filterToggle = document.getElementById('filterToggle');
        const filtersWrapper = document.getElementById('filtersWrapper');
        
        if (filterToggle && filtersWrapper) {
            filterToggle.addEventListener('click', () => {
                filtersWrapper.classList.toggle('active');
            });
        }

        // View Toggle (Grid/List)
        const viewBtns = document.querySelectorAll('.view-btn');
        const productsGrid = document.getElementById('productsGrid');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                
                // Update active button
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update grid view
                if (productsGrid) {
                    if (view === 'list') {
                        productsGrid.classList.add('list-view');
                    } else {
                        productsGrid.classList.remove('list-view');
                    }
                }
            });
        });

        // Sort Dropdown
        const sortSelect = document.getElementById('sortProducts');
        
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortValue = e.target.value;
                // In production, this would trigger sorting logic
                console.log('Sorting by:', sortValue);
                
                // You can add actual sorting logic here or trigger an API call
            });
        }

        // Clear Filters Button
        const clearFilters = document.getElementById('clearFilters');
        
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                // Uncheck all filter checkboxes
                const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Reset active classes
                document.querySelectorAll('.filter-option.active').forEach(option => {
                    option.classList.remove('active');
                });
                
                console.log('All filters cleared');
            });
        }

        // Filter Options Click Handler
        const filterOptions = document.querySelectorAll('.filter-option');
        
        filterOptions.forEach(option => {
            const checkbox = option.querySelector('input[type="checkbox"]');
            
            option.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                
                if (checkbox.checked) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
                
                // In production, this would trigger filtering logic
                console.log('Filter changed:', checkbox.name, checkbox.value, checkbox.checked);
            });
        });
    }

    // ===================================
    // Counter Animation (for sustainability metrics)
    // ===================================
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        };

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // ===================================
    // FAQ Accordion
    // ===================================
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    // ===================================
    // Initialize All
    // ===================================
    function init() {
        // Initialize page load animation
        initPageLoadAnimation();
        
        // Initialize event listeners
        initEventListeners();
        
        // Initialize intersection observer for animations
        initObserver();
        
        // Initialize internal link handlers
        handleInternalLinks();
        
        // Initialize lazy loading
        initLazyLoading();
        
        // Initialize cookie consent
        initCookieConsent();
        
        // Initialize analytics
        initAnalytics();
        
        // Initialize contact form (if on contact page)
        initContactForm();
        
        // Initialize FAQ accordion (if on contact page)
        initFAQAccordion();
        
        // Initialize counter animation (if on sustainability page)
        initCounterAnimation();
        
        // Initialize products page (if on products page)
        initProductsPage();
        
        // Initialize gift consultation form (if on gifting page)
        initGiftConsultationForm();
        
        // Initial scroll check
        handleScroll();
        
        console.log('Ecooza website initialized successfully');
    }

    // ===================================
    // DOM Content Loaded
    // ===================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===================================
    // Export functions for external use
    // ===================================
    window.EcoozaApp = {
        validateEmail,
        validatePhone,
        smoothScroll,
        scrollToTop
    };

})();