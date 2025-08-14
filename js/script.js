// Main JavaScript functionality for Jeevan Blood Donation Website

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeTabs();
    initializeForms();
    initializeServiceCards();
    initializeAnimations();
    initializeScrollEffects();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const loginBtn = document.querySelector('.login-btn');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Login button functionality
    loginBtn.addEventListener('click', function() {
        showAlert('Login functionality will be implemented soon!', 'info');
    });
}

// Tab functionality for mission/vision/strategy
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Form handling
function initializeForms() {
    const donationForm = document.getElementById('donationForm');
    const subscribeForm = document.getElementById('subscribeForm');
    const searchBtn = document.querySelector('.search-btn');

    // Donation form submission
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleDonationFormSubmission(this);
        });
    }

    // Subscribe form submission
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSubscribeFormSubmission(this);
        });
    }

    // Search functionality
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchInput = document.querySelector('.search-input');
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                handleSearch(searchTerm);
            } else {
                showAlert('Please enter a search term', 'error');
            }
        });
    }
}

// Handle donation form submission
function handleDonationFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!validateDonationForm(data)) {
        return;
    }
    
    // Simulate form submission
    showAlert('Thank you for registering! We will contact you soon.', 'success');
    form.reset();
    
    // Here you would typically send data to server
    console.log('Donation form data:', data);
}

// Handle subscribe form submission
function handleSubscribeFormSubmission(form) {
    const email = form.querySelector('.subscribe-input').value;
    
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    showAlert('Successfully subscribed to newsletter!', 'success');
    form.reset();
    
    console.log('Subscribed email:', email);
}

// Handle search functionality
function handleSearch(searchTerm) {
    showAlert(`Searching for: "${searchTerm}"... This feature will be implemented soon!`, 'info');
    console.log('Search term:', searchTerm);
}

// Form validation functions
function validateDonationForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        showAlert('Please enter a valid name', 'error');
        return false;
    }
    
    if (!data.gender) {
        showAlert('Please select your gender', 'error');
        return false;
    }
    
    if (!data.bloodGroup) {
        showAlert('Please select your blood group', 'error');
        return false;
    }
    
    if (!data.location || data.location.trim().length < 2) {
        showAlert('Please enter your location', 'error');
        return false;
    }
    
    if (!data.role) {
        showAlert('Please select if you are a donor or acceptor', 'error');
        return false;
    }
    
    if (!validatePhone(data.phone)) {
        showAlert('Please enter a valid 10-digit phone number', 'error');
        return false;
    }
    
    if (!validateEmail(data.email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Service cards functionality
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            handleServiceCardClick(service);
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function handleServiceCardClick(service) {
    switch(service) {
        case 'looking':
            showAlert('Redirecting to blood search page...', 'info');
            break;
        case 'donate':
            // Scroll to donation form
            document.querySelector('.donation-form').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            break;
        case 'appointment':
            showAlert('Appointment booking will be available soon!', 'info');
            break;
        case 'nearby':
            showAlert('Finding nearby blood drives...', 'info');
            break;
    }
}

// Animation and scroll effects
function initializeAnimations() {
    // Animate statistics on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const suffix = element.textContent.replace(/[\d,]/g, '');
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 20);
}

// Scroll effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    });
}

// Utility function to show alerts
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    
    // Insert at top of page
    document.body.insertBefore(alert, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
    
    // Make alert clickable to dismiss
    alert.addEventListener('click', () => {
        alert.remove();
    });
}

// Share story functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('share-story-btn')) {
        showAlert('Story sharing form will open soon! Thank you for your interest.', 'success');
    }
});

// Blood compatibility hover effects
document.addEventListener('DOMContentLoaded', function() {
    const bloodCells = document.querySelectorAll('.blood-cell.compatible');
    
    bloodCells.forEach(cell => {
        cell.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        cell.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Mobile menu functionality (if needed)
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// Emergency contact functionality
function handleEmergency() {
    const emergencyMessage = `
        🚨 EMERGENCY BLOOD NEEDED 🚨
        
        If this is a medical emergency, please:
        1. Call 112 (Emergency Services)
        2. Contact nearest hospital directly
        3. Use our emergency hotline: 000 1234 56789
        
        For urgent blood requirements:
        - Fill the donation form with "URGENT" in location field
        - Call our 24/7 helpline
        - Visit nearest blood bank
    `;
    
    alert(emergencyMessage);
}

// Add emergency button functionality if exists
document.addEventListener('click', function(e) {
    if (e.target.closest('[href="#emergency"]')) {
        e.preventDefault();
        handleEmergency();
    }
});

// Form input enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            this.value = value;
        });
    });
    
    // Email validation on blur
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = '#dc3545';
                showAlert('Please enter a valid email address', 'error');
            } else {
                this.style.borderColor = '#e0e0e0';
            }
        });
    });
});

// Prevent form submission on Enter key in search
document.addEventListener('keypress', function(e) {
    if (e.target.classList.contains('search-input') && e.key === 'Enter') {
        e.preventDefault();
        document.querySelector('.search-btn').click();
    }
});

// Console welcome message
console.log(`
🩸 Welcome to Jeevan - Blood Donation Platform
==================================================
Thank you for visiting our platform!
Your contribution can save lives.

For developers:
- This website is built with vanilla HTML, CSS, and JavaScript
- All animations and interactions are optimized for performance
- Forms include validation and user feedback
- Responsive design works across all devices

Need help? Contact: jeevaninfo@mail.com
`);