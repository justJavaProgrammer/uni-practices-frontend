/**
 * Favorites module for managing state in localStorage
 */

const STORAGE_KEY = 'catalog_favorites';

/**
 * Get all favorite IDs from localStorage
 * @returns {Array<number>}
 */
export function getFavorites() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Toggle an item ID in favorites
 * @param {number} id - The item ID
 * @returns {boolean} - True if added, false if removed
 */
export function toggleFavorite(id) {
    const favorites = getFavorites();
    const index = favorites.indexOf(id);
    let added = false;

    if (index === -1) {
        favorites.push(id);
        added = true;
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return added;
}

/**
 * Check if an item is favorited
 * @param {number} id 
 * @returns {boolean}
 */
export function isFavorited(id) {
    return getFavorites().includes(id);
}
