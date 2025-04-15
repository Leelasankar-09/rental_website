document.addEventListener('DOMContentLoaded', () => {
    const bikeImage = document.getElementById('bikeImage');
    const pickDate = document.getElementById('pick');
    const dropDate = document.getElementById('drop');
    const totalAmount = document.getElementById('totalAmount');
    const paymentLink = document.getElementById('bookingForm');

    // Set min date to today (April 15, 2025)
    const today = new Date().toISOString().split('T')[0];
    pickDate.min = today;
    dropDate.min = today;

    // Calculate days and total amount
    function calculateTotal() {
        if (pickDate.value && dropDate.value) {
            const pick = new Date(pickDate.value);
            const drop = new Date(dropDate.value);
            if (drop <= pick) {
                totalAmount.textContent = 'Invalid';
                return 0;
            }
            const diffTime = Math.abs(drop - pick);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const pricePerDay = 1000;
            const total = diffDays * pricePerDay;
            totalAmount.textContent = total.toLocaleString('en-IN');
            return diffDays > 0 ? total : 0;
        }
        totalAmount.textContent = '0';
        return 0;
    }

    [pickDate, dropDate].forEach(input => {
        input.addEventListener('change', calculateTotal);
    });

    // Validate form and redirect to payment
    window.validateForm = (e) => {
        e.preventDefault();
        const location = document.getElementById('locationSelect').value;
        const pick = pickDate.value;
        const drop = dropDate.value;
        const total = calculateTotal();

        if (!location || !pick || !drop || total === 0 || totalAmount.textContent === 'Invalid') {
            alert('Please select a location and a valid date range.');
            return;
        }

        // Redirect to payment page with query params
        window.location.href = `payment.html?vehicle=TVS N-Torq&price=1000&type=Bike&days=${calculateTotal() / 1000}&location=${encodeURIComponent(location)}&pick=${pick}&drop=${drop}`;
    };

    // Close tab function
    window.closeTab = () => {
        window.close();
    };

    // Toggle navbar on mobile
    const navbar = document.querySelector('.navbar');
    const loginIcon = document.querySelector('#login i');
    loginIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
});