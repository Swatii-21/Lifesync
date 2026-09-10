const API_BASE = 'https://bloodsync-9g0v.onrender.com/api'; // change this when you deploy the backend

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointmentForm');
    const resultEl = document.getElementById('appointmentResult');
    const modeSelect = document.getElementById('modeSelect');
    const locationLabel = document.getElementById('locationLabel');
    const locationInput = document.getElementById('locationInput');

    // Adjust the location field depending on online/offline
    modeSelect.addEventListener('change', function () {
        if (this.value === 'online') {
            locationLabel.textContent = 'Preferred Video Platform / Notes';
            locationInput.placeholder = 'e.g. Google Meet link preference';
            locationInput.value = 'Online';
        } else if (this.value === 'offline') {
            locationLabel.textContent = 'Preferred Hospital / Camp';
            locationInput.placeholder = 'e.g. AIIMS Delhi';
            locationInput.value = '';
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (!validatePhone(data.phone)) {
            showResult('Please enter a valid 10-digit phone number.', false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                showResult(result.message || 'Something went wrong. Please try again.', false);
                return;
            }

            showResult(result.message || 'Appointment booked successfully!', true);
            form.reset();
        } catch (err) {
            console.error('Appointment booking failed:', err);
            showResult('Could not reach the server. Please make sure the backend is running.', false);
        }
    });

    function showResult(message, success) {
        resultEl.classList.remove('eligible', 'not-eligible');
        resultEl.classList.add(success ? 'eligible' : 'not-eligible');
        resultEl.textContent = message;
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function validatePhone(phone) {
        return /^\d{10}$/.test(phone.replace(/\s/g, ''));
    }
});