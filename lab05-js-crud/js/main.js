import { initCatalog } from './catalog.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    const path = window.location.pathname;
    
    if (path.includes('catalog.html')) {
        initCatalog();
    }
});
