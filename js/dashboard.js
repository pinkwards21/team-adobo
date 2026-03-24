// dashboard.js - Dashboard functionality

document.addEventListener('DOMContentLoaded', async () => {
    // Check auth
    auth.checkAuth();
    
    const user = auth.getSession();
    if (user) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    const contentList = document.getElementById('content-list');
    const statTotal = document.getElementById('stat-total');
    const statPublished = document.getElementById('stat-published');
    const statDrafts = document.getElementById('stat-drafts');
    const filterCat = document.getElementById('filter-cat');
    const searchInput = document.getElementById('search');

    // Load categories
    const categories = await api.getAll('categories');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filterCat.appendChild(option);
    });

    async function loadDashboard() {
        const announcements = await api.getAll('announcements');
        const filter = filterCat.value;
        const search = searchInput.value.toLowerCase();

        const filtered = announcements.filter(item => {
            const matchesCat = !filter || item.category === filter;
            const matchesSearch = !search || item.title.toLowerCase().includes(search);
            return matchesCat && matchesSearch;
        });

        // Update stats
        statTotal.textContent = announcements.length;
        statPublished.textContent = announcements.filter(a => a.status === 'published').length;
        statDrafts.textContent = announcements.filter(a => a.status === 'draft').length;

        // Render list
        contentList.innerHTML = '';
        filtered.forEach(item => {
            const tr = document.createElement('tr');
            const statusClass = item.status === 'published' ? 'badge-success' : 'badge-warning';
            
            tr.innerHTML = `
                <td style="font-weight: 500;">${item.title}</td>
                <td><span class="badge badge-info">${item.category}</span></td>
                <td>${item.author}</td>
                <td style="color: var(--text-muted);">${item.date}</td>
                <td><span class="badge ${statusClass}">${item.status}</span></td>
                <td class="flex gap-2">
                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="previewPost('${item.id}')">View</button>
                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem;" onclick="editPost('${item.id}')">Edit</button>
                    <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; color: var(--danger);" onclick="deletePost('${item.id}')">Delete</button>
                </td>
            `;
            contentList.appendChild(tr);
        });
    }

    window.previewPost = (id) => {
        window.open(`preview.html?id=${id}`, '_blank');
    };

    window.editPost = (id) => {
        window.location.href = `editor.html?id=${id}`;
    };

    window.deletePost = async (id) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            await api.delete('announcements', id);
            loadDashboard();
        }
    };

    filterCat.addEventListener('change', loadDashboard);
    searchInput.addEventListener('input', loadDashboard);

    loadDashboard();
});
