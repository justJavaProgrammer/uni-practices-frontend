/**
 * API module for fetching data
 */

export async function loadItems() {
    // Determine path based on current location (root or /pages/)
    const isSubPage = window.location.pathname.includes('/pages/');
    const DATA_URL = isSubPage ? '../data/items.json' : './data/items.json';
    
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
