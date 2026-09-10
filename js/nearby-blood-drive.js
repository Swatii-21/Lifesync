 // Main JavaScript functionality for Jeevan Blood Donation Website

const API_BASE = 'https://bloodsync-9g0v.onrender.com/api'; // change this when you deploy the backend

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeTabs();
    initializeForms();
    initializeServiceCards();
    initializeAnimations();
    initializeScrollEffects();
    initializeLiveStats();
    initializeCompatibilityCalculator();
    initializeEligibilityChecker();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
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
async function handleDonationFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!validateDonationForm(data)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/donors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            showAlert(result.message || 'Something went wrong. Please try again.', 'error');
            return;
        }

        showAlert('Thank you for registering! We will contact you soon.', 'success');
        form.reset();
    } catch (err) {
        console.error('Donation form submission failed:', err);
        showAlert('Could not reach the server. Please try again later.', 'error');
    }
}

// Handle subscribe form submission
async function handleSubscribeFormSubmission(form) {
    const email = form.querySelector('.subscribe-input').value;

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
            showAlert(result.message || 'Subscription failed. Please try again.', 'error');
            return;
        }

        showAlert(result.message || 'Successfully subscribed to newsletter!', 'success');
        form.reset();
    } catch (err) {
        console.error('Subscribe failed:', err);
        showAlert('Could not reach the server. Please try again later.', 'error');
    }
}

// Handle search functionality
async function handleSearch(searchTerm) {
    const resultsContainer = document.getElementById('searchResults');

    try {
        const response = await fetch(`${API_BASE}/donors/search?q=${encodeURIComponent(searchTerm)}`);
        const result = await response.json();

        if (!response.ok) {
            showAlert(result.message || 'Search failed. Please try again.', 'error');
            return;
        }

        renderSearchResults(result.results, resultsContainer);
    } catch (err) {
        console.error('Search failed:', err);
        showAlert('Could not reach the server. Please try again later.', 'error');
    }
}

// Render the list of matched donors/acceptors into the search box
function renderSearchResults(results, container) {
    if (!container) return;

    if (!results || results.length === 0) {
        container.innerHTML = '<div class="search-result-empty">No matches found. Try a different name, city, or blood group.</div>';
        return;
    }

    container.innerHTML = results
        .map(
            (person) => `
                <div class="search-result-item">
                    <div class="search-result-info">
                        <strong>${escapeHtml(person.name)}</strong>
                        <span>${escapeHtml(person.location)} • ${person.role === 'donor' ? 'Donor' : 'Acceptor'}</span>
                    </div>
                    <div class="search-result-badge">${escapeHtml(person.bloodGroup)}</div>
                </div>
            `
        )
        .join('');
}

// Basic escaping so donor-submitted text can't break the HTML
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
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
            window.location.href = 'looking-for-blood.html';
            break;
        case 'donate':
            // Scroll to donation form
            document.querySelector('.donation-form').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            break;
        case 'appointment':
            window.location.href = 'appointment.html';
            break;
        case 'nearby':
            window.location.href = 'nearby-blood-drive.html';
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

// ============================================================
// FEATURE: Live Stats (pulls real numbers from the backend)
// ============================================================
async function initializeLiveStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        if (!response.ok) return; // fail silently, keep the hardcoded placeholder numbers

        const stats = await response.json();

        setStatIfPresent('statLivesSaved', stats.livesSaved);
        setStatIfPresent('statUnitsDonated', stats.bloodUnitsDonated);
        setStatIfPresent('statActiveDonors', stats.activeDonors);
        setStatIfPresent('statPartnerHospitals', stats.partnerHospitals);
    } catch (err) {
        console.error('Could not load live stats, showing defaults:', err);
    }
}

function setStatIfPresent(elementId, value) {
    const el = document.getElementById(elementId);
    if (el && typeof value === 'number') {
        el.textContent = value.toLocaleString() + '+';
    }
}

// ============================================================
// FEATURE: Interactive Blood Compatibility Calculator
// ============================================================
const COMPATIBLE_DONORS_FOR = {
    'O+': ['O+', 'O-'],
    'O-': ['O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
};

function initializeCompatibilityCalculator() {
    const selector = document.getElementById('compatSelector');
    const resultEl = document.getElementById('compatResult');
    const grid = document.getElementById('bloodGrid');

    if (!selector || !grid) return;

    selector.addEventListener('change', function() {
        const recipient = this.value;

        // Reset all rows/cells
        grid.querySelectorAll('.blood-row').forEach(row => row.style.opacity = '1');
        grid.querySelectorAll('.blood-cell').forEach(cell => cell.classList.remove('row-highlight', 'dimmed'));

        if (!recipient) {
            if (resultEl) resultEl.textContent = '';
            return;
        }

        // Dim all rows except the selected one, and highlight the selected row's cells
        grid.querySelectorAll('.blood-row').forEach(row => {
            if (row.getAttribute('data-recipient') === recipient) {
                row.querySelectorAll('.blood-cell').forEach(cell => cell.classList.add('row-highlight'));
            } else {
                row.querySelectorAll('.blood-cell').forEach(cell => cell.classList.add('dimmed'));
            }
        });

        const compatibleGroups = COMPATIBLE_DONORS_FOR[recipient] || [];
        if (resultEl) {
            resultEl.textContent = `As a ${recipient} recipient, you can receive blood from: ${compatibleGroups.join(', ')}.`;
        }
    });
}

// ============================================================
// FEATURE: Donor Eligibility Checker
// ============================================================
function initializeEligibilityChecker() {
    const form = document.getElementById('eligibilityForm');
    const resultEl = document.getElementById('eligibilityResult');

    if (!form || !resultEl) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const age = parseInt(document.getElementById('eligAge').value, 10);
        const weight = parseFloat(document.getElementById('eligWeight').value);
        const lastDonationValue = document.getElementById('eligLastDonation').value;
        const hasHealthIssue = document.getElementById('eligHealth').value === 'yes';

        const reasons = [];

        if (age < 18 || age > 65) {
            reasons.push('Donors must be between 18 and 65 years old.');
        }
        if (weight < 50) {
            reasons.push('Donors must weigh at least 50 kg.');
        }
        if (hasHealthIssue) {
            reasons.push('Please wait until you have fully recovered before donating.');
        }
        if (lastDonationValue) {
            const lastDonation = new Date(lastDonationValue);
            const daysSince = Math.floor((new Date() - lastDonation) / (1000 * 60 * 60 * 24));
            if (daysSince < 90) {
                reasons.push(`You must wait at least 90 days between donations (${90 - daysSince} day(s) remaining).`);
            }
        }

        resultEl.classList.remove('eligible', 'not-eligible');

        if (reasons.length === 0) {
            resultEl.classList.add('eligible');
            resultEl.textContent = '✅ You appear to be eligible to donate blood today! Please still get a final check-up at the donation center.';
        } else {
            resultEl.classList.add('not-eligible');
            resultEl.innerHTML = '❌ You may not be eligible to donate right now:<br>• ' + reasons.join('<br>• ');
        }
    });
}