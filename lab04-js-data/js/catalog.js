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
