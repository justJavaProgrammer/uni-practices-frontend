import { initCatalog } from './catalog.js';
import { initForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    const path = window.location.pathname;
    
    if (path.includes('catalog.html')) {
        initCatalog();
    } else if (path.includes('item-form.html')) {
        initForm();
    }
});
