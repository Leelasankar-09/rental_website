document.addEventListener('DOMContentLoaded', function() {
    const pickInput = document.getElementById('pick');
    const dropInput = document.getElementById('drop');

    pickInput.addEventListener('change', calculateDateDifference);
    dropInput.addEventListener('change', calculateDateDifference);
});

function calculateDateDifference() {
    const pickDate = document.getElementById('pick').value;
    const dropDate = document.getElementById('drop').value;
    const priceText = document.querySelector('.price').innerText;
    const pricePerDay = parseInt(priceText.match(/₹(\d+)/)[1]);

    if (pickDate && dropDate) {
        const pick = new Date(pickDate);
        const drop = new Date(dropDate);
        const timeDifference = drop.getTime() - pick.getTime();
        const dayDifference = timeDifference / (1000 * 3600 * 24);

        if (dayDifference >= 0) {
            const totalAmount = dayDifference * pricePerDay;
            document.getElementById('cash').innerText = `Total Amount: ₹${totalAmount}`;
        } else {
            document.getElementById('cash').innerText = 'Total Amount: Drop date must be after Pickup date';
        }
    }
}
function closeTab() {
    window.close();
}
function validateForm() {
    const location = document.getElementById('location').value;
    const pickDate = document.getElementById('pick').value;
    const dropDate = document.getElementById('drop').value;

    if (!location || !pickDate || !dropDate) {
        alert('Please fill in all fields before proceeding.');
        return false; // Prevent the link from working
} else {
        // Change the href of the payment link
        document.getElementById('payment').href = '../paymentpage.html';
        return true; // Allow the link to work
    }
}