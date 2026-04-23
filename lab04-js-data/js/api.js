/**
 * API module for fetching data
 */

export async function loadItems() {
    const DATA_URL = './data/items.json';
    
    try {
        const response = await fetch(DATA_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Could not fetch items:', error);
        throw error;
    }
}
