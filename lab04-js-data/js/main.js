import { loadItems } from './api.js';
import { renderCatalog } from './catalog.js';

let allItems = [];

const elements = {
    catalogContainer: document.getElementById('catalog-container'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    emptyState: document.getElementById('empty-state'),
};

/**
 * Initialize application
 */
async function init() {
    console.log('Initializing catalog application...');
    
    // Check if we are on the page with catalog
    if (elements.catalogContainer) {
        await initCatalog();
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
            renderCatalog(allItems);
        }
    } catch (error) {
        showState('error');
    }
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
