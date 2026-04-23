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
 * @param {boolean} resetCount - Whether to reset visible items count to initial
 */
function updateCatalog(resetCount = false) {
    if (resetCount) {
        visibleCount = ITEMS_PER_PAGE;
    }

    const criteria = {
        search: elements.searchInput.value,
        category: elements.categoryFilter.value,
        sortBy: elements.sortSelect.value,
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
    if (!elements.showMoreBtn) return;
    
    if (filteredItems.length > visibleCount) {
        elements.showMoreBtn.classList.remove('is-hidden');
    } else {
        elements.showMoreBtn.classList.add('is-hidden');
    }
}

function showState(state) {
    elements.loadingState.classList.add('is-hidden');
    elements.errorState.classList.add('is-hidden');
    elements.emptyState.classList.add('is-hidden');
    
    if (state === 'loading') {
        elements.loadingState.classList.remove('is-hidden');
    } else if (state === 'error') {
        elements.errorState.classList.remove('is-hidden');
    } else if (state === 'empty') {
        elements.emptyState.classList.remove('is-hidden');
    }
}

/**
 * Show item details in modal
 */
function showItemDetails(id) {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    elements.modalContent.innerHTML = `
        <div class="modal-details">
            <img src="${item.image}" alt="${item.title}" class="modal-image">
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
    elements.modal.classList.add('is-open');
    elements.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeModal() {
    elements.modal.classList.remove('is-open');
    elements.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function initModalEvents() {
    if (!elements.modalClose) return;

    elements.modalClose.addEventListener('click', closeModal);
    elements.modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal.classList.contains('is-open')) {
            closeModal();
        }
    });
}

function initLightbox() {
    const lightboxTriggers = document.querySelectorAll('.js-lightbox');
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

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    // ... logic from Lab 03 could be fully integrated here if needed
}

// Start application
document.addEventListener('DOMContentLoaded', init);
