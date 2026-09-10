const API_BASE = 'http://localhost:5000/api'; // change this when you deploy the backend

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('requestForm');
    const resultEl = document.getElementById('requestResult');
    const matchedDonorsEl = document.getElementById('matchedDonors');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (!/^\d{10}$/.test(data.phone.replace(/\s/g, ''))) {
            showResult('Please enter a valid 10-digit phone number.', false);
            return;
        }

        try {
            // 1. Save the request so it's tracked
            const response = await fetch(`${API_BASE}/requests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                showResult(result.message || 'Something went wrong. Please try again.', false);
                return;
            }

            showResult('Your request has been posted! Here are compatible donors near you:', true);

            // 2. Immediately look up compatible donors near that location
            await findCompatibleDonors(data.bloodGroupNeeded, data.location);

            form.reset();
        } catch (err) {
            console.error('Request submission failed:', err);
            showResult('Could not reach the server. Please make sure the backend is running.', false);
        }
    });

    async function findCompatibleDonors(bloodGroup, location) {
        try {
            const url = `${API_BASE}/donors/compatible/${bloodGroup}?location=${encodeURIComponent(location)}`;
            const response = await fetch(url);
            const result = await response.json();

            if (!response.ok) {
                matchedDonorsEl.innerHTML = '<p class="search-result-empty">Could not load matching donors.</p>';
                return;
            }

            renderDonors(result.donors, result.compatibleGroups);
        } catch (err) {
            console.error('Could not load compatible donors:', err);
            matchedDonorsEl.innerHTML = '<p class="search-result-empty">Could not reach the server to find donors.</p>';
        }
    }

    function renderDonors(donors, compatibleGroups) {
        if (!donors || donors.length === 0) {
            matchedDonorsEl.innerHTML = `
                <div class="search-result-empty">
                    No registered donors found nearby for compatible blood groups (${compatibleGroups.join(', ')}) yet.
                    Please also try calling nearby hospitals directly.
                </div>`;
            return;
        }

        matchedDonorsEl.innerHTML =
            '<h3 style="margin: 1.5rem 0 1rem; color: #8B0000;">Compatible Donors</h3>' +
            donors
                .map(
                    (donor) => `
                        <div class="search-result-item">
                            <div class="search-result-info">
                                <strong>${escapeHtml(donor.name)}</strong>
                                <span>${escapeHtml(donor.location)} • ${escapeHtml(donor.phone)}</span>
                            </div>
                            <div class="search-result-badge">${escapeHtml(donor.bloodGroup)}</div>
                        </div>
                    `
                )
                .join('');
    }

    function showResult(message, success) {
        resultEl.classList.remove('eligible', 'not-eligible');
        resultEl.classList.add(success ? 'eligible' : 'not-eligible');
        resultEl.textContent = message;
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str ?? '';
        return div.innerHTML;
    }
});
