import { loadItems } from './api.js';
import { renderCatalog, filterAndSortItems } from './catalog.js';
import { toggleFavorite } from './favorites.js';

let allItems = [];
let filteredItems = [];
let visibleCount = 6;
const ITEMS_PER_PAGE = 6;

const elements = {
    catalogContainer: document.getElementById('catalog-container'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    emptyState: document.getElementById('empty-state'),
    searchInput: document.getElementById('catalog-search'),
    categoryFilter: document.getElementById('category-filter'),
    sortSelect: document.getElementById('sort-select'),
    showMoreBtn: document.getElementById('show-more-btn'),
    modal: document.getElementById('modal'),
    modalContent: document.getElementById('modal-content'),
    modalClose: document.getElementById('modal-close'),
    modalOverlay: document.getElementById('modal-overlay'),
};

/**
 * Initialize application
 */
async function init() {
    console.log('Initializing application...');
    
    // Core UI (from Lab 03)
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    updateFooterYear();
    initAccordion();
    initContactForm();
    initStaticFilters(); // Original filters for index.html

    // Catalog Logic (Lab 04)
    if (elements.catalogContainer) {
        await initCatalog();
        initCatalogControls();
    }
    
    // General Modal setup
    initModalEvents();
    initLightbox();
}

/**
 * Initialize catalog page
 */
async function initCatalog() {
    try {
        showState('loading');
        
        allItems = await loadItems();
        
        if (!allItems || allItems.length === 0) {
            showState('empty');
        } else {
            showState('success');
            updateCatalog(true);
        }
    } catch (error) {
        showState('error');
    }
}

/**
 * Initialize catalog controls (search, filter, sort)
 */
function initCatalogControls() {
    if (!elements.searchInput) return;

    elements.searchInput.addEventListener('input', () => updateCatalog(true));
    elements.categoryFilter.addEventListener('change', () => updateCatalog(true));
    elements.sortSelect.addEventListener('change', () => updateCatalog(true));
    
    if (elements.showMoreBtn) {
        elements.showMoreBtn.addEventListener('click', handleShowMore);
    }

    // Event delegation for favorites and details
    elements.catalogContainer.addEventListener('click', (e) => {
        const favBtn = e.target.closest('.btn-fav');
        if (favBtn) {
            const card = favBtn.closest('.course-card');
            const id = parseInt(card.getAttribute('data-id'));
            
            toggleFavorite(id);
            favBtn.classList.toggle('is-active');
            return;
        }

        const detailsBtn = e.target.closest('.btn-details');
        if (detailsBtn) {
            const card = detailsBtn.closest('.course-card');
            const id = parseInt(card.getAttribute('data-id'));
            showItemDetails(id);
        }
    });
}

/**
 * Update catalog based on current search, filter, and sort values
 */
function updateCatalog(resetCount = false) {
    if (resetCount) {
        visibleCount = ITEMS_PER_PAGE;
    }

    // Defensive check for controls
    const criteria = {
        search: elements.searchInput ? elements.searchInput.value : '',
        category: elements.categoryFilter ? elements.categoryFilter.value : 'all',
        sortBy: elements.sortSelect ? elements.sortSelect.value : 'default',
    };

    filteredItems = filterAndSortItems(allItems, criteria);
    
    const itemsToRender = filteredItems.slice(0, visibleCount);
    renderCatalog(itemsToRender);
    
    updateShowMoreButton();
}

function handleShowMore() {
    visibleCount += ITEMS_PER_PAGE;
    updateCatalog();
}

function updateShowMoreButton() {
    const paginationContainer = document.querySelector('.pagination-container');
    if (!elements.showMoreBtn || !paginationContainer) return;
    
    if (filteredItems.length > visibleCount) {
        elements.showMoreBtn.classList.remove('is-hidden');
        paginationContainer.classList.remove('is-hidden');
    } else {
        elements.showMoreBtn.classList.add('is-hidden');
        paginationContainer.classList.add('is-hidden');
    }
}

function showState(state) {
    const statusContainer = document.getElementById('catalog-status');
    if (!elements.loadingState || !statusContainer) return;
    
    elements.loadingState.classList.add('is-hidden');
    elements.errorState.classList.add('is-hidden');
    elements.emptyState.classList.add('is-hidden');
    statusContainer.classList.add('is-hidden');
    
    if (state === 'loading') {
        elements.loadingState.classList.remove('is-hidden');
        statusContainer.classList.remove('is-hidden');
    } else if (state === 'error') {
        elements.errorState.classList.remove('is-hidden');
        statusContainer.classList.remove('is-hidden');
    } else if (state === 'empty') {
        elements.emptyState.classList.remove('is-hidden');
        statusContainer.classList.remove('is-hidden');
    }
}

/**
 * Show item details in modal
 */
function showItemDetails(id) {
    const item = allItems.find(i => i.id === id);
    if (!item || !elements.modalContent) return;

    // Adjust image path for subpages
    const isSubPage = window.location.pathname.includes('/pages/');
    const imagePath = isSubPage ? `../${item.image}` : item.image;

    elements.modalContent.innerHTML = `
        <div class="modal-details">
            <img src="${imagePath}" alt="${item.title}" class="modal-image">
            <div class="modal-info">
                <span class="course-category">${item.category}</span>
                <h2 class="modal-title">${item.title}</h2>
                <div class="modal-meta">
                    <span class="meta-item"><strong>Рівень:</strong> ${item.level}</span>
                    <span class="meta-item"><strong>Рейтинг:</strong> ⭐ ${item.rating}</span>
                </div>
                <p class="modal-description">${item.description}</p>
                <div class="modal-footer">
                    <span class="modal-price">$${item.price}</span>
                    <button class="btn btn-primary" onclick="alert('Дякуємо за покупку!')">Записатися на курс</button>
                </div>
            </div>
        </div>
    `;

    openModal();
}

function openModal() {
    if (!elements.modal) return;
    elements.modal.classList.add('is-open');
    elements.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeModal() {
    if (!elements.modal) return;
    elements.modal.classList.remove('is-open');
    elements.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function initModalEvents() {
    if (!elements.modalClose) return;

    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal && elements.modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

function initLightbox() {
    const lightboxTriggers = document.querySelectorAll('.js-lightbox');
    if (lightboxTriggers.length === 0 || !elements.modalContent) return;
    
    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const imgSrc = trigger.getAttribute('src');
            const imgAlt = trigger.getAttribute('alt');
            elements.modalContent.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}" style="max-width:100%; height:auto;">`;
            openModal();
        });
    });
}

