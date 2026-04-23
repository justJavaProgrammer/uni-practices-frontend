import { getItems, deleteItem } from './api.js';
import { showLoading, showError, showEmpty } from './ui.js';

export async function initCatalog() {
    const catalogContainer = document.getElementById('catalog-container');
    if (!catalogContainer) return;

    await loadAndRenderItems();
}

async function loadAndRenderItems() {
    const catalogContainer = document.getElementById('catalog-container');
    showLoading(catalogContainer);

    try {
        const { items } = await getItems();
        
        if (items.length === 0) {
            showEmpty(catalogContainer);
            return;
        }

        renderItems(items, catalogContainer);
    } catch (error) {
        showError(catalogContainer, error.message);
    }
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

    card.innerHTML = `
        <img src="../${item.image || 'assets/img/img1.jpg'}" alt="${item.title}">
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
            
            const catalogContainer = document.getElementById('catalog-container');
            if (catalogContainer.children.length === 0) {
                showEmpty(catalogContainer);
            }
        } catch (error) {
            alert('Failed to delete item: ' + error.message);
        }
    }
}
