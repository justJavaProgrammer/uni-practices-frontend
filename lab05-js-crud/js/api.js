const API_URL = 'http://localhost:3000/items';

export async function getItems(queryString = '') {
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch items');
    }
    
    const data = await response.json();
    
    let items = [];
    let totalCount = 0;

    // Handle json-server v1 (paginated)
    if (data.data && Array.isArray(data.data)) {
        items = data.data;
        totalCount = data.items || items.length;
    } 
    // Handle json-server v0 or non-paginated v1
    else if (Array.isArray(data)) {
        items = data;
        const totalCountHeader = response.headers.get('X-Total-Count');
        totalCount = totalCountHeader ? parseInt(totalCountHeader) : items.length;
    } else {
        items = data ? [data] : [];
        totalCount = items.length;
    }
    
    return { items, totalCount };
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