// --- Lab 03 Legacy Functions ---

function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-list a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        link.classList.remove('is-active');
        if (linkPage === currentPage) {
            link.classList.add('is-active');
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
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeKey = 'siteTheme';

    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === 'light') body.classList.add('theme-light');

    if (!themeToggle) return;
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('theme-light');
        localStorage.setItem(themeKey, body.classList.contains('theme-light') ? 'light' : 'dark');
    });
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) btn.classList.add('is-visible');
        else btn.classList.remove('is-visible');
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function updateFooterYear() {
    const span = document.getElementById('current-year');
    if (span) span.textContent = new Date().getFullYear();
}

function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('is-active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('is-active'));
            if (!isActive) item.classList.add('is-active');
        });
    });
}

function initStaticFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card[data-category]');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('is-active'));
            button.classList.add('is-active');

            cards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const successBlock = document.getElementById('contact-success');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    const charCounter = document.getElementById('char-counter');
    const agreeInput = document.getElementById('agree');
    const agreeError = document.getElementById('agree-error');
    const maxLength = messageInput?.getAttribute('maxlength') || 500;

    const draftKey = 'contactDraft';

    const savedDraft = JSON.parse(localStorage.getItem(draftKey) || '{}');
    if (savedDraft.name && nameInput) nameInput.value = savedDraft.name;
    if (savedDraft.email && emailInput) emailInput.value = savedDraft.email;
    if (savedDraft.message && messageInput) {
        messageInput.value = savedDraft.message;
        updateCharCounter();
    }

    const saveDraft = () => {
        const draft = {
            name: nameInput?.value,
            email: emailInput?.value,
            message: messageInput?.value
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
    };

    function updateCharCounter() {
        if (!messageInput || !charCounter) return;
        const currentLength = messageInput.value.length;
        charCounter.textContent = `${currentLength} / ${maxLength}`;
        if (currentLength >= maxLength) charCounter.classList.add('limit-reached');
        else charCounter.classList.remove('limit-reached');
    }

    messageInput?.addEventListener('input', () => {
        updateCharCounter();
        saveDraft();
    });

    nameInput?.addEventListener('input', () => {
        validateField(nameInput, nameError, (val) => val.trim().length >= 2, 'Ім’я має містити принаймні 2 символи');
        saveDraft();
    });

    emailInput?.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(emailInput, emailError, (val) => emailRegex.test(val), 'Введіть коректну адресу email');
        saveDraft();
    });

    const validateField = (input, errorElement, validationFn, errorMessage, forceShow = false) => {
        if (!input || !errorElement) return true;
        const isValid = validationFn(input.value);
        if (!isValid && (input.value !== '' || forceShow)) {
            input.classList.add('is-invalid');
            errorElement.textContent = errorMessage;
        } else {
            input.classList.remove('is-invalid');
            errorElement.textContent = '';
        }
        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isNameValid = validateField(nameInput, nameError, (val) => val.trim().length >= 2, 'Ім’я обов’язкове (мін. 2 символи)', true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = validateField(emailInput, emailError, (val) => emailRegex.test(val), 'Введіть коректну адресу email', true);
        const isMessageValid = validateField(messageInput, messageError, (val) => val.trim() !== '', 'Повідомлення не може бути порожнім', true);
        
        if (agreeInput && !agreeInput.checked) agreeError.textContent = 'Ви повинні погодитися з умовами';
        else if (agreeError) agreeError.textContent = '';

        if (isNameValid && isEmailValid && isMessageValid && (!agreeInput || agreeInput.checked)) {
            const topicSelect = document.getElementById('topic');
            const topicText = topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : '';

            const successDataList = document.getElementById('success-data');
            if (successDataList) {
                successDataList.innerHTML = `
                    <li><strong>Email:</strong> ${emailInput.value}</li>
                    <li><strong>Тема:</strong> ${topicText}</li>
                    <li><strong>Повідомлення:</strong> ${messageInput.value}</li>
                `;
            }

            if (document.getElementById('success-name')) document.getElementById('success-name').textContent = nameInput.value;
            form.hidden = true;
            if (successBlock) {
                successBlock.hidden = false;
                successBlock.scrollIntoView({ behavior: 'smooth' });
            }
            localStorage.removeItem(draftKey);
            form.reset();
            updateCharCounter();
        }
    });

    document.getElementById('success-close')?.addEventListener('click', () => {
        if (successBlock) successBlock.hidden = true;
        form.hidden = false;
    });
}

// Start application
document.addEventListener('DOMContentLoaded', init);
