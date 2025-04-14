document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('#login .btn');
    const loginFormContainer = document.querySelector('.login-form-container');
    const signupFormContainer = document.querySelector('.sign-form-container');
    const closeLoginForm = document.querySelector('#close-login-form');
    const closeSignForm = document.querySelector('#close-sign-form');
    const signupLink = document.querySelector('#signupLink');
    const loginLink = document.querySelector('#loginLink');

    // Show login form
    loginBtn.addEventListener('click', () => {
        loginFormContainer.classList.add('active');
    });

    // Close login form
    closeLoginForm.addEventListener('click', () => {
        loginFormContainer.classList.remove('active');
    });

    // Show signup form from login form
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.remove('active');
        signupFormContainer.classList.add('active');
    });

    // Show login form from signup form
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormContainer.classList.remove('active');
        loginFormContainer.classList.add('active');
    });

    // Close signup form
    closeSignForm.addEventListener('click', () => {
        signupFormContainer.classList.remove('active');
    });

    // Vehicle type toggle for Vehicles section
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

    // Vehicle type toggle for Featured section
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

    // Swiper initialization
    new Swiper('.featured-slider', {
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
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });
});