document.addEventListener('DOMContentLoaded', () => {
    // --- Vehicle Data with Locations ---
    const vehicleData = {
       bikes: [
           { id: 1, imgSrc: 'assets/bikes/bike1.png', title: 'Royal Enfield Classic 350', price: 800, details: [{icon:'fas fa-tachometer-alt', text:'40 km/l'}, {icon:'fas fa-cogs', text:'Manual'}], location: 'Hyderabad', duration: 7, available: true },
           { id: 2, imgSrc: 'assets/bikes/bike2.png', title: 'Bajaj Pulsar 150', price: 600, details: [{icon:'fas fa-tachometer-alt', text:'50 km/l'}, {icon:'fas fa-cogs', text:'Manual'}], location: 'Kochi', duration: 14, available: true },
           { id: 3, imgSrc: 'assets/bikes/bike3.png', title: 'KTM Duke 200', price: 900, details: [{icon:'fas fa-tachometer-alt', text:'35 km/l'}, {icon:'fas fa-cogs', text:'Manual'}], location: 'Chennai', duration: 30, available: true },
           { id: 4, imgSrc: 'assets/bikes/bike4.png', title: 'Honda CB Shine', price: 500, details: [{icon:'fas fa-tachometer-alt', text:'65 km/l'}, {icon:'fas fa-cogs', text:'Manual'}], location: 'Hyderabad', duration: 7, available: false },
       ],
       cars: [
           { id: 5, imgSrc: 'assets/cars/b1.jpg', title: 'Maruti Suzuki Swift', price: 1200, details: [{icon:'fas fa-tachometer-alt', text:'20k km'}, {icon:'fas fa-car', text:'2019'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-road', text:'Automatic'}], location: 'Chennai', duration: 14, available: true },
           { id: 6, imgSrc: 'assets/cars/b2.png', title: 'Hyundai Creta', price: 1800, details: [{icon:'fas fa-tachometer-alt', text:'15k km'}, {icon:'fas fa-car', text:'2020'}, {icon:'fas fa-gas-pump', text:'Diesel'}, {icon:'fas fa-road', text:'Manual'}], location: 'Kochi', duration: 30, available: true },
           { id: 7, imgSrc: 'assets/cars/b3.png', title: 'Kia Seltos', price: 1900, details: [{icon:'fas fa-tachometer-alt', text:'10k km'}, {icon:'fas fa-car', text:'2021'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-road', text:'Automatic'}], location: 'Hyderabad', duration: 7, available: true },
           { id: 8, imgSrc: 'assets/cars/b4.png', title: 'Mahindra XUV700', price: 2500, details: [{icon:'fas fa-tachometer-alt', text:'8k km'}, {icon:'fas fa-car', text:'2022'}, {icon:'fas fa-gas-pump', text:'Diesel'}, {icon:'fas fa-road', text:'Manual'}], location: 'Chennai', duration: 14, available: false },
       ]
   };

    // --- Variable Declarations ---
    const loginBtn = document.querySelector('#login .btn');
    const userIcon = document.querySelector('#login .fa-user'); // Might be menu icon on mobile
    const menuIcon = document.createElement('i'); // Create menu icon dynamically if needed
    menuIcon.className = 'fas fa-bars';
    menuIcon.id = 'menu-btn'; // Assign ID for styling/selection
    
    const loginFormContainer = document.querySelector('.login-form-container');
    const closeLoginFormBtn = document.querySelector('#close-login-form');
    const signupLink = document.querySelector('#signupLink'); // Link inside login form

    const signupFormContainer = document.querySelector('.sign-form-container');
    const closeSignupFormBtn = document.querySelector('#close-sign-form');

    const navbar = document.querySelector('.header .navbar');
    const header = document.querySelector('.header');

    const homeParallaxElements = document.querySelectorAll('.home-parallax');

    const vehicleTypeRadios = document.querySelectorAll('input[name="vehicle-type"]');
    const bikesSliderEl = document.getElementById('bikes-slider');
    const carsSliderEl = document.getElementById('cars-slider');
    const locationFilter = document.getElementById('location-filter');

    //Filter Controls
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const minDurationInput = document.getElementById('min-duration');
    const maxDurationInput = document.getElementById('max-duration');
    const availabilityCheckbox = document.getElementById('availability');
    const applyFiltersButton = document.getElementById('apply-filters');

    const featuredVehicleTypeRadios = document.querySelectorAll('input[name="featured-vehicle-type"]');
    const featuredBikesSliderEl = document.getElementById('featured-bikes-slider');
    const featuredCarsSliderEl = document.getElementById('featured-cars-slider');
    
    // --- Mobile Menu Handling ---
    // Check screen width initially and potentially swap login button/icon for menu icon
    function setupMobileMenuIcon() {
        const loginDiv = document.getElementById('login');
        if (window.innerWidth <= 991) {
            if (!loginDiv.querySelector('#menu-btn')) {
                loginDiv.insertBefore(menuIcon, userIcon); // Add menu icon before user icon
                if(loginBtn) loginBtn.style.display = 'none'; // Hide login button
                if(userIcon) userIcon.style.display = 'block'; // Ensure user icon is visible (if needed)
            }
        } else {
            const existingMenuBtn = loginDiv.querySelector('#menu-btn');
            if (existingMenuBtn) {
                loginDiv.removeChild(existingMenuBtn); // Remove menu icon
            }
            if(loginBtn) loginBtn.style.display = 'inline-flex'; // Show login button
            if(userIcon) userIcon.style.display = 'block'; // Default state
            navbar.classList.remove('active'); // Ensure navbar is closed
        }
    }
    
    menuIcon.onclick = () => {
        navbar.classList.toggle('active');
        if (navbar.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
        // Add logic here to highlight the active menu item
    };

    // Adjust menu icon visibility on resize
    window.addEventListener('resize', setupMobileMenuIcon);
    setupMobileMenuIcon(); // Initial check

    // --- Form Toggling ---
    const openLoginForm = () => {
        loginFormContainer.classList.add('active');
        signupFormContainer.classList.remove('active'); // Close signup if open
    };

    const closeLoginForm = () => {
        loginFormContainer.classList.remove('active');
    };
    
    const openSignupForm = () => {
        signupFormContainer.classList.add('active');
        loginFormContainer.classList.remove('active'); // Close login if open
    };

    const closeSignupForm = () => {
        signupFormContainer.classList.remove('active');
    };

    // Event Listeners for Forms
    if (loginBtn) loginBtn.onclick = openLoginForm;
    if (userIcon && window.innerWidth > 991) { // User icon might open login on desktop? Adjust logic if needed
        userIcon.onclick = openLoginForm;
    } else if (userIcon) {
        // If userIcon should open login on mobile too, add listener here.
        // If it has another function (like profile dropdown), handle that separately.
    }
    
    if (closeLoginFormBtn) closeLoginFormBtn.onclick = closeLoginForm;
    if (closeSignupFormBtn) closeSignupFormBtn.onclick = closeSignupForm;

    if (signupLink) {
        signupLink.onclick = (e) => {
            e.preventDefault(); // Prevent default link behavior
            openSignupForm();
        };
    }
    
    // Close forms if clicking outside the form area
    loginFormContainer.addEventListener('click', (e) => {
        if (e.target === loginFormContainer) {
            closeLoginForm();
        }
    });
     signupFormContainer.addEventListener('click', (e) => {
        if (e.target === signupFormContainer) {
            closeSignupForm();
        }
    });


    // --- Sticky Header ---
    window.onscroll = () => {
        navbar.classList.remove('active'); // Close navbar on scroll
        if(menuIcon) menuIcon.classList.remove('fa-times'); // Reset menu icon

        if (window.scrollY > 50) { // Add 'scrolled' class after scrolling 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax Effect Call
        handleParallax();
    };

    // --- Parallax Effect ---
    function handleParallax() {
        const scrollValue = window.scrollY;
        homeParallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0; // Get speed from data attribute
            // Ensure speed is treated as a number
            const numericSpeed = parseFloat(speed); 
            // Calculate translateY based on scroll position and speed
            // Adjust the multiplier (e.g., 0.4) to control the intensity
            const translateY = (scrollValue * numericSpeed * 0.1); 
            el.style.transform = `translateY(${translateY}px)`;
        });
    }
    handleParallax(); // Initial call for elements visible on load


    // --- Swiper Initializations ---
    // Function to initialize or update Swiper
    function initSwiper(selector, options = {}) {
        const defaultOptions = {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true, // Enable looping for seamless scroll
            grabCursor: true,
             centeredSlides: false, // Don't center single slide view
            autoplay: {
                delay: 5000, // Autoplay delay
                disableOnInteraction: false, // Continue autoplay after interaction
            },
            pagination: {
                el: selector + ' .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: selector + ' .swiper-button-next',
                prevEl: selector + ' .swiper-button-prev',
            },
            breakpoints: { // Responsive adjustments
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 4, // Show more items on larger screens
                    spaceBetween: 30,
                },
            },
        };
        // Merge default options with specific options passed in
        const finalOptions = { ...defaultOptions, ...options }; 
        return new Swiper(selector, finalOptions);
    }
    
    // Initialize sliders (assuming content will be populated)
    // Note: Swiper might need re-initialization if content is loaded dynamically AFTER this script runs.
    let bikesSwiper = initSwiper('#bikes-slider');
    let carsSwiper = initSwiper('#cars-slider');
    let featuredBikesSwiper = initSwiper('#featured-bikes-slider');
    let featuredCarsSwiper = initSwiper('#featured-cars-slider');

    // --- Vehicle Type Toggles ---
    function handleVehicleToggle(radios, bikesSliderElement, carsSliderElement, bikesSwiperInstance, carsSwiperInstance) {
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.id.includes('bikes') && radio.checked) {
                    bikesSliderElement.style.display = 'block';
                    carsSliderElement.style.display = 'none';
                     // Optional: Update/re-init Swiper if needed, especially after display change
                    if (bikesSwiperInstance) bikesSwiperInstance.update();
                } else if (radio.id.includes('cars') && radio.checked) {
                    bikesSliderElement.style.display = 'none';
                    carsSliderElement.style.display = 'block';
                    // Optional: Update/re-init Swiper
                    if (carsSwiperInstance) carsSwiperInstance.update(); 
                }
            });
        });
         // Initial check in case 'cars' is checked by default
        const checkedRadio = Array.from(radios).find(r => r.checked);
        if (checkedRadio && checkedRadio.id.includes('cars')) {
             bikesSliderElement.style.display = 'none';
             carsSliderElement.style.display = 'block';
             if (carsSwiperInstance) carsSwiperInstance.update();
        } else {
             bikesSliderElement.style.display = 'block';
             carsSliderElement.style.display = 'none';
              if (bikesSwiperInstance) bikesSwiperInstance.update();
        }
    }

    // Apply toggle logic to both sections
    handleVehicleToggle(vehicleTypeRadios, bikesSliderEl, carsSliderEl, bikesSwiper, carsSwiper);
    handleVehicleToggle(featuredVehicleTypeRadios, featuredBikesSliderEl, featuredCarsSliderEl, featuredBikesSwiper, featuredCarsSwiper);


    function populateSlider(wrapper, items) { // Simpler: Directly use the wrapper element
        wrapper.innerHTML = ''; // Clear existing placeholders

        // Simulate fetching data from an API (replace with actual API call)
        // In a real application, use:  fetch('/api/vehicles') ...
        // For now, we use the 'items' argument, assuming it's the fetched data.

        items.forEach(item => {
          // Ensure item.id is defined before using it
          const vehicleId = item.id;
            const slide = `
                <div class="swiper-slide" data-vehicle-id="${vehicleId}">  <!-- Add vehicle ID -->
                        <img src="${item.imgSrc}" alt="${item.title}" loading="lazy">
                        <!-- When integrating with a backend:
                             - Optimize images (resize, compress, use WebP format) before serving. -->
                       
                       <h3>${item.title}</h3>
                        <div class="price">${item.price} <span>/day</span></div>
                         <div class="booking-dates">
                            <label for="start-date-${vehicleId}">Start Date:</label>
                            <input type="date" id="start-date-${vehicleId}" class="box" required>
                            <label for="end-date-${vehicleId}">End Date:</label>
                            <input type="date" id="end-date-${vehicleId}" class="box" required>
                        </div>
                        <p>
                            ${item.details.map(d => `<div><i class="${d.icon}"></i> ${d.text}</div>`).join('')}
                        </p>
                        ${item.stars ? `<div class="stars">${'<i class="fas fa-star"></i>'.repeat(Math.floor(item.stars))}${(item.stars % 1 !== 0) ? '<i class="fas fa-star-half-alt"></i>' : ''}</div>` : ''}
                        <div class="booking-actions">
                            <button class="btn rent-now-btn" data-vehicle-id="${item.id}">Rent Now</button>
                        </div>
                 </div>
            `;
            wrapper.innerHTML += slide;
        });
         // Update Swiper instance after adding slides
         const sliderId = wrapper.closest('.swiper').id;
         if (sliderId === 'bikes-slider' && bikesSwiper) bikesSwiper.update();
         if (sliderId === 'cars-slider' && carsSwiper) carsSwiper.update();
         if (sliderId === 'featured-bikes-slider' && featuredBikesSwiper) featuredBikesSwiper.update();
         if (sliderId === 'featured-cars-slider' && featuredCarsSwiper) featuredCarsSwiper.update();
    }

    function filterVehicles(type, location) {
        let filtered = vehicleData[type];
        if (location !== 'All Locations') {
            filtered = filtered.filter(vehicle => vehicle.location === location);
        }
        return filtered;
    }

    // Function to apply filters
    function applyFilters() {
        const minPrice = parseInt(minPriceInput.value) || 0;
        const maxPrice = parseInt(maxPriceInput.value) || Infinity;
        const minDuration = parseInt(minDurationInput.value) || 0;
        const maxDuration = parseInt(maxDurationInput.value) || Infinity;
        const availability = availabilityCheckbox.checked;

        // Fuel Type filtering (cars only)
        const fuelTypeFilter = document.getElementById('fuel-type-filter');
        const selectedFuelType = fuelTypeFilter ? fuelTypeFilter.value : 'All'; // Default to 'All' if not found

        const selectedType = document.querySelector('input[name="vehicle-type"]:checked').id.includes('bikes') ? 'bikes' : 'cars';

        let filteredVehicles = vehicleData[selectedType];

        if (selectedType === 'cars') { // Apply fuel type filter only for cars
            filteredVehicles = filteredVehicles.filter(vehicle => {
                const fuelTypeDetail = vehicle.details.find(detail => detail.icon === 'fas fa-gas-pump');
                const vehicleFuelType = fuelTypeDetail ? fuelTypeDetail.text : 'Unknown'; // Handle missing info
                return selectedFuelType === 'All' || vehicleFuelType === selectedFuelType;
            });
        }

        filteredVehicles = filteredVehicles.filter(vehicle =>
            vehicle.price >= minPrice &&
            vehicle.price <= maxPrice &&
            vehicle.duration >= minDuration &&
            vehicle.duration <= maxDuration &&
            (availability ? vehicle.available : true)
        );

         populateSlider(document.querySelector(`#${selectedType}-slider .swiper-wrapper`), filteredVehicles);
    }   


    // Event listener for filter changes
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }

    // Modify the vehicle type toggle function to call applyFilters after the toggle
    function handleVehicleToggle(radios, bikesSliderElement, carsSliderElement, bikesSwiperInstance, carsSwiperInstance) {
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.id.includes('bikes') && radio.checked) {
                    bikesSliderElement.style.display = 'block';
                    carsSliderElement.style.display = 'none';
                    if (bikesSwiperInstance) bikesSwiperInstance.update();
                } else if (radio.id.includes('cars') && radio.checked) {
                    bikesSliderElement.style.display = 'none';
                    carsSliderElement.style.display = 'block';
                    if (carsSwiperInstance) carsSwiperInstance.update();
                }
                applyFilters(); // Apply filters after vehicle type change
            });
        });
    }

    // Call applyFilters on page load to apply initial filters
    applyFilters();


    // --- Event Listeners and Initializations ---
    // Location filter
    if (locationFilter) {
        locationFilter.addEventListener('change', () => {
            const selectedLocation = locationFilter.value;
            const selectedType = document.querySelector('input[name="vehicle-type"]:checked').id.includes('bikes') ? 'bikes' : 'cars';
            const filteredVehicles = filterVehicles(selectedType, selectedLocation);
            populateSlider(document.querySelector(`#${selectedType}-slider .swiper-wrapper`), filteredVehicles);
        });
    }

    // Initial population
    const initialType = document.querySelector('input[name="vehicle-type"]:checked').id.includes('bikes') ? 'bikes' : 'cars';
    populateSlider(document.querySelector(`#${initialType}-slider .swiper-wrapper`), filterVehicles(initialType, 'All Locations'));

    // --- Booking Logic --
    // Attach event listener to a parent element that exists on page load (e.g., document.body)
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('rent-now-btn')) {
            const vehicleId = event.target.dataset.vehicleId;
            const startDateInput = document.getElementById(`start-date-${vehicleId}`);
            const endDateInput = document.getElementById(`end-date-${vehicleId}`);

            if (!startDateInput || !endDateInput) {
                alert('Could not find date input fields for this vehicle.');
                return;
            }

            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            // Validation
            if (!vehicleId || !startDate || !endDate) {
                alert('Please select a vehicle and date range.');
                return;
            }

            if (new Date(endDate) <= new Date(startDate)) {
                alert('End date must be after the start date.');
                return;
            }

            // Simulate booking
            console.log(`Booking vehicle ${vehicleId} from ${startDate} to ${endDate}`);
            const bookingData = {
                vehicleId: vehicleId,
                startDate: startDate,
                endDate: endDate,
                userId: 123, // Replace with actual user ID
            };

            alert(`Vehicle ${vehicleId} booked successfully!`);

            // Redirect to checkout
            window.location.href = `checkout.html?vehicleId=${vehicleId}&startDate=${startDate}&endDate=${endDate}`;

        }
    });

    // --- Form Submission and Validation ---
    const handleFormSubmit = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const isLoginForm = formId === 'loginForm';
        const isSignupForm = formId === 'signupForm';

        const displayMessage = (message, isSuccess = false) => {
            let messageEl;
            if (isLoginForm) {
                messageEl = document.getElementById('loginMessage');
            } else if (isSignupForm) {
                messageEl = document.getElementById('signupMessage');
            }
            if (messageEl) {
                messageEl.textContent = message;
                messageEl.className = isSuccess ? 'success-message' : 'error-message';
                messageEl.style.display = 'block';
            }
        };

        const clearMessages = () => {
            if (isLoginForm) {
                const messageEl = document.getElementById('loginMessage');
                if (messageEl) {
                    messageEl.textContent = '';
                    messageEl.className = '';
                    messageEl.style.display = 'none';
                }
            } else if (isSignupForm) {
                const messageEl = document.getElementById('signupMessage');
                if (messageEl) {
                    messageEl.textContent = '';
                    messageEl.className = '';
                    messageEl.style.display = 'none';
                }
            }
        };

        // Submit listener
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearMessages();

            let isValid = true;
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => (data[key] = value));

            if (isLoginForm) {
                if (!data.username || !data.password) {
                    displayMessage('Please enter both username and password.');
                    isValid = false;
                }
            } else if (isSignupForm) {
                if (!data.name || !data.email || !data.password || !data.confirmPassword) {
                    displayMessage('Please fill in all required fields.');
                    isValid = false;
                } else if (!data.email.includes('@')) {
                    displayMessage('Please enter a valid email address.');
                    isValid = false;
                } else if (data.password.length < 6) {
                    displayMessage('Password must be at least 6 characters long.');
                    isValid = false;
                } else if (data.password !== data.confirmPassword) {
                    displayMessage('Passwords do not match.');
                    isValid = false;
                }
            }

            // If the form is valid, submit the data
            if (isValid) {
                // Prepare data for sending
                console.log('Form data submitted:', data);

                // Simulate sending data to the backend (replace with actual API call)
                // Example with fetch:
                // fetch('/api/users', { method: 'POST', body: JSON.stringify(data) })
                //   .then(response => response.json())
                //   .then(result => {
                //     if (result.success) {
                //       displayMessage('Submission successful!', true);
                //       //  Handle success (e.g., redirect, update UI)
                //     } else {
                //       displayMessage(result.error || 'An error occurred.', false);
                //     }
                //   });

                // Optionally reset the form after a delay:
                setTimeout(() => {
                    form.reset();
                    clearMessages();
                    if (isLoginForm) {
                        closeLoginForm();
                    } else if (isSignupForm) {
                        closeSignupForm();
                    }
                    // After successful signup, you might redirect to login:
                    // if (isSignupForm) openLoginForm();

                }, 2000);
            }
        });

        // Input focus states
        form.querySelectorAll('input').forEach(input => {
            // Add the 'focused' class on focus to apply specific styling (e.g., highlighting)
            input.addEventListener('focus', () => input.classList.add('focused'));
            input.addEventListener('blur', () => input.classList.remove('focused'));
        });

          // Initial styling consistency - you might need to adjust CSS based on your styles.css
          if (isSignupForm) {
          form.classList.add('signup-form'); // Add a class for signup form specific styling if needed.
        }
    };
    
    handleFormSubmit('loginForm', 'loginMessage');
    handleFormSubmit('signupForm', 'signupMessage');

    // --- Payment Page Logic ---
    if (window.location.pathname.endsWith('payment.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const vehicleType = urlParams.get('type');
        const vehicleName = urlParams.get('vehicle');
        const vehiclePrice = urlParams.get('price');

        if (vehicleType && vehicleName && vehiclePrice) {
            const vehicleImage = document.querySelector('.vehicle-image');
            const vehicleDetails = document.querySelector('.vehicle-details');

            let imageSrc = 'assets/placeholder-vehicle.jpg'; // Default placeholder
            if (vehicleType === 'bike') {
                // You might have specific bike images, adjust paths as needed
                imageSrc = 'assets/bike-placeholder.jpg'; // Example
            } else if (vehicleType === 'car') {
                // Adjust car image paths if available
                imageSrc = 'assets/car-placeholder.jpg'; // Example
            }

            if (vehicleImage) {
                vehicleImage.src = imageSrc;
                vehicleImage.alt = vehicleName;
            }

            if (vehicleDetails) {
                vehicleDetails.innerHTML = `<h2>${vehicleName}</h2><p>Type: ${vehicleType}, Price: ₹${vehiclePrice}/day</p>`;
            }
        }

        // Date and Cost Calculation
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const totalAmountSpan = document.getElementById('totalAmount');

        const calculateTotalCost = () => {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);

            if (startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && vehiclePrice) {
                const timeDiff = Math.abs(endDate - startDate);
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                const totalPrice = daysDiff * parseFloat(vehiclePrice);

                totalAmountSpan.textContent = totalPrice.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR', // Replace with your currency code if needed
                });
            } else {
                totalAmountSpan.textContent = '₹0.00'; // Reset or handle invalid input
            }
        };

        // Initial calculation (in case dates are pre-filled or to initialize the display)
        calculateTotalCost();

        // Event listeners for date changes
        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', calculateTotalCost);
            endDateInput.addEventListener('change', calculateTotalCost);
        } else {
            console.error('Start or end date input not found in payment.html');
        }



    }// Initialize the map
    const map = L.map('map').setView([17.3850, 78.4867], 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

}); // End DOMContentLoaded