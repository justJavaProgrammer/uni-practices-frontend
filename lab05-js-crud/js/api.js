const API_URL = 'http://localhost:3000/items';

export async function getItems(queryString = '') {
    // In json-server v1+, pagination uses _page and _per_page instead of _limit
    // We adjust it here for compatibility if the original params were v0 style
    let adjustedQuery = queryString
        .replace('_limit=', '_per_page=')
        .replace('_order=', '_sort=') // v1 uses _sort=-field for desc

    const url = adjustedQuery ? `${API_URL}?${adjustedQuery}` : API_URL;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch items');
    }
    
    const data = await response.json();
    
    // json-server v1 returns { data: [], items: 10, ... } for paginated results
    // json-server v0 returns [] and total count in header
    let items = [];
    let totalCount = 0;

    if (Array.isArray(data)) {
        items = data;
        const totalCountHeader = response.headers.get('X-Total-Count');
        totalCount = totalCountHeader ? parseInt(totalCountHeader) : items.length;
    } else if (data.data && Array.isArray(data.data)) {
        items = data.data;
        totalCount = data.items || items.length;
    } else {
        // Fallback for any other structure
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
