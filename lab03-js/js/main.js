// main.js
document.addEventListener('DOMContentLoaded', init);

function init() {
  console.log('DOM fully loaded and parsed');
  
  initActiveNav();
  initMenuToggle();
  initThemeToggle();
  initBackToTop();
  updateFooterYear();
  initAccordion();
  initFilters();
  initModal();
  initContactForm();
}

/**
 * Task 9.1: Contact form validation and character counter
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const messageInput = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');
    const maxLength = messageInput?.getAttribute('maxlength') || 500;

    // 1. Character counter
    messageInput?.addEventListener('input', () => {
        const currentLength = messageInput.value.length;
        charCounter.textContent = `${currentLength} / ${maxLength}`;
        
        if (currentLength >= maxLength) {
            charCounter.classList.add('limit-reached');
        } else {
            charCounter.classList.remove('limit-reached');
        }
    });

    // 2. Real-time validation
    const validateField = (input, errorElement, validationFn, errorMessage) => {
        const isValid = validationFn(input.value);
        if (!isValid && input.value !== '') {
            input.classList.add('is-invalid');
            errorElement.textContent = errorMessage;
        } else {
            input.classList.remove('is-invalid');
            errorElement.textContent = '';
        }
        return isValid;
    };

    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const agreeInput = document.getElementById('agree');
    const agreeError = document.getElementById('agree-error');

    nameInput?.addEventListener('input', () => {
        validateField(nameInput, nameError, (val) => val.trim().length >= 2, 'Ім’я має містити принаймні 2 символи');
    });

    emailInput?.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(emailInput, emailError, (val) => emailRegex.test(val), 'Введіть коректну адресу email');
    });

    messageInput?.addEventListener('input', () => {
        validateField(messageInput, messageError, (val) => val.trim() !== '', 'Повідомлення не може бути порожнім');
    });

    agreeInput?.addEventListener('change', () => {
        if (agreeInput.checked) {
            agreeError.textContent = '';
        }
    });
}
function initModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const lightboxTriggers = document.querySelectorAll('.js-lightbox');

    if (!modal || !modalContent) return;

    const openModal = (content) => {
        modalContent.innerHTML = content;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        // Clear content after animation
        setTimeout(() => {
            modalContent.innerHTML = '';
        }, 300);
    };

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const imgSrc = trigger.getAttribute('src');
            const imgAlt = trigger.getAttribute('alt');
            openModal(`<img src="${imgSrc}" alt="${imgAlt}">`);
        });
    });

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card[data-category]');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('is-active'));
            button.classList.add('is-active');

            // Filter cards
            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.hidden = false;
                } else {
                    card.hidden = true;
                }
            });
        });
    });
}
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('is-active');

            // Close all other items (optional, but looks cleaner)
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('is-active');
            });

            // Toggle current item
            if (!isActive) {
                currentItem.classList.add('is-active');
            }
        });
    });
}
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
