// main.js
document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('DOM fully loaded and parsed');
  
  initActiveNav();
  initMenuToggle();
  initThemeToggle();
  initBackToTop();
  updateFooterYear();
  // Future initializations will be added here
  // initAccordion();
  // initFilters();
  // initModal();
  // initContactForm();
}

/**
 * Task 5.1: Back to Top button
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Task 5.2: Dynamic year in footer
 */
function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'siteTheme';

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === 'light') {
        body.classList.add('theme-light');
    }

    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('theme-light');
        
        // Save theme preference
        if (body.classList.contains('theme-light')) {
            localStorage.setItem(themeKey, 'light');
        } else {
            localStorage.setItem(themeKey, 'dark');
        }
    });
}
function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    if (!menuToggle || !navList) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('is-open');
    });

    // Close menu when clicking a link (optional but recommended for SPA/smooth-scroll)
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('is-open');
        });
    });
}
function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-list a');
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        // Remove existing active class if any
        link.classList.remove('active', 'is-active');
        
        if (linkPage === currentPage) {
            link.classList.add('is-active');
        }
    });
}
