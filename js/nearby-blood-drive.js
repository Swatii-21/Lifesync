const API_BASE = 'http://localhost:5000/api'; // change this when you deploy the backend

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('driveLocationSearch');
    const searchBtn = document.getElementById('driveSearchBtn');
    const resultsEl = document.getElementById('driveResults');
    const driveForm = document.getElementById('driveForm');
    const driveFormResult = document.getElementById('driveFormResult');

    // Load all upcoming drives on page load
    loadDrives('');

    searchBtn.addEventListener('click', function () {
        loadDrives(searchInput.value.trim());
    });

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loadDrives(searchInput.value.trim());
        }
    });

    async function loadDrives(location) {
        resultsEl.innerHTML = '<p class="search-result-empty">Loading...</p>';
        try {
            const url = location
                ? `${API_BASE}/blooddrives?location=${encodeURIComponent(location)}`
                : `${API_BASE}/blooddrives`;
            const response = await fetch(url);
            const result = await response.json();

            if (!response.ok) {
                resultsEl.innerHTML = '<p class="search-result-empty">Could not load blood drives.</p>';
                return;
            }

            renderDrives(result.drives);
        } catch (err) {
            console.error('Could not load blood drives:', err);
            resultsEl.innerHTML = '<p class="search-result-empty">Could not reach the server. Please make sure the backend is running.</p>';
        }
    }

    function renderDrives(drives) {
        if (!drives || drives.length === 0) {
            resultsEl.innerHTML = '<div class="search-result-empty">No upcoming blood drives found for that location yet. Be the first to add one below!</div>';
            return;
        }

        resultsEl.innerHTML = drives
            .map((drive) => {
                const dateStr = new Date(drive.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                return `
                    <div class="search-result-item" style="align-items: flex-start;">
                        <div class="search-result-info">
                            <strong>${escapeHtml(drive.title)}</strong>
                            <span>${escapeHtml(drive.address)}</span>
                            <span>📅 ${dateStr} • 🕒 ${escapeHtml(drive.startTime)} - ${escapeHtml(drive.endTime)}</span>
                            <span>Organized by ${escapeHtml(drive.organizer)} • 📞 ${escapeHtml(drive.contactPhone)}</span>
                        </div>
                        <div class="search-result-badge">${escapeHtml(drive.location)}</div>
                    </div>
                `;
            })
            .join('');
    }

    driveForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(driveForm);
        const data = Object.fromEntries(formData);

        if (!/^\d{10}$/.test(data.contactPhone.replace(/\s/g, ''))) {
            showFormResult('Please enter a valid 10-digit phone number.', false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/blooddrives`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                showFormResult(result.message || 'Something went wrong. Please try again.', false);
                return;
            }

            showFormResult(result.message || 'Blood drive added successfully!', true);
            driveForm.reset();
            loadDrives(''); // refresh the list to show the new drive
        } catch (err) {
            console.error('Adding blood drive failed:', err);
            showFormResult('Could not reach the server. Please make sure the backend is running.', false);
        }
    });

    function showFormResult(message, success) {
        driveFormResult.classList.remove('eligible', 'not-eligible');
        driveFormResult.classList.add(success ? 'eligible' : 'not-eligible');
        driveFormResult.textContent = message;
        driveFormResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str ?? '';
        return div.innerHTML;
    }
});
