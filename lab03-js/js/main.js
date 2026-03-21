// main.js
document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('DOM fully loaded and parsed');
  
  initActiveNav();
  // Future initializations will be added here
  // initMenuToggle();
  // initThemeToggle();
  // initBackToTop();
  // initAccordion();
  // initFilters();
  // initModal();
  // initContactForm();
}

/**
 * Task 2: Highlight active page in navigation
 */
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
