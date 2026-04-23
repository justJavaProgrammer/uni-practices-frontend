import { getItems, deleteItem } from './api.js';
import { showLoading, showError, showEmpty, showStatus } from './ui.js';

let currentParams = {
    title_like: '', // Using title_like for more reliable search in json-server
    category: '',
    _sort: 'id',
    _page: 1,
    _per_page: 6
};

export async function initCatalog() {
    console.log('Catalog initialization started');
    const catalogContainer = document.getElementById('catalog-container');
    if (!catalogContainer) return;

    setupFilters();
    await loadAndRenderItems();
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(async (e) => {
            currentParams.title_like = e.target.value;
            currentParams._page = 1;
            await loadAndRenderItems();
        }, 500));
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', async (e) => {
            currentParams.category = e.target.value === 'all' ? '' : e.target.value;
            currentParams._page = 1;
            await loadAndRenderItems();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', async (e) => {
            const value = e.target.value;
            if (value === 'id-asc') currentParams._sort = 'id';
            else if (value === 'id-desc') currentParams._sort = '-id';
            else if (value === 'price-asc') currentParams._sort = 'price';
            else if (value === 'price-desc') currentParams._sort = '-price';
            else if (value === 'rating-desc') currentParams._sort = '-rating';
            
            currentParams._page = 1;
            await loadAndRenderItems();
        });
    }
}

async function loadAndRenderItems() {
    const catalogContainer = document.getElementById('catalog-container');
    showLoading(catalogContainer);

    try {
        const queryString = buildQueryString(currentParams);
        console.log('Fetching items with query:', queryString);
        const { items, totalCount } = await getItems(queryString);
        
        console.log('Processed items count:', items.length);
        
        if (items.length === 0) {
            showEmpty(catalogContainer);
            renderPagination(0);
            return;
        }

        renderItems(items, catalogContainer);
        renderPagination(totalCount);
    } catch (error) {
        console.error('Failed to load items:', error);
        showError(catalogContainer, error.message);
    }
}

function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            searchParams.set(key, params[key]);
        }
    }
    return searchParams.toString();
}

function renderItems(items, container) {
    container.innerHTML = '';
    items.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.id;

    const imagePath = item.image ? `../${item.image}` : '../assets/img/img1.jpg';

    card.innerHTML = `
        <img src="${imagePath}" alt="${item.title}" onerror="this.src='../assets/img/img1.jpg'">
        <div class="card-content">
            <span class="card-category">${item.category}</span>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-price">$${item.price}</p>
            <p class="card-rating">Rating: ${item.rating} | Level: ${item.level}</p>
        </div>
        <div class="card-actions">
            <a href="item-form.html?id=${item.id}" class="btn btn-primary edit-btn">Edit</a>
            <button class="btn btn-danger delete-btn">Delete</button>
        </div>
    `;

    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => handleDelete(item.id, card));

    return card;
}

async function handleDelete(id, cardElement) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await deleteItem(id);
            cardElement.remove();
            
            const statusContainer = document.getElementById('catalog-status');
            if (statusContainer) {
                showStatus(statusContainer, 'Course deleted successfully!');
            }
            
            const catalogContainer = document.getElementById('catalog-container');
            if (catalogContainer.children.length === 0) {
                await loadAndRenderItems();
            }
        } catch (error) {
            alert('Failed to delete item: ' + error.message);
        }
    }
}

function renderPagination(totalCount) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalCount / currentParams._per_page);
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `page-btn ${i === currentParams._page ? 'active' : ''}`;
        btn.addEventListener('click', async () => {
            currentParams._page = i;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            await loadAndRenderItems();
        });
        paginationContainer.appendChild(btn);
    }
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
