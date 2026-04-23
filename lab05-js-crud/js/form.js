import { createItem, getItemById, updateItem } from './api.js';
import { showStatus } from './ui.js';

export async function initForm() {
    const form = document.getElementById('item-form');
    const statusContainer = document.getElementById('form-status');
    const titleHeader = document.getElementById('form-title');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    if (!form) return;

    // Check for ID in URL to determine if we are editing
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');

    if (itemId) {
        titleHeader.textContent = 'Edit Course';
        submitBtn.textContent = 'Update';
        await loadItemData(itemId, form);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm(form)) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Convert numeric values
        data.price = parseFloat(data.price);
        data.rating = parseFloat(data.rating);

        // Mock image path if not present (simplified for now)
        if (!data.image) data.image = 'assets/img/img1.jpg';

        try {
            submitBtn.disabled = true;
            if (itemId) {
                await updateItem(itemId, data);
                showStatus(statusContainer, 'Course updated successfully!');
            } else {
                await createItem(data);
                showStatus(statusContainer, 'Course created successfully!');
                form.reset();
            }
            
            // Redirect back to catalog after success
            setTimeout(() => {
                window.location.href = 'catalog.html';
            }, 1500);
        } catch (error) {
            showStatus(statusContainer, 'Error: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'catalog.html';
    });
}

async function loadItemData(id, form) {
    try {
        const item = await getItemById(id);
        
        // Fill form fields
        form.elements['id'].value = item.id;
        form.elements['title'].value = item.title;
        form.elements['category'].value = item.category;
        form.elements['price'].value = item.price;
        form.elements['rating'].value = item.rating;
        form.elements['level'].value = item.level;
        form.elements['description'].value = item.description;
    } catch (error) {
        alert('Failed to load course data: ' + error.message);
        window.location.href = 'catalog.html';
    }
}

function validateForm(form) {
    let isValid = true;
    const errors = form.querySelectorAll('.error-message');
    errors.forEach(err => err.textContent = '');

    const title = form.elements['title'].value.trim();
    if (title.length < 3) {
        document.getElementById('error-title').textContent = 'Title must be at least 3 characters long.';
        isValid = false;
    }

    const price = parseFloat(form.elements['price'].value);
    if (isNaN(price) || price < 0) {
        document.getElementById('error-price').textContent = 'Price must be a non-negative number.';
        isValid = false;
    }

    const rating = parseFloat(form.elements['rating'].value);
    if (isNaN(rating) || rating < 0 || rating > 5) {
        document.getElementById('error-rating').textContent = 'Rating must be between 0 and 5.';
        isValid = false;
    }

    return isValid;
}
