
/**
 * UI Utilities for custom Toast notifications and confirmation modals.
 */

/**
 * Initializes required UI containers for toasts and modals if they don't exist.
 * This is called internally by showToast and showConfirm.
 */
function initUI() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    if (!document.getElementById('prompt-modal')) {
        const modal = document.createElement('div');
        modal.id = 'prompt-modal';
        modal.innerHTML = `
            <div class="prompt-card animate-fade">
                <i id="prompt-icon" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <h3 id="prompt-title" style="margin-bottom: 0.5rem;">Confirm Action</h3>
                <p id="prompt-message" style="color: var(--text-muted); margin-bottom: 2rem;"></p>
                <div style="display: flex; gap: 1rem;">
                    <button id="prompt-cancel" class="btn btn-outline" style="flex: 1;">Cancel</button>
                    <button id="prompt-confirm" class="btn btn-primary" style="flex: 1;">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

/**
 * Displays a non-intrusive toast notification.
 * @param {string} message - The text to display.
 * @param {string} type - Notification style ('success', 'error', 'info').
 */
export function showToast(message, type = 'info') {
    initUI();
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div style="font-weight: 500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Displays a blocking confirmation modal and returns the user's choice.
 * @param {string} title - Modal heading.
 * @param {string} message - Description of the action requiring confirmation.
 * @param {string} type - Visual indicator ('warning', 'danger', 'info').
 * @returns {Promise<boolean>} - True if confirmed, false otherwise.
 */
export function showConfirm(title, message, type = 'info') {
    initUI();
    const modal = document.getElementById('prompt-modal');
    const titleEl = document.getElementById('prompt-title');
    const msgEl = document.getElementById('prompt-message');
    const iconEl = document.getElementById('prompt-icon');
    const confirmBtn = document.getElementById('prompt-confirm');
    const cancelBtn = document.getElementById('prompt-cancel');

    titleEl.textContent = title;
    msgEl.textContent = message;

    // Set icon & colors based on type
    if (type === 'danger') {
        iconEl.className = 'fas fa-exclamation-triangle';
        iconEl.style.color = 'var(--danger)';
        confirmBtn.style.background = 'var(--danger)';
    } else if (type === 'warning') {
        iconEl.className = 'fas fa-exclamation-circle';
        iconEl.style.color = 'var(--warning)';
        confirmBtn.style.background = 'var(--warning)';
    } else {
        iconEl.className = 'fas fa-question-circle';
        iconEl.style.color = 'var(--primary)';
        confirmBtn.style.background = 'var(--primary)';
    }

    modal.style.display = 'flex';

    return new Promise((resolve) => {
        confirmBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };
        cancelBtn.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                resolve(false);
            }
        };
    });
}
/**
 * Simple HTML Escaping for XSS prevention
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
    if (!str) return "";
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
}

/**
 * Centrally manages the hamburger menu toggle functionality.
 * Expects #menu-toggle button and .nav-links container in the DOM.
 */
export function setupHamburgerMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
        toggleBtn.onclick = () => {
            navLinks.classList.toggle('active');
        };

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}
