/**
 * Catalog module for rendering and managing items
 */

/**
 * Render all items into the catalog container
 * @param {Array} items - Array of course objects
 */
export function renderCatalog(items) {
    const container = document.getElementById('catalog-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (!items || items.length === 0) {
        document.getElementById('empty-state').classList.remove('is-hidden');
        return;
    }

    document.getElementById('empty-state').classList.add('is-hidden');

    const fragment = document.createDocumentFragment();
    
    items.forEach(item => {
        const card = createCourseCard(item);
        fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
}

/**
 * Filter and sort items based on user criteria
 * @param {Array} items - Original array of items
 * @param {Object} criteria - Search, category, and sort criteria
 * @returns {Array} - Filtered and sorted array
 */
export function filterAndSortItems(items, { search, category, sortBy }) {
    let result = [...items];

    // Filter by search
    if (search) {
        const query = search.toLowerCase();
        result = result.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );
    }

    // Filter by category
    if (category && category !== 'all') {
        result = result.filter(item => item.category === category);
    }

    // Sort items
    if (sortBy && sortBy !== 'default') {
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'title-asc':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }

    return result;
}

/**
 * Create a single course card element
 * @param {Object} item - Course object
 * @returns {HTMLElement} - The card element
 */
function createCourseCard(item) {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-category', item.category);

    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="course-image">
        <div class="course-content">
            <span class="course-category">${item.category}</span>
            <h3 class="course-title">${item.title}</h3>
            <p class="course-description">${item.description}</p>
            <div class="course-footer">
                <span class="course-price">$${item.price}</span>
                <div class="course-actions">
                    <button class="btn btn-secondary btn-fav" title="Додати в обране">
                        <span class="heart-icon">❤</span>
                    </button>
                    <button class="btn btn-primary btn-details">Деталі</button>
                </div>
            </div>
        </div>
    `;

    return card;
}
