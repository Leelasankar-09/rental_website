document.addEventListener('DOMContentLoaded', () => {
    const vehicles = [
        // Cars
        { name: "Maruti Swift", type: "Car", price: 2000, image: "assets/car1.jpg", details: ["Insured", "2023", "Manual", "Petrol", "5000km"], featured: true },
        { name: "Hyundai Creta", type: "Car", price: 3500, image: "assets/car2.jpg", details: ["Insured", "2024", "Automatic", "Petrol", "3000km"], featured: true },
        { name: "Tata Nexon EV", type: "Car", price: 4000, image: "assets/car3.jpg", details: ["Insured", "2024", "Automatic", "Electric", "2000km"], featured: false },
        { name: "Mahindra XUV 3XO", type: "Car", price: 3000, image: "assets/car4.jpg", details: ["Insured", "2023", "Manual", "Diesel", "6000km"], featured: false },
        { name: "Honda City", type: "Car", price: 3200, image: "assets/car5.jpg", details: ["Insured", "2024", "Automatic", "Petrol", "4000km"], featured: true },
        // Bikes
        { name: "Honda Activa 6G", type: "Bike", price: 500, image: "assets/bike1.png", details: ["Insured", "2024", "Gearless", "Petrol", "1000km"], featured: true },
        { name: "Royal Enfield Classic 350", type: "Bike", price: 1000, image: "assets/bike2.png", details: ["Insured", "2023", "Manual", "Petrol", "2000km"], featured: true },
        { name: "TVS Jupiter 125", type: "Bike", price: 550, image: "assets/bike3.png", details: ["Insured", "2024", "Gearless", "Petrol", "800km"], featured: false },
        { name: "Bajaj Pulsar NS200", type: "Bike", price: 800, image: "assets/bike4.png", details: ["Insured", "2023", "Manual", "Petrol", "3000km"], featured: true },
        { name: "Yamaha MT-15", type: "Bike", price: 900, image: "assets/bike5.png", details: ["Insured", "2024", "Manual", "Petrol", "1500km"], featured: false },
        { name: "Hero Splendor Plus", type: "Bike", price: 450, image: "assets/bike6.png", details: ["Insured", "2023", "Manual", "Petrol", "5000km"], featured: false },
        { name: "KTM 200 Duke", type: "Bike", price: 1100, image: "assets/bike7.png", details: ["Insured", "2024", "Manual", "Petrol", "1000km"], featured: true },
        { name: "Honda Hornet 2.0", type: "Bike", price: 750, image: "assets/bike8.png", details: ["Insured", "2023", "Manual", "Petrol", "2000km"], featured: false },
        { name: "Suzuki Access 125", type: "Bike", price: 520, image: "assets/bike9.png", details: ["Insured", "2024", "Gearless", "Petrol", "900km"], featured: true },
        { name: "TVS Apache RTR 160", type: "Bike", price: 700, image: "assets/bike10.png", details: ["Insured", "2023", "Manual", "Petrol", "2500km"], featured: false },
        { name: "Royal Enfield Hunter 350", type: "Bike", price: 950, image: "assets/bike11.png", details: ["Insured", "2024", "Manual", "Petrol", "1200km"], featured: true },
        { name: "Bajaj Dominar 400", type: "Bike", price: 1200, image: "assets/bike12.png", details: ["Insured", "2023", "Manual", "Petrol", "1800km"], featured: false }
    ];

    // Populate Sliders
    function populateSlider(sliderId, type, featured = false) {
        const slider = document.querySelector(`#${sliderId} .swiper-wrapper`);
        const filteredVehicles = vehicles.filter(v => v.type === type && (!featured || v.featured));
        slider.innerHTML = filteredVehicles.map(v => `
            <div class="swiper-slide box">
                <img src="${v.image}" alt="${v.name}">
                <h3>${v.name}</h3>
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </div>
                <div class="price">₹${v.price}/Day</div>
                <p>
                    ${v.details.map(d => `<span class="fas fa-circle"></span>${d}`).join('')}
                </p>
                <a href="payment.html?vehicle=${encodeURIComponent(v.name)}&price=${v.price}&type=${v.type}" class="btn">Check Out</a>
            </div>
        `).join('');
    }

    // Initialize Sliders
    populateSlider('bikes-slider', 'Bike');
    populateSlider('cars-slider', 'Car');
    populateSlider('featured-bikes-slider', 'Bike', true);
    populateSlider('featured-cars-slider', 'Car', true);

    // Swiper Initialization
    document.querySelectorAll('.featured-slider').forEach(slider => {
        new Swiper(slider, {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
            },
        });
    });

    // Vehicle Toggle
    const bikesSlider = document.getElementById('bikes-slider');
    const carsSlider = document.getElementById('cars-slider');
    const bikesRadio = document.getElementById('bikes');
    const carsRadio = document.getElementById('cars');

    bikesRadio.addEventListener('change', () => {
        bikesSlider.style.display = 'block';
        carsSlider.style.display = 'none';
    });

    carsRadio.addEventListener('change', () => {
        bikesSlider.style.display = 'none';
        carsSlider.style.display = 'block';
    });

    const featuredBikesSlider = document.getElementById('featured-bikes-slider');
    const featuredCarsSlider = document.getElementById('featured-cars-slider');
    const featuredBikesRadio = document.getElementById('featured-bikes');
    const featuredCarsRadio = document.getElementById('featured-cars');

    featuredBikesRadio.addEventListener('change', () => {
        featuredBikesSlider.style.display = 'block';
        featuredCarsSlider.style.display = 'none';
    });

    featuredCarsRadio.addEventListener('change', () => {
        featuredBikesSlider.style.display = 'none';
        featuredCarsSlider.style.display = 'block';
    });

    // Login/Signup
    const loginBtn = document.querySelector('#login .btn');
    const loginFormContainer = document.querySelector('.login-form-container');
    const signupFormContainer = document.querySelector('.sign-form-container');
    const closeLoginForm = document.querySelector('#close-login-form');
    const closeSignForm = document.querySelector('#close-sign-form');
    const signupLink = document.querySelector('#signupLink');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginBtn.addEventListener('click', () => {
        loginFormContainer.classList.add('active');
    });

    closeLoginForm.addEventListener('click', () => {
        loginFormContainer.classList.remove('active');
    });

    closeSignForm.addEventListener('click', () => {
        signupFormContainer.classList.remove('active');
    });

    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.remove('active');
        signupFormContainer.classList.add('active');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        if (username && password) {
            document.getElementById('loginMessage').textContent = 'Login successful!';
            document.getElementById('loginMessage').style.color = '#2ecc71';
            document.getElementById('loginMessage').style.display = 'block';
            loginForm.reset();
            setTimeout(() => {
                loginFormContainer.classList.remove('active');
                document.getElementById('loginMessage').style.display = 'none';
            }, 2000);
        } else {
            document.getElementById('loginMessage').textContent = 'Please fill all fields.';
            document.getElementById('loginMessage').style.color = '#e63946';
            document.getElementById('loginMessage').style.display = 'block';
        }
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const name = document.getElementById('signupName').value;
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        if (email && name && username && password && confirmPassword && password === confirmPassword) {
            document.getElementById('signupMessage').textContent = 'Account created!';
            document.getElementById('signupMessage').style.color = '#2ecc71';
            document.getElementById('signupMessage').style.display = 'block';
            signupForm.reset();
            setTimeout(() => {
                signupFormContainer.classList.remove('active');
                document.getElementById('signupMessage').style.display = 'none';
            }, 2000);
        } else {
            document.getElementById('signupMessage').textContent = password !== confirmPassword ? 'Passwords do not match.' : 'Please fill all fields.';
            document.getElementById('signupMessage').style.color = '#e63946';
            document.getElementById('signupMessage').style.display = 'block';
        }
    });
});