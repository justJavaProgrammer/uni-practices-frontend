const API_URL = 'http://localhost:3000/items';

export async function getItems(queryString = '') {
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch items');
    }
    
    // Total count from json-server header
    const totalCount = response.headers.get('X-Total-Count');
    const items = await response.json();
    
    return { items, totalCount: parseInt(totalCount) || items.length };
}

export async function getItemById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch item with ID ${id}`);
    }
    
    return await response.json();
}

export async function createItem(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create new item');
    }
    
    return await response.json();
}

export async function updateItem(id, data) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to update item with ID ${id}`);
    }
    
    return await response.json();
}

export async function deleteItem(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error(`Failed to delete item with ID ${id}`);
    }
}
