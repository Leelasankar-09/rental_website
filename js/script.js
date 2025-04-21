// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    anchorPlacement: 'top-bottom',
  });

  // Firebase Initialization (PLACEHOLDER - REPLACE WITH YOUR CONFIG)
  // const firebaseConfig = {
  //   apiKey: "YOUR_API_KEY",
  //   authDomain: "YOUR_AUTH_DOMAIN",
  //   projectId: "YOUR_PROJECT_ID",
  //   storageBucket: "YOUR_STORAGE_BUCKET",
  //   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  //   appId: "YOUR_APP_ID"
  // };
  // firebase.initializeApp(firebaseConfig);
  // console.log("Firebase initialized (Placeholder)");

  // Navbar Toggle for Mobile (Basic Example)
  const menuToggle = document.querySelector('.menu-toggle');
  const navUl = document.querySelector('.navbar nav ul');

  if (menuToggle && navUl) {
    menuToggle.addEventListener('click', () => {
      navUl.classList.toggle('active');
    });
  }

  // --- Placeholder Functions (Add actual logic based on your needs) ---

  // Example: Handle Checkout Form Submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log("Checkout form submitted (Placeholder)");
      // Add logic to process checkout, maybe save to Firestore
      alert("Booking submitted! (Placeholder)");
      // Potentially redirect to rental.html
      // window.location.href = "rental.html"; 
    });
  }

  // Example: Handle Payment Form Submission
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log("Payment form submitted (Placeholder)");
      // Add logic to process payment (e.g., integrate with Stripe, etc.)
      alert("Payment processed! (Placeholder)");
      // Potentially redirect to a confirmation or rental page
    });
  }

  // Example: Handle Admin Form Submission (e.g., adding a vehicle)
  const addVehicleForm = document.getElementById('add-vehicle-form');
  if (addVehicleForm) {
    addVehicleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log("Add vehicle form submitted (Placeholder)");
      // Add logic to get form data and save to Firestore
      alert("Vehicle added! (Placeholder)");
      addVehicleForm.reset(); // Clear the form
    });
  }

  // Example: Load Vehicles (e.g., for vehicle.html)
  const vehicleGrid = document.getElementById('vehicle-grid');
  if (vehicleGrid) {
    loadVehicles(); // Call function to load vehicles
  }

  // Example: FAQ Accordion (if you had one)
  const faqItems = document.querySelectorAll('.faq-item'); // Assuming structure like <div class="faq-item"><button>Question</button><div>Answer</div></div>
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const button = item.querySelector('button');
      const answer = item.querySelector('div'); // Adjust selector if needed
      if(button && answer) {
        button.addEventListener('click', () => {
          answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
          button.setAttribute('aria-expanded', answer.style.display === 'block');
          // Optional: Toggle class for styling active state
        });
      }
    });
  }

}); // End DOMContentLoaded

// --- Placeholder Function Definitions ---

async function loadVehicles() {
  console.log("Loading vehicles (Placeholder)");
  const vehicleGrid = document.getElementById('vehicle-grid');
  if (!vehicleGrid) return;

  // Placeholder Data - Replace with Firestore fetch
  const vehicles = [
    { id: '1', name: 'Sedan', description: 'Comfortable for city trips.', price: '50', imageUrl: 'assets/cars/b1.jpg' }, // Assuming assets exist
    { id: '2', name: 'SUV', description: 'Perfect for family adventures.', price: '75', imageUrl: 'assets/cars/b2.png' },
    { id: '3', name: 'Convertible', description: 'Enjoy the open road.', price: '90', imageUrl: 'assets/cars/b3.png' },
    { id: '4', name: 'Bike', description: 'Quick and agile.', price: '25', imageUrl: 'assets/bikes/bike1.png' }
  ];

  vehicleGrid.innerHTML = ''; // Clear existing

  vehicles.forEach(vehicle => {
    const card = document.createElement('div');
    card.classList.add('vehicle-card');
    card.setAttribute('data-aos', 'fade-up');
    card.innerHTML = `
      <img src="${vehicle.imageUrl || 'assets/placeholder.png'}" alt="${vehicle.name}">
      <h4>${vehicle.name}</h4>
      <p>${vehicle.description}</p>
      <p class="price">$${vehicle.price}/day</p>
      <a href="checkout.html?vehicleId=${vehicle.id}" class="btn">Book Now</a> 
    `; // Link to checkout with vehicle ID
    vehicleGrid.appendChild(card);
  });

  // Re-initialize AOS for newly added elements if needed, though usually `once: true` handles it.
  // AOS.refresh(); 
}

// Add other functions as needed (e.g., authentication, specific admin actions)
