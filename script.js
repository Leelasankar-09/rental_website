document.addEventListener('DOMContentLoaded', () => {
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
        menuIcon.classList.toggle('fa-times'); // Optional: change icon to 'X'
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


    // --- Placeholder Content Population (Example) ---
    // !! IMPORTANT !!: Replace this with your actual data loading mechanism (e.g., fetch from API)
    function populateSlider(swiperWrapperSelector, items) {
        const wrapper = document.querySelector(swiperWrapperSelector);
        if (!wrapper) return;
        wrapper.innerHTML = ''; // Clear existing placeholders

        items.forEach(item => {
            const slide = `
                <div class="swiper-slide">
                    <div class="box">
                        <img src="${item.imgSrc}" alt="${item.title}">
                        <h3>${item.title}</h3>
                        <div class="price">${item.price} <span>/day</span></div>
                        <p>
                           ${item.details.map(d => `<div><i class="${d.icon}"></i> ${d.text}</div>`).join('')}
                        </p>
                        ${item.stars ? `<div class="stars">${'<i class="fas fa-star"></i>'.repeat(Math.floor(item.stars))}${(item.stars % 1 !== 0) ? '<i class="fas fa-star-half-alt"></i>' : ''}</div>` : ''}
                        <a href="#" class="btn">Check Out</a>
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

    // Example Data (Replace with your actual data)
    const exampleBikes = [
        { imgSrc: 'assets/bike1.jpg', title: 'Sport Bike X', price: '₹1500', details: [{icon:'fas fa-motorcycle', text:'250cc'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-tachometer-alt', text:'120kmph'}] },
        { imgSrc: 'assets/bike2.jpg', title: 'Cruiser Classic', price: '₹1800', details: [{icon:'fas fa-motorcycle', text:'350cc'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-road', text:'Comfort'}] },
        { imgSrc: 'assets/bike3.jpg', title: 'Scooter Zippy', price: '₹800', details: [{icon:'fas fa-motorcycle', text:'125cc'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-shopping-bag', text:'Storage'}] },
        { imgSrc: 'assets/bike4.jpg', title: 'Mountain Trail', price: '₹2000', details: [{icon:'fas fa-motorcycle', text:'400cc'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-mountain', text:'Off-road'}] },
        { imgSrc: 'assets/bike5.jpg', title: 'Electric Bolt', price: '₹1200', details: [{icon:'fas fa-motorcycle', text:'Electric'}, {icon:'fas fa-battery-full', text:'100km Range'}, {icon:'fas fa-leaf', text:'Eco-friendly'}] },
    ];
     const exampleCars = [
        { imgSrc: 'assets/car1.jpg', title: 'Sedan Swift', price: '₹2500', details: [{icon:'fas fa-user-friends', text:'5 Seats'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-snowflake', text:'AC'}] },
        { imgSrc: 'assets/car2.jpg', title: 'SUV Explorer', price: '₹4000', details: [{icon:'fas fa-user-friends', text:'7 Seats'}, {icon:'fas fa-gas-pump', text:'Diesel'}, {icon:'fas fa-suitcase-rolling', text:'Luggage'}] },
        { imgSrc: 'assets/car3.jpg', title: 'Hatchback City', price: '₹2000', details: [{icon:'fas fa-user-friends', text:'4 Seats'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-parking', text:'Compact'}] },
        { imgSrc: 'assets/car4.jpg', title: 'Luxury Drive', price: '₹6000', details: [{icon:'fas fa-user-friends', text:'5 Seats'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-star', text:'Premium'}] },
        { imgSrc: 'assets/car5.jpg', title: 'Electric Aura', price: '₹3500', details: [{icon:'fas fa-user-friends', text:'5 Seats'}, {icon:'fas fa-battery-full', text:'300km Range'}, {icon:'fas fa-leaf', text:'Eco-friendly'}] },
    ];
     const featuredBikesData = [ // Example: Subset or different bikes
        { imgSrc: 'assets/featured_bike1.jpg', title: 'Premium Racer', price: '₹2200', details: [{icon:'fas fa-motorcycle', text:'600cc'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-flag-checkered', text:'Track Ready'}], stars: 4.5 },
        { imgSrc: 'assets/featured_bike2.jpg', title: 'Adventure Tourer', price: '₹2500', details: [{icon:'fas fa-motorcycle', text:'800cc'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-map-marked-alt', text:'Long Trips'}], stars: 5 },
     ];
      const featuredCarsData = [ // Example: Subset or different cars
        { imgSrc: 'assets/featured_car1.jpg', title: 'Convertible Sun', price: '₹5500', details: [{icon:'fas fa-user-friends', text:'2 Seats'}, {icon:'fas fa-gas-pump', text:'Petrol'}, {icon:'fas fa-wind', text:'Open Top'}], stars: 4.5 },
        { imgSrc: 'assets/featured_car2.jpg', title: 'Rugged 4x4', price: '₹4800', details: [{icon:'fas fa-user-friends', text:'5 Seats'}, {icon:'fas fa-gas-pump', text:'Diesel'}, {icon:'fas fa-mountain', text:'All-Terrain'}], stars: 5 },
     ];

    // Populate the sliders with example data
    populateSlider('#bikes-slider .swiper-wrapper', exampleBikes);
    populateSlider('#cars-slider .swiper-wrapper', exampleCars);
    populateSlider('#featured-bikes-slider .swiper-wrapper', featuredBikesData);
    populateSlider('#featured-cars-slider .swiper-wrapper', featuredCarsData);
    
    // --- Form Submission (Basic Example) ---
    const handleFormSubmit = (formId, messageId) => {
        const form = document.getElementById(formId);
        const messageEl = document.getElementById(messageId);
        if(form && messageEl) {
            form.addEventListener('submit', (e) => {
                e.preventDefault(); // Prevent actual submission for this example
                // Add your validation logic here
                const usernameInput = form.querySelector('input[type="text"], input[type="email"]'); // Simple check if first input is filled
                
                messageEl.style.display = 'block'; // Show message area
                messageEl.classList.remove('success', 'error'); // Reset classes
                
                if(usernameInput && usernameInput.value.trim() !== '') {
                     // Simulate success
                     messageEl.textContent = 'Processing... (Submission successful!)';
                     messageEl.classList.add('success'); 
                     // Optionally close form after delay or redirect
                     // setTimeout(() => {
                     //     if(formId === 'loginForm') closeLoginForm();
                     //     else closeSignupForm();
                     // }, 2000);
                } else {
                     // Simulate error
                     messageEl.textContent = 'Please fill in all required fields.';
                     messageEl.classList.add('error');
                }
            });
        }
    };
    
    handleFormSubmit('loginForm', 'loginMessage');
    handleFormSubmit('signupForm', 'signupMessage');

}); // End DOMContentLoaded