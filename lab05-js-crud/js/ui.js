export function showLoading(container) {
    container.innerHTML = '<div class="loading">Loading...</div>';
}

export function showError(container, message) {
    container.innerHTML = `
        <div class="error-state">
            <p>Error: ${message}</p>
            <button class="btn" onclick="location.reload()">Retry</button>
        </div>
    `;
}

export function showEmpty(container) {
    container.innerHTML = '<div class="empty-state">No items found.</div>';
}

export function showStatus(container, message, type = 'success') {
    container.textContent = message;
    container.className = `status-message status-${type}`;
    setTimeout(() => {
        container.textContent = '';
        container.className = 'status-message';
    }, 3000);
}
