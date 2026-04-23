import { loadItems } from './api.js';
import { renderCatalog, filterAndSortItems } from './catalog.js';

let allItems = [];

const elements = {
    catalogContainer: document.getElementById('catalog-container'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    emptyState: document.getElementById('empty-state'),
    searchInput: document.getElementById('catalog-search'),
    categoryFilter: document.getElementById('category-filter'),
    sortSelect: document.getElementById('sort-select'),
};

/**
 * Initialize application
 */
async function init() {
    console.log('Initializing catalog application...');
    
    // Check if we are on the page with catalog
    if (elements.catalogContainer) {
        await initCatalog();
        initCatalogControls();
    }
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
            updateCatalog();
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

    elements.searchInput.addEventListener('input', updateCatalog);
    elements.categoryFilter.addEventListener('change', updateCatalog);
    elements.sortSelect.addEventListener('change', updateCatalog);
}

/**
 * Update catalog based on current search, filter, and sort values
 */
function updateCatalog() {
    const criteria = {
        search: elements.searchInput.value,
        category: elements.categoryFilter.value,
        sortBy: elements.sortSelect.value,
    };

    const filteredItems = filterAndSortItems(allItems, criteria);
    renderCatalog(filteredItems);
}

/**
 * Toggle visibility of status messages
 * @param {string} state - 'loading', 'error', 'empty', or 'success'
 */
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

// Start application
document.addEventListener('DOMContentLoaded', init);
