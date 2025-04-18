/**
 * =====================================================
 * UIManager Class
 * Handles general UI interactions across the website,
 * such as header, mobile menu, and form modals (login/signup).
 * =====================================================
 */
class UIManager {
  /**
   * Initializes the UIManager and sets up event listeners and components.
   */
  constructor() {
      // Store references to key DOM elements for easier access
      this.elements = {
          loginBtn: document.querySelector('.header #login .btn'),
          loginFormContainer: document.querySelector('.login-form-container'),
          closeLoginForm: document.querySelector('#close-login-form'),
          menuBtn: document.querySelector('#menu-btn'),
          navbar: document.querySelector('.header .navbar'),
          // Note: Parallax and Swiper elements are included here assuming this JS might be shared
          // with other pages like the index page. If this JS is only for the payment page,
          // these elements and their related methods (setupParallax, initializeSwipers)
          // might be moved or commented out if they are not present in payment.html.
          homeSection: document.getElementById('home'), // Check for existence in init()
          homeImg: document.querySelector('.home-img'), // Check for existence in init()
          homeHeading: document.querySelector('.home .heading'), // Check for existence in init()
          homeBtn: document.querySelector('.home .btn'), // Check for existence in init()
          vehicleSlider: document.querySelector('.vehicle .featured-slider'), // Check for existence in init()
          featuredSlider: document.querySelector('.featured .featured-slider'), // Check for existence in init()
          reviewsSlider: document.querySelector('.reviews .reviews-slider'), // Check for existence in init()

          // Elements for signup form modal
          signupFormContainer: document.querySelector(".sign-form-container"),
          closeSignForm: document.querySelector("#close-sign-form"),
          signupLink: document.querySelector("#signupLink"), // Link to open signup from login form
          loginLink: document.querySelector("#loginLink"), // Link to open login from signup form

          // Form elements for submission handling (within UIManager if it handles auth)
          loginForm: document.getElementById("loginForm"),
          signupForm: document.getElementById("signupForm"),
          loginMessage: document.getElementById("loginMessage"), // Message area for login form
          signupMessage: document.getElementById("signupMessage"), // Message area for signup form
      };

      // Ensure DOM is fully loaded before initialization
      // Use 'defer' attribute on the script tag instead of wrapping all in DOMContentLoaded
      // if the script is placed in the <head>. If placed at the end of <body>, it's not strictly needed.
      // document.addEventListener('DOMContentLoaded', () => {
           this.init();
      // });
  }

  /**
   * Main initialization function for UIManager.
   * Calls methods to set up listeners and components.
   */
  init() {
      console.log("UIManager initialized."); // Debug log
      this.setupEventListeners();
      // Only call methods for features that are present in the HTML where this script is used
      if (this.elements.vehicleSlider || this.elements.featuredSlider || this.elements.reviewsSlider) {
           this.initializeSwipers(); // Initialize Swipers only if their containers exist
      }
      if (this.elements.homeSection) { // Initialize Parallax only if home section exists
           this.setupParallax(); // Setup parallax effect
      }
      this.addScrollEffectToHeader(); // Add header scroll effect (assuming header is always present)

      // Check if forms are present and add .form-container class if missing (for shared styling)
      if(this.elements.loginFormContainer && !this.elements.loginFormContainer.classList.contains('form-container')) {
           this.elements.loginFormContainer.classList.add('form-container');
      }
       if(this.elements.signupFormContainer && !this.elements.signupFormContainer.classList.contains('form-container')) {
           this.elements.signupFormContainer.classList.add('form-container');
       }
  }

  /**
   * Sets up all global event listeners for UIManager features.
   */
  setupEventListeners() {
      // Toggle login form visibility
      if (this.elements.loginBtn && this.elements.loginFormContainer && this.elements.closeLoginForm) {
          this.elements.loginBtn.addEventListener('click', () => {
              this.toggleForm('login', true); // Use the more general toggleForm method
          });

          this.elements.closeLoginForm.addEventListener('click', () => {
              this.toggleForm('login', false); // Use the more general toggleForm method
          });
      } else {
          console.warn("UIManager: Login button or form elements not found for toggle functionality.");
      }

      // Toggle mobile menu visibility
      if (this.elements.menuBtn && this.elements.navbar) {
          this.elements.menuBtn.addEventListener('click', () => {
              this.toggleMobileMenu();
          });

          // Close mobile menu when a link is clicked (for better UX)
          this.elements.navbar.querySelectorAll('a').forEach(link => {
              link.addEventListener('click', () => {
                   if (this.elements.navbar.classList.contains('active')) {
                      this.toggleMobileMenu(false); // Close menu after clicking a link
                   }
              });
          });

      } else {
          console.warn("UIManager: Menu button or navbar not found for mobile menu functionality.");
      }

      // Close mobile menu and potentially forms on window scroll
      window.addEventListener('scroll', () => {
           // Close mobile menu if open on scroll (especially useful on non-mobile sizes if menu is sticky)
           // Or specifically close if menu is active and screen width is below breakpoint
          if (this.elements.navbar && this.elements.navbar.classList.contains('active') && window.innerWidth <= 991) { // Assuming 991px is the breakpoint
              this.toggleMobileMenu(false); // Pass false to explicitly close
          }
          // Add header scroll effect
          this.handleHeaderScroll(); // This listener is handled by addScrollEffectToHeader, might be redundant here
      });

      // Close login/signup forms if open when window is resized (optional but good UX)
      window.addEventListener('resize', () => {
           if (this.elements.loginFormContainer && this.elements.loginFormContainer.classList.contains('active') && window.innerWidth >= 991) {
               this.toggleForm('login', false); // Close login form on larger screens if open
           }
           if (this.elements.signupFormContainer && this.elements.signupFormContainer.classList.contains('active') && window.innerWidth >= 991) {
                this.toggleForm('signup', false); // Close signup form on larger screens if open
           }
           // Note: Parallax and Swipers might need re-initialization or update on resize depending on implementation
           // If using Swiper, its resize handling is usually built-in.
      });

       // Handle click to show signup form from login form
       if (this.elements.signupLink) {
          this.elements.signupLink.addEventListener("click", (e) => {
              e.preventDefault(); // Prevent default link behavior
              this.toggleForm("login", false); // Hide login
              this.toggleForm("signup", true); // Show signup
          });
       } else {
           console.warn("UIManager: Signup link not found for form switching.");
       }

       // Handle click to show login form from signup form
       if (this.elements.loginLink) {
          this.elements.loginLink.addEventListener("click", (e) => {
              e.preventDefault(); // Prevent default link behavior
              this.toggleForm("signup", false); // Hide signup
              this.toggleForm("login", true); // Show login
          });
       } else {
           console.warn("UIManager: Login link not found for form switching.");
       }

       // Handle close button for signup form
       if (this.elements.closeSignForm) {
          this.elements.closeSignForm.addEventListener("click", () =>
              this.toggleForm("signup", false) // Close signup form
          );
       } else {
           console.warn("UIManager: Close signup form button not found.");
       }


       // Handle login and signup form submissions (simulated authentication)
       // These event listeners trigger the handleAuthSubmission method.
       if (this.elements.loginForm) {
          this.elements.loginForm.addEventListener("submit", (e) =>
              this.handleAuthSubmission(e, 'login') // Pass the event and form type
          );
       } else {
            console.warn("UIManager: Login form not found for submission handling.");
       }
       if (this.elements.signupForm) {
           this.elements.signupForm.addEventListener("submit", (e) =>
              this.handleAuthSubmission(e, 'signup') // Pass the event and form type
          );
       } else {
           console.warn("UIManager: Signup form not found for submission handling.");
       }
  }

  /**
   * Toggles the visibility of login or signup forms containers.
   * Manages the 'active' class and body scroll overflow.
   * @param {'login'|'signup'} formType The type of form to toggle ('login' or 'signup').
   * @param {boolean} show True to show the form, false to hide.
   */
  toggleForm(formType, show) {
      const container = formType === "login" ? this.elements.loginFormContainer : this.elements.signupFormContainer;
      const otherContainer = formType === "login" ? this.elements.signupFormContainer : this.elements.loginFormContainer; // The other form container

      if (!container) {
          console.warn(`UIManager: ${formType} form container not found.`);
          return;
      }

      if (show) {
          container.classList.add("active");
          // Ensure the other form container is hidden if it's currently active
          if(otherContainer && otherContainer.classList.contains('active')) {
               otherContainer.classList.remove('active');
          }
          document.body.style.overflowY = 'hidden'; // Prevent scrolling when any form modal is open
      } else {
          container.classList.remove("active");
           // Only restore body scrolling if *both* form containers are now closed
          if (!this.elements.loginFormContainer || !this.elements.loginFormContainer.classList.contains('active')) { // Check if login container exists and is not active
               if (!this.elements.signupFormContainer || !this.elements.signupFormContainer.classList.contains('active')) { // Check if signup container exists and is not active
                   document.body.style.overflowY = 'auto'; // Restore scrolling
               }
          }
      }
       console.log(`UIManager: ${formType} form toggled: ${show ? 'shown' : 'hidden'}`);
  }


  /**
   * Toggles the visibility of the mobile navigation menu.
   * Also toggles the menu button icon (fontawesome class).
   * @param {boolean|null} forceState Optional boolean to force the state (true for open, false for close).
   */
  toggleMobileMenu(forceState = null) {
      if (!this.elements.navbar || !this.elements.menuBtn) {
          console.warn("UIManager: Cannot toggle mobile menu, navbar or menu button not found.");
          return;
      }
      const isActive = this.elements.navbar.classList.contains('active');
       if (forceState === true || (forceState === null && !isActive)) {
          this.elements.navbar.classList.add('active');
          this.elements.menuBtn.classList.add('fa-times'); // Change icon to 'X' for close state
       } else if (forceState === false || (forceState === null && isActive)) {
          this.elements.navbar.classList.remove('active');
          this.elements.menuBtn.classList.remove('fa-times'); // Change icon back to bars (hamburger)
       }
       console.log(`UIManager: Mobile menu toggled: ${this.elements.navbar.classList.contains('active') ? 'open' : 'closed'}`);
  }

   /**
    * Adds a 'scrolled' class to the header when the page is scrolled down from the top.
    * This allows CSS to apply different styles (e.g., background color, shadow)
    * to the header when the user scrolls down.
    */
   addScrollEffectToHeader() {
       const header = document.querySelector('.header');
       if (!header) {
           console.warn("UIManager: Header element not found for scroll effect.");
           return;
       }

       // Use a throttled scroll listener if performance becomes an issue
       window.addEventListener('scroll', () => {
           if (window.scrollY > 0) {
               header.classList.add('scrolled');
           } else {
               header.classList.remove('scrolled');
           }
       });
       console.log("UIManager: Header scroll effect listener added.");
   }

  /**
   * Sets up the parallax effect for specific elements in the home section.
   * The effect is triggered by mouse movement within the window.
   * Elements must have a 'data-speed' attribute to control the magnitude of movement.
   * This method is only relevant if the home section exists on the page.
   */
  setupParallax() {
      // Check if all necessary elements for the parallax effect are present
      if (!this.elements.homeSection || !this.elements.homeImg || !this.elements.homeHeading || !this.elements.homeBtn) {
           console.warn("UIManager: Home section or its elements not found for parallax setup. Skipping.");
           return;
      }

      window.addEventListener('mousemove', (e) => {
          // Calculate movement relative to the center of the viewport
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          const mouseX = e.pageX - centerX;
          const mouseY = e.pageY - centerY;

          // Apply transform (translate) based on mouse position and the element's data-speed
          const applyParallax = (element, speed) => {
              // Ensure element and a valid speed value are provided
              if (!element || speed === null || isNaN(speed)) return;

              // Adjust the divisor to control parallax sensitivity.
              // A smaller number means more movement.
              const sensitivity = 1000; // Example sensitivity value

              const translateX = (mouseX * speed) / sensitivity;
              const translateY = (mouseY * speed) / sensitivity;

              // Apply the transform to the element's style
              element.style.transform = `translate(${translateX}px, ${translateY}px)`;
          };

          // Get the speed values from the data-speed attributes and apply the effect
          // Ensure data-speed is parsed as a float number
          applyParallax(this.elements.homeImg, parseFloat(this.elements.homeImg.getAttribute('data-speed')));
          applyParallax(this.elements.homeHeading, parseFloat(this.elements.homeHeading.getAttribute('data-speed')));
          applyParallax(this.elements.homeBtn, parseFloat(this.elements.homeBtn.getAttribute('data-speed')));
      });
       console.log("UIManager: Parallax mousemove listener attached.");
  }


  /**
   * Initializes all Swiper carousels/sliders found in the DOM that match the selectors.
   * Requires the Swiper library (swiper-bundle.min.js) to be included in the HTML.
   * This method is only relevant if Swiper containers are present on the page.
   */
  initializeSwipers() {
      // Check if the Swiper library is available globally
      if (typeof Swiper === 'undefined') {
          console.error("UIManager: Swiper library not found. Swiper initialization skipped. Please ensure swiper-bundle.min.js is included in your HTML.");
          return;
      }
      console.log("UIManager: Swiper library detected. Attempting to initialize sliders...");

      // Initialize Vehicle Swiper if the element exists
      if (this.elements.vehicleSlider) {
          new Swiper(this.elements.vehicleSlider, {
              grabCursor: true, // Change cursor to indicate draggable
              loop: true, // Enable infinite loop
              centeredSlides: true, // Center the active slide
              spaceBetween: 20, // Space between slides in pixels
              pagination: { // Setup pagination dots
                  el: '.vehicle .swiper-pagination', // Specific pagination container for this slider
                  clickable: true, // Make pagination dots clickable
              },
              breakpoints: { // Responsive settings based on screen width
                  0: { slidesPerView: 1 }, // 1 slide per view on small screens
                  768: { slidesPerView: 2 }, // 2 slides per view on tablets
                  991: { slidesPerView: 3 }, // 3 slides per view on larger screens
              },
               // Optional: Add navigation arrows (requires corresponding HTML elements)
               // navigation: {
               //     nextEl: '.vehicle .swiper-button-next',
               //     prevEl: '.vehicle .swiper-button-prev',
               // },
          });
           console.log("UIManager: Vehicle Swiper initialized.");
      } else {
           console.warn("UIManager: Vehicle slider element (.vehicle .featured-slider) not found for Swiper initialization. Skipping.");
      }

      // Initialize Featured Swiper if the element exists
      if (this.elements.featuredSlider) {
          new Swiper(this.elements.featuredSlider, {
              grabCursor: true,
              loop: true,
              centeredSlides: true,
              spaceBetween: 20,
              pagination: {
                  el: '.featured .swiper-pagination', // Specific pagination container for this slider
                  clickable: true,
              },
              breakpoints: {
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  991: { slidesPerView: 3 },
              },
               // navigation: {
               //     nextEl: '.featured .swiper-button-next',
               //     prevEl: '.featured .swiper-button-prev',
               // },
          });
          console.log("UIManager: Featured Swiper initialized.");
      } else {
          console.warn("UIManager: Featured slider element (.featured .featured-slider) not found for Swiper initialization. Skipping.");
      }

      // Initialize Reviews Swiper if the element exists
      if (this.elements.reviewsSlider) {
           new Swiper(this.elements.reviewsSlider, {
              grabCursor: true,
              loop: true,
              centeredSlides: true, // May want to remove this for review layout
              spaceBetween: 20,
               pagination: {
                  el: '.reviews .swiper-pagination', // Specific pagination container for this slider
                  clickable: true,
              },
               breakpoints: {
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  991: { slidesPerView: 3 }, // Adjust for desired number of reviews visible
              },
               // navigation: {
               //     nextEl: '.reviews .swiper-button-next',
               //     prevEl: '.reviews .swiper-button-prev',
               // },
          });
          console.log("UIManager: Reviews Swiper initialized.");
      } else {
          console.warn("UIManager: Reviews slider element (.reviews .reviews-slider) not found for Swiper initialization. Skipping.");
      }
       console.log("UIManager: Swiper initialization complete.");
  }

  /**
   * Handles simulated login and signup form submissions.
   * Performs basic client-side validation and simulates an asynchronous
   * backend authentication process.
   * @param {Event} e The submit event object.
   * @param {'login'|'signup'} formType The type of form being submitted ('login' or 'signup').
   */
   async handleAuthSubmission(e, formType) {
      e.preventDefault(); // Prevent default form submission and page reload

      const form = formType === 'login' ? this.elements.loginForm : this.elements.signupForm;
      const messageEl = formType === 'login' ? this.elements.loginMessage : this.elements.signupMessage;

       if (!form || !messageEl) {
           console.error(`UIManager: Form or message element not found for handling ${formType} submission.`);
           return;
       }

      // Show initial processing message
      this.showMessage(messageEl, 'Processing...', ''); // Use UIManager's showMessage method

      // Basic client-side validation (add more robust validation as needed)
      let isValid = true;
      let errorMessage = '';

      if (formType === 'login') {
          // Get input elements
          const usernameInput = form.querySelector('#loginUsername');
          const passwordInput = form.querySelector('#loginPassword');

           if (!usernameInput || !passwordInput) {
               isValid = false; errorMessage = "UIManager: Login form inputs not found.";
           } else {
               // Sanitize and get values
               const username = this.sanitizeInput(usernameInput.value);
               const password = this.sanitizeInput(passwordInput.value);

               // Perform basic checks
               if (!username || !password) {
                   isValid = false;
                   errorMessage = 'Please fill in both username and password.';
               }
                // Add more login-specific validation here if required (e.g., username format)
           }
      } else { // Signup form
          // Get input elements
          const emailInput = form.querySelector('#signupEmail');
          const nameInput = form.querySelector('#signupName');
          const usernameInput = form.querySelector('#signupUsername');
          const passwordInput = form.querySelector('#signupPassword');
          const confirmPasswordInput = form.querySelector('#signupConfirmPassword');

          if (!emailInput || !nameInput || !usernameInput || !passwordInput || !confirmPasswordInput) {
               isValid = false; errorMessage = "UIManager: Signup form inputs not found.";
          } else {
              // Sanitize and get values
              const email = this.sanitizeInput(emailInput.value);
              const name = this.sanitizeInput(nameInput.value);
              const username = this.sanitizeInput(usernameInput.value);
              const password = this.sanitizeInput(passwordInput.value);
              const confirmPassword = this.sanitizeInput(confirmPasswordInput.value);

              // Perform basic checks
              if (!email || !name || !username || !password || !confirmPassword) {
                  isValid = false;
                  errorMessage = 'Please fill in all fields.';
              } else if (password !== confirmPassword) {
                  isValid = false;
                  errorMessage = 'Passwords do not match.';
              } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email format check
                   isValid = false;
                   errorMessage = 'Please enter a valid email address.';
              }
               // Add more signup-specific validation here (e.g., password strength, username availability check)
          }
      }

      // If client-side validation fails, display error and stop
      if (!isValid) {
          this.showMessage(messageEl, errorMessage, 'error');
          return; // Stop execution
      }

      try {
          // --- Simulate an asynchronous authentication process (REPLACE WITH REAL BACKEND API CALL) ---
          console.log(`UIManager: Simulating backend authentication for ${formType}...`);
          // In a real application, you would send form data to your backend server.
          // The backend would handle user authentication (login) or account creation (signup)
          // and return a success or failure response (e.g., JWT token, error message).

          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay and backend processing

          // Simulate success scenario (replace with actual success check from your backend response)
          // In a real app, the backend response would indicate success or failure.
          const simulatedSuccess = Math.random() > 0.1; // 90% chance of success in this simulation

          if (!simulatedSuccess) {
               // Simulate a specific backend error message
               throw new Error(formType === 'login' ? "Invalid username or password." : "Username or email already exists.");
          }
          // --- END SIMULATION ---


          // Handle simulated success based on form type
          if (formType === 'login') {
               this.showMessage(messageEl, 'Login successful! Redirecting...', 'success');
               console.log("UIManager: Simulated Login Success!");
               // In a real app: Store user session (e.g., token in localStorage/cookies) and redirect
               setTimeout(() => {
                   this.toggleForm('login', false); // Close the form modal
                   // window.location.href = '/dashboard'; // Example: redirect to a dashboard page
               }, 1000); // Delay closing/redirect slightly after message appears
          } else { // Simulated Signup success
              this.showMessage(messageEl, 'Account created successfully! Please login.', 'success');
              console.log("UIManager: Simulated Signup Success!");
              // Optionally clear form and automatically show the login form
               if (form) form.reset(); // Reset signup form fields
               setTimeout(() => {
                   this.toggleForm('signup', false); // Close the signup form modal
                   // Optionally open the login form automatically after successful signup:
                   // this.toggleForm('login', true);
               }, 1500); // Delay closing and potential redirect

          }

      } catch (error) {
          // Handle simulated or actual authentication failure
           console.error(`UIManager: Authentication ${formType} failed:`, error);
           // Display the error message received from validation or the simulated backend error
           this.showMessage(messageEl, error.message || `Authentication ${formType} failed. Please try again.`, 'error');

      }
   }


  /**
   * Sanitizes input string to prevent basic Cross-Site Scripting (XSS) and trims whitespace.
   * This is a basic sanitation; more comprehensive server-side sanitation is also required.
   * @param {string} input The string to sanitize.
   * @returns {string} The sanitized string.
   */
  sanitizeInput(input) {
      // Return null/undefined directly, ensure input is a string before processing
      if (typeof input !== 'string') {
          console.warn("UIManager: sanitizeInput received non-string value:", input);
          return input; // Return non-strings as is or handle as error
      }
      // Map characters to their HTML entity equivalents
      const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;', // Or &apos; - &#x27; is more universally supported
          '/': '&#x2F;',
      };
      // Use a regular expression to find and replace the characters globally and case-insensitively
      const reg = /[&<>"'/]/ig;
      // Replace each found character with its mapped entity, then remove leading/trailing whitespace
      return input.replace(reg, (match)=>(map[match])).trim();
  }

  /**
   * Displays a message within a specific message element on the page.
   * Applies appropriate styling based on message type (success/error).
   * @param {HTMLElement} messageEl The message element where the text will be displayed (e.g., <p id="loginMessage">).
   * @param {string} message The message text content to display.
   * @param {'success'|'error'|''} type The type of message for styling ('success', 'error', or empty string for general/processing messages).
   * @param {number} [duration=5000] The duration (in milliseconds) to show the message if it's a 'success' or 'error' type before hiding it.
   */
  showMessage(messageEl, message, type, duration = 5000) {
       // Ensure the message element exists before trying to manipulate it
       if (!messageEl) {
           console.warn("UIManager: Message element not provided or not found. Cannot display message:", message);
           return;
       }
       // Set the text content of the message element
       messageEl.textContent = message;

       // Reset any existing message-specific classes and add the base class
       // Assumes your CSS defines styles for '.form-message', '.form-message--success', '.form-message--error'
       messageEl.className = 'form-message'; // Reset class list to just 'form-message'

       // Add specific class based on the message type
       if (type === 'success') {
           messageEl.classList.add('form-message--success');
       } else if (type === 'error') {
           messageEl.classList.add('form-message--error');
       }
       // Ensure the message element is displayed
       messageEl.style.display = 'block';

       // Automatically hide the message after a delay if it's a final result (success or error)
       // Processing messages (type='') should typically remain visible until a final result is shown.
       if (type !== '') {
            // Clear any previous timeout set for this message element
            if (messageEl.dataset.hideTimeout) {
                clearTimeout(parseInt(messageEl.dataset.hideTimeout));
            }
            // Set a new timeout to hide the message
            const timeoutId = setTimeout(() => {
                messageEl.style.display = 'none';
            }, duration);
            // Store the timeout ID on the element itself so it can be cleared later if needed
            messageEl.dataset.hideTimeout = timeoutId.toString();
       } else {
           // For non-final messages (like 'Processing...'), ensure no hide timeout is pending
           if (messageEl.dataset.hideTimeout) {
               clearTimeout(parseInt(messageEl.dataset.hideTimeout));
               delete messageEl.dataset.hideTimeout; // Remove the data attribute
           }
       }
  }

  // --- Add more UIManager specific methods here as needed ---
  // For example, methods to handle contact form submission, vehicle filtering on index page, etc.
}


/**
* =====================================================
* PaymentProcessor Class
* Handles all specific logic related to the payment page,
* including parsing details, calculating amounts, managing
* payment methods (Card/UPI), generating QR codes, handling
* payment submission, and simulating UPI ID lookup.
* =====================================================
*/
class PaymentProcessor {
   /**
    * Constructor for the PaymentProcessor class.
    * Initializes DOM elements, configuration, and state, and sets up event listeners.
    */
   constructor() {
       // Store references to key DOM elements specific to the payment page
       this.elements = {
          // Rental Details Display
          vehicleType: document.getElementById("vehicleType"),
          vehicleName: document.getElementById("vehicleName"),
          vehiclePrice: document.getElementById("vehiclePrice"), // Displays price *per day*
          rentalDays: document.getElementById("rentalDays"), // Input for number of days
          billAmount: document.getElementById("bill-amount"), // Input (readonly) for the *total* calculated amount
          currencyDisplay: document.getElementById("currencyDisplay"), // Element to display currency symbol

          // Payment Method Radios
          cardMethodRadio: document.getElementById("card-method"),
          upiMethodRadio: document.getElementById("upi-method"),

          // Payment Method Sections (Containers)
          cardSection: document.getElementById("card-section"),
          upiSection: document.getElementById("upi-section"),

          // Card form inputs (within cardSection)
          cardName: document.getElementById("card-name"),
          cardNumber: document.getElementById("card-number"),
          expMonth: document.getElementById("exp-month"),
          expYear: document.getElementById("exp-year"),
          cvv: document.getElementById("cvv"),

           // UPI form inputs and elements for lookup result/error (within upiSection)
           upiId: document.getElementById("upi-id"), // Input for UPI ID (Optional in this design)
           upiIdLookupResult: null, // Element to show verified name below UPI ID input
           upiIdErrorMessage: null, // Element to show specific UPI error message below UPI ID input
           qrCodeDiv: document.getElementById("upi-qr-code"), // Container where QRCode.js will draw the QR code

           // Main Payment Form and Message Area
           paymentForm: document.getElementById("paymentForm"), // The main form element
           paymentMessage: document.getElementById("paymentMessage"), // Message area for payment results (success/error/processing)
           submitButton: null, // Will be assigned the submit button later
       };

       // Configuration: Important settings for the payment processor
       this.config = {
           // NOTE: merchantVPA and merchantName are primarily for generating the QR code/deep link for UPI Scan & Pay.
           // For a real transaction initiated by the "Pay Now" button (especially for Card or UPI via Payout API),
           // you would send amount, vehicle details, user info, and potentially card tokens/UPI ID (if required by gateway)
           // to your backend for secure processing via a Payment Gateway API.
           // Your personal UPI ID (like 6305333302@ibl) should NEVER be the direct destination in client-side code.
           // Money goes to a MERCHANT ACCOUNT via the Payment Gateway.
          merchantVPA: "merchant@upi", // Example VPA for QR code (REPLACE WITH YOUR ACTUAL QR VPA)
          merchantName: "Vroom Rentals", // Example name for QR code (REPLACE WITH YOUR ACTUAL MERCHANT NAME for QR)
          // Your personal UPI ID is NOT used here for receiving funds via the application's payment flow.

          minRentalDays: 1, // Minimum number of rental days allowed
          minAmount: 1, // Minimum total amount for a payment to be valid
          currency: "INR", // Currency code (e.g., "USD", "EUR", "INR")

          qrCodeSize: 180, // Size of the generated QR code image in pixels

          // Message display duration
          messageDuration: 7000, // How long success/error messages are displayed (milliseconds)

          // UPI lookup simulation settings (for demonstration only)
          upiLookupDelay: 800, // Simulated delay for UPI ID verification (milliseconds)
          // Simulated valid UPI IDs for testing the lookup feature:
          upiLookupSimulatedValidIds: ['test@upi', 'success@bank', 'user123@vpa', 'johndoe@upi'],
          // Simulated names corresponding to the valid IDs (case-insensitive check)
           upiLookupSimulatedNames: {
               'test@upi': 'Test User',
               'success@bank': 'Verified Client',
               'user123@vpa': 'App User',
               'johndoe@upi': 'John Doe Smith' // Example name for johndoe@upi
           },
           upiLookupSimulatedErrorId: 'invalid@upi', // Simulated ID that will always fail lookup
      };

      // State: Keeps track of the current state of the payment process and details
      this.state = {
          vehicleName: "", // Name of the vehicle being rented
          vehiclePricePerDay: 0, // Price of the vehicle per day
          vehicleType: "", // Type of vehicle
          rentalDays: 0, // Number of rental days selected by the user
          totalAmount: 0, // Calculated total bill amount
          isProcessing: false, // Flag to prevent multiple payment submissions
          isUpiLookingUp: false, // Flag to prevent multiple simultaneous UPI lookups
      };

       // --- Find dynamic elements (like lookup result/error) after input ---
       // These are typically paragraphs placed right after the upi-id input in HTML
       if (this.elements.upiId) {
            let nextSibling = this.elements.upiId.nextElementSibling;
            while(nextSibling) {
                 if (nextSibling.classList && nextSibling.classList.contains('upi-lookup-result')) {
                      this.elements.upiIdLookupResult = nextSibling;
                 } else if (nextSibling.classList && nextSibling.classList.contains('upi-error-message')) {
                      this.elements.upiIdErrorMessage = nextSibling;
                 }
                 // If we found both required elements, we can stop searching
                 if (this.elements.upiIdLookupResult && this.elements.upiIdErrorMessage) break;

                 // Move to the next sibling element
                 nextSibling = nextSibling.nextElementSibling;
            }

           // Optional: Basic check/warning if elements were not found based on expected class names
           if (!this.elements.upiIdLookupResult) console.warn("PaymentProcessor: UPI lookup result element (.upi-lookup-result) not found after #upi-id input.");
           if (!this.elements.upiIdErrorMessage) console.warn("PaymentProcessor: UPI error message element (.upi-error-message) not found after #upi-id input.");

           // Ensure these elements are initially hidden (controlled by CSS display: none or JS)
           if(this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
           if(this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';
       } else {
           console.warn("PaymentProcessor: UPI ID input element (#upi-id) not found. UPI related features will be disabled.");
       }
      // --- End Find dynamic elements ---

      // Get the submit button reference
       if (this.elements.paymentForm) {
            this.elements.submitButton = this.elements.paymentForm.querySelector('button[type="submit"].submit-btn');
            if (!this.elements.submitButton) {
                 console.error("PaymentProcessor: Payment form submit button (.submit-btn) not found within #paymentForm.");
            }
       }


      // Check if the main payment form is present in the DOM
      this.isPaymentPage = !!this.elements.paymentForm;

      // Initialize PaymentProcessor only if the payment form exists on the page
      // This prevents errors if this script is included on other pages without the form.
      if (this.isPaymentPage) {
          // Initialization logic runs when the DOM is ready
           // If using 'defer' on script tag, DOMContentLoaded is not strictly necessary,
           // but it's safe to keep or move the init call directly here if script is at end of body.
           // document.addEventListener("DOMContentLoaded", () => {
              this.init();
           // });
      } else {
          console.log("PaymentProcessor: Main payment form (#paymentForm) not found. PaymentProcessor features are disabled.");
      }
   }

   /**
    * Main initialization function for PaymentProcessor.
    * Calls methods to set up state, listeners, and UI.
    */
   init() {
       console.log("PaymentProcessor initialized.");
       this.parseURLParams(); // Get details from URL
       this.renderVehicleDetails(); // Display parsed details
       this.setupEventListeners(); // Setup form and input listeners
       this.updateBillAmount(); // Calculate initial total and update UI/QR

       // Ensure the correct payment method section is initially displayed
       // Check if radio buttons exist before accessing their checked state
       if(this.elements.cardMethodRadio && this.elements.upiMethodRadio){
           this.togglePaymentMethod(this.elements.cardMethodRadio.checked ? 'card' : 'upi');
       } else {
           // Default to showing card section if radios not found, assumes card section exists
           this.togglePaymentMethod('card');
           console.warn("PaymentProcessor: Payment method radio buttons not found. Defaulting to card view.");
       }

       // Perform an initial UPI ID lookup if the input field is pre-filled
       if (this.elements.upiId && this.elements.upiId.value) {
            this.validateUpiIdAndFetchName(this.elements.upiId.value);
       }

       // Update currency symbol if element exists
       if (this.elements.currencyDisplay) {
           this.elements.currencyDisplay.textContent = this.config.currency === 'INR' ? '₹' : this.config.currency; // Use symbol for INR
       } else {
           console.warn("PaymentProcessor: Currency display element not found (#currencyDisplay).");
       }
   }

   /**
    * Parses URL parameters from the current window location to get vehicle details.
    * Populates the state object with the retrieved data.
    */
   parseURLParams() {
       const urlParams = new URLSearchParams(window.location.search);
       this.state.vehicleName = this.sanitizeInput(urlParams.get("vehicle")) || "Unknown Vehicle";
       // Parse price per day from 'price' parameter, default to 0 if not found or invalid
       this.state.vehiclePricePerDay = parseFloat(urlParams.get("price")) || 0;
       this.state.vehicleType = this.sanitizeInput(urlParams.get("type")) || "Unknown";
       // Parse rental days from 'days' parameter, default to minRentalDays if not found or invalid
       const initialDays = parseInt(urlParams.get("days"));
       this.state.rentalDays = (initialDays && initialDays >= this.config.minRentalDays) ? initialDays : this.config.minRentalDays;

       // Set the value of the rentalDays input field based on the parsed value
       if (this.elements.rentalDays) {
            this.elements.rentalDays.value = this.state.rentalDays;
       } else {
           console.warn("PaymentProcessor: Rental days input element not found for URL param initialization.");
       }
       console.log("PaymentProcessor: Parsed URL Params:", this.state);
   }

   /**
    * Sets up event listeners specific to the payment form and its inputs.
    */
   setupEventListeners() {
       // Event listener for rental days input change
       if (this.elements.rentalDays) {
            this.elements.rentalDays.addEventListener(
                "input",
                // Use debounce to limit how often updateBillAmount is called while typing
                this.debounce(() => {
                    const days = parseInt(this.elements.rentalDays.value);
                    // Update state's rentalDays, ensuring it's at least the minimum configured days
                    this.state.rentalDays = (days && days >= this.config.minRentalDays) ? days : this.config.minRentalDays;
                    console.log("PaymentProcessor: Rental days input changed, state updated to", this.state.rentalDays);
                    this.updateBillAmount(); // Recalculate total and update UI/QR
                }, 300) // 300ms delay after last input before executing
            );
       } else {
           console.warn("PaymentProcessor: Rental days input element not found. Cannot set up input listener.");
       }


       // Event listeners for payment method radio button changes
       if (this.elements.cardMethodRadio) {
           this.elements.cardMethodRadio.addEventListener("change", () =>
               this.togglePaymentMethod("card") // Show card section when selected
           );
       }
       if (this.elements.upiMethodRadio) {
           this.elements.upiMethodRadio.addEventListener("change", () =>
               this.togglePaymentMethod("upi") // Show UPI section when selected
           );
       }
       if (!this.elements.cardMethodRadio || !this.elements.upiMethodRadio) {
           console.warn("PaymentProcessor: Payment method radio buttons not found. Payment method toggle disabled.");
       }


       // Event listener for UPI ID input for live lookup simulation
       if (this.elements.upiId) {
          this.elements.upiId.addEventListener(
              "input",
              // Debounce the lookup function to avoid excessive calls while the user is typing
              this.debounce(() => {
                   const upiId = this.sanitizeInput(this.elements.upiId.value);
                   if (upiId.length > 0) {
                        // Trigger the simulated lookup if the input is not empty
                        this.validateUpiIdAndFetchName(upiId);
                   } else {
                        // Clear any displayed messages if the input field is emptied
                        if (this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
                        if (this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';
                   }
              }, 500) // Wait 500ms after the user stops typing before triggering lookup
          );
           console.log("PaymentProcessor: UPI ID input listener added for lookup simulation.");
      } else {
           console.warn("PaymentProcessor: UPI ID input element not found. UPI lookup simulation disabled.");
      }


       // Event listener for the main payment form submission
       if (this.elements.paymentForm) {
            this.elements.paymentForm.addEventListener(
                "submit",
                this.handlePaymentSubmission.bind(this) // Bind 'this' to the class instance
            );
             console.log("PaymentProcessor: Payment form submit listener added.");
       } else {
          console.error("PaymentProcessor: Payment form element not found. Payment submission cannot be handled.");
       }
   }

   /**
    * Renders the vehicle details (Type, Name, Price per Day) onto the payment page UI.
    * Uses data stored in the state object, populated by parseURLParams.
    */
   renderVehicleDetails() {
       // Update the text content of the elements displaying vehicle details
       if (this.elements.vehicleType) this.elements.vehicleType.textContent = this.capitalize(this.state.vehicleType);
       if (this.elements.vehicleName) this.elements.vehicleName.textContent = this.state.vehicleName;
       // Display price per day with currency
       if (this.elements.vehiclePrice) this.elements.vehiclePrice.textContent = `${this.config.currency} ${this.state.vehiclePricePerDay.toFixed(2)}/Day`;

       console.log("PaymentProcessor: Vehicle details rendered:", this.state.vehicleName, this.state.vehiclePricePerDay);
   }

   /**
    * Updates the total bill amount based on the current rental days and vehicle price per day.
    * Updates the readonly bill amount input field and triggers QR code regeneration if UPI is active.
    */
   updateBillAmount() {
       const rentalDays = this.state.rentalDays; // Get rental days from the state
       const pricePerDay = this.state.vehiclePricePerDay; // Get price per day from the state

       // Calculate total amount, ensuring valid inputs are used
       if (rentalDays >= this.config.minRentalDays && pricePerDay > 0) {
           this.state.totalAmount = pricePerDay * rentalDays;
       } else {
           this.state.totalAmount = 0; // Total is 0 if days or price are invalid
       }

       // Update the value of the readonly total bill amount input field
       if (this.elements.billAmount) {
            this.elements.billAmount.value = this.state.totalAmount.toFixed(2); // Format to 2 decimal places
            console.log("PaymentProcessor: Bill amount updated to", this.state.totalAmount);
       } else {
          console.warn("PaymentProcessor: Bill amount input element (#bill-amount) not found. Cannot display total amount.");
       }

       // If the UPI payment method is currently selected and the total amount is valid, regenerate the QR code
       if (this.elements.upiMethodRadio && this.elements.upiMethodRadio.checked && this.state.totalAmount >= this.config.minAmount) {
           this.updateQRCode();
       } else if (this.elements.qrCodeDiv && this.elements.upiMethodRadio && this.elements.upiMethodRadio.checked) {
            // If UPI is selected but amount is too low, clear the QR code and show a message
            this.elements.qrCodeDiv.innerHTML = `<p class="upi-help">Enter a valid amount (minimum ${this.config.currency}${this.config.minAmount.toFixed(2)}) to generate QR code.</p>`;
            // Also clear the descriptive text if it exists and is not the error message
            const helpTextElement = this.elements.qrCodeDiv.parentElement.querySelector('.upi-help:not(.upi-error-message)');
            if (helpTextElement && helpTextElement.parentElement !== this.elements.qrCodeDiv) { // Check parent to ensure it's the help text below QR code
               helpTextElement.remove();
            }
       }
   }

   /**
    * Toggles the visibility of the payment method sections (Card vs UPI).
    * Ensures only the selected method's section is visible.
    * Also dynamically manages the 'required' attribute for input fields
    * within the currently visible payment section.
    * @param {'card'|'upi'} method The payment method section to display ('card' or 'upi').
    */
   togglePaymentMethod(method) {
       // Determine if the card section should be visible
       const isCard = method === "card";

       // Show/hide the card and UPI sections
       if (this.elements.cardSection) this.elements.cardSection.style.display = isCard ? "block" : "none";
       if (this.elements.upiSection) this.elements.upiSection.style.display = isCard ? "none" : "block";

       // Update the 'required' attribute for input fields in the respective sections
       // Fields in the active section become required (if they were originally intended to be),
       // fields in the inactive section lose the required attribute.
       if (this.elements.cardSection) this.toggleRequiredFields(this.elements.cardSection, isCard); // Inputs in card section
       if (this.elements.upiSection) this.toggleRequiredFields(this.elements.upiSection, !isCard); // Inputs in UPI section


       // If switching TO UPI, update the QR code. If switching AWAY FROM UPI, clear messages.
       if (!isCard) { // Switching to UPI
           this.updateQRCode(); // Generate QR code if UPI section is shown
       } else { // Switching away from UPI (to Card)
            // Clear any specific UPI lookup result or error messages
            if (this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
            if (this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';
             // Optional: Clear the QR code div when switching away from UPI
            if (this.elements.qrCodeDiv) this.elements.qrCodeDiv.innerHTML = "";
             // Optional: Remove the UPI help text below the QR code
             const helpTextElement = this.elements.qrCodeDiv ? this.elements.qrCodeDiv.parentElement.querySelector('.upi-help:not(.upi-error-message)') : null;
              if (helpTextElement && helpTextElement.parentElement !== this.elements.qrCodeDiv) {
                helpTextElement.remove();
             }
       }

       console.log(`PaymentProcessor: Switched to ${method} payment method.`);
   }

   /**
    * Sets or removes the 'required' HTML attribute for input elements (input, select, textarea)
    * within a given section. This is used to enforce form validation based on the visible
    * payment method section. Excludes the UPI ID input as it's optional in this design.
    * @param {HTMLElement} section The HTML section element containing input fields.
    * @param {boolean} required True to set the 'required' attribute, false to remove it.
    */
   toggleRequiredFields(section, required) {
       if (!section) {
           console.warn("PaymentProcessor: toggleRequiredFields received null section element.");
           return;
       }
       // Select all relevant input elements within the section (excluding readonly fields)
       const inputs = section.querySelectorAll('input:not([readonly]), select, textarea');

       inputs.forEach((input) => {
           // Apply 'required' based on the section's visibility.
           // Explicitly handle inputs like UPI ID if they are optional or have specific conditions.
           if (input.id === 'upi-id') {
               // The UPI ID is designed as optional in this form, so it should never be required by this toggle.
               input.required = false;
           } else {
                // For all other input fields in the section (e.g., card details),
                // set them as required if the section is visible, otherwise remove required.
               input.required = required;
           }

            // Optional: Clear the value of the input field when the section is hidden.
            // This prevents submitting old data from a hidden section.
            // if (!required) {
            //    input.value = '';
            // }
       });
       console.log(`PaymentProcessor: Required fields updated for section based on visibility.`);
   }


   /**
    * Simulates validating a UPI ID format and attempting to fetch the holder's name.
    * This is a **client-side simulation for demonstration purposes only**.
    * A **real and secure application** requires this process to happen on the **server-side**
    * using secure APIs provided by banks or payment gateways.
    * @param {string} upiId The UPI ID string to validate.
    */
  async validateUpiIdAndFetchName(upiId) {
      const lookupResultEl = this.elements.upiIdLookupResult; // Element to show the verified name
      const errorMsgEl = this.elements.upiIdErrorMessage; // Element to show validation/lookup errors

      // Ensure necessary elements for displaying results exist
      if (!lookupResultEl || !errorMsgEl) {
           console.warn("PaymentProcessor: UPI lookup result or error message elements not found. UPI lookup feedback disabled.");
           return;
      }

      // Clear any previously displayed messages or results
      lookupResultEl.style.display = 'none';
      errorMsgEl.style.display = 'none';
      lookupResultEl.textContent = '';
      errorMsgEl.textContent = '';

      // Perform basic client-side format validation first
      if (!upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
          // If format is invalid, display an error message
          errorMsgEl.textContent = "Invalid UPI ID format.";
          errorMsgEl.style.display = 'block';
          console.log("PaymentProcessor: Client-side UPI ID format validation failed.");
          return; // Stop the lookup process
      }

      // Prevent multiple simultaneous lookups if a lookup is already in progress
      if (this.state.isUpiLookingUp) {
           console.log("PaymentProcessor: Already performing UPI lookup. Skipping.");
           return;
      }

      // Set state to indicate that a lookup is in progress
      this.state.isUpiLookingUp = true;
      // Show a loading indicator or message
      lookupResultEl.textContent = "Verifying UPI ID...";
      lookupResultEl.style.color = this.elements.upiIdLookupResult.style.color; // Maintain default color or set a loading color
      lookupResultEl.style.display = 'block';
      console.log(`PaymentProcessor: Starting simulated lookup for UPI ID: ${upiId}`);


      try {
          // --- CLIENT-SIDE SIMULATION START ---
          // Simulate a network delay to mimic an API call to a backend service
          await new Promise(resolve => setTimeout(resolve, this.config.upiLookupDelay));

          // Simulate different outcomes based on the entered UPI ID (for demonstration)
          let simulatedName = null;
          let simulatedError = null;

          // Check against simulated valid IDs (case-insensitive comparison for lookup)
          const lowerUpiId = upiId.toLowerCase();
          const foundSimulatedId = this.config.upiLookupSimulatedValidIds.find(id => id.toLowerCase() === lowerUpiId);

          if (foundSimulatedId) {
              // If the ID matches a simulated valid ID, get the corresponding name
              simulatedName = this.config.upiLookupSimulatedNames[foundSimulatedId.toLowerCase()] || 'Verified User'; // Default name if specific name not defined
              console.log(`PaymentProcessor: Simulated lookup success for ${upiId}. Found name: ${simulatedName}`);
          } else if (upiId.toLowerCase() === this.config.upiLookupSimulatedErrorId.toLowerCase()) {
               // If the ID matches a simulated error ID, simulate an error
               simulatedError = "UPI ID lookup failed. ID not found.";
               console.log(`PaymentProcessor: Simulated lookup failure for ${upiId}.`);
          } else {
               // For any other format-valid ID not in the simulated list, simulate verification but no specific name
               simulatedName = "Verified UPI ID"; // Generic success message
               console.log(`PaymentProcessor: Simulated generic lookup success for ${upiId}.`);
          }
          // --- CLIENT-SIDE SIMULATION END ---


          // Based on the simulated result, update the UI
          if (simulatedError) {
              errorMsgEl.textContent = simulatedError; // Display the error message
              errorMsgEl.style.display = 'block';
              lookupResultEl.style.display = 'none'; // Hide the loading/result message
               errorMsgEl.setAttribute('role', 'alert'); // Set role for accessibility
               lookupResultEl.removeAttribute('role'); // Remove role from other message

          } else if (simulatedName) {
               // Display the verified name or success message
               lookupResultEl.textContent = `Verified: ${this.capitalizeWords(simulatedName)}`;
               lookupResultEl.style.color = '#2ecc71'; // Use a success color (e.g., green)
               lookupResultEl.style.display = 'block';
               errorMsgEl.style.display = 'none'; // Hide any error message
               lookupResultEl.setAttribute('role', 'status'); // Set role for accessibility
               errorMsgEl.removeAttribute('role'); // Remove role from other message

          } else {
               // Should not happen with current simulation logic, but as a fallback
               errorMsgEl.textContent = "Could not verify UPI ID.";
               errorMsgEl.style.display = 'block';
               lookupResultEl.style.display = 'none';
               errorMsgEl.setAttribute('role', 'alert');
               lookupResultEl.removeAttribute('role');
          }

      } catch (error) {
          // Catch any unexpected errors during the simulation (e.g., timeout issues)
          console.error("PaymentProcessor: An error occurred during simulated UPI lookup:", error);
          errorMsgEl.textContent = "Error verifying UPI ID."; // Generic error message
          errorMsgEl.style.display = 'block';
          lookupResultEl.style.display = 'none'; // Hide loading/result
           errorMsgEl.setAttribute('role', 'alert');
           lookupResultEl.removeAttribute('role');
      } finally {
          // Reset the lookup state after the process is complete (whether success or failure)
          this.state.isUpiLookingUp = false;
          console.log("PaymentProcessor: UPI lookup simulation finished.");
      }
  }


   /**
    * Generates or updates the QR code image for UPI Scan & Pay based on the current total amount.
    * Requires the QRCode.js library to be loaded in the HTML.
    */
   updateQRCode() {
       const { qrCodeDiv } = this.elements; // Get the container for the QR code
       const { totalAmount } = this.state; // Get the calculated total amount
       // Get necessary configuration details for the UPI deep link
       const { merchantVPA, merchantName, qrCodeSize, currency, minAmount } = this.config;

       // Ensure the QR code container element exists
       if (!qrCodeDiv) {
           console.warn("PaymentProcessor: QR code div element (#upi-qr-code) not found. QR code generation disabled.");
           return;
       }

       // Clear any existing content inside the QR code container (previous QR or message)
       qrCodeDiv.innerHTML = "";

       // Check if the total amount is valid for generating a QR code
       if (totalAmount < minAmount) {
           // If amount is too low, display a message instead of a QR code
           qrCodeDiv.innerHTML = `<p class="upi-help">Enter a valid amount (minimum ${currency}${minAmount.toFixed(2)}) to generate QR code.</p>`;
           console.log("PaymentProcessor: Total amount too low for QR code generation.");
           return; // Stop the process
       }

       // Generate a basic transaction reference ID (improve with backend-generated ID in production)
       const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`; // Basic unique ID based on timestamp and random string

       // Construct the UPI deep link URL according to UPI protocol
       // This URL will be encoded into the QR code.
       const upiUrl = `upi://pay?pa=${encodeURIComponent(merchantVPA)}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=${currency}&tn=Payment%20for%20${encodeURIComponent(this.state.vehicleName)}%20rental&tr=${transactionId}`;

       // Generate the QR code using the QRCode.js library
       try {
            // Create a new QR code instance and draw it inside the qrCodeDiv
            new QRCode(qrCodeDiv, {
               text: upiUrl, // The data to encode in the QR code
               width: qrCodeSize, // Width of the QR code image
               height: qrCodeSize, // Height of the QR code image
               colorDark: "#000000", // Color of the QR code modules (dots)
               colorLight: "#ffffff", // Color of the QR code background
               correctLevel: QRCode.CorrectLevel.H, // Error correction level (H is highest)
           });
           console.log("PaymentProcessor: QR code generated successfully for amount:", totalAmount);

           // Add a descriptive text below the generated QR code image (if it doesn't exist)
           // This text instructs the user on how to use the QR code.
           let helpTextElement = qrCodeDiv.parentElement.querySelector('.upi-help:not(.upi-error-message)');
           // Check if a help text element already exists directly after the QR div and is not an error message
           if (!helpTextElement || helpTextElement.parentElement !== qrCodeDiv.parentElement || helpTextElement.classList.contains('upi-error-message')) {
                // If not found or is an error message, create a new help text element
                helpTextElement = document.createElement('p');
                helpTextElement.className = 'upi-help';
                helpTextElement.textContent = 'Use PhonePe, Google Pay, or any UPI app to scan and pay.';
                 // Insert the help text right after the QR code container div
                qrCodeDiv.parentElement.insertBefore(helpTextElement, qrCodeDiv.nextElementSibling);
           }


       } catch (error) {
           // Handle potential errors during QR code generation
           console.error("PaymentProcessor: Error generating QR code:", error);
           qrCodeDiv.innerHTML = '<p class="upi-help error">Error generating QR code. Please try again.</p>';
       }
   }

   /**
    * Handles the main payment form submission event.
    * Performs client-side validation and simulates payment processing.
    * **This is the entry point where you would initiate the process of sending**
    * **payment details to your backend server for real processing.**
    * @param {Event} e The submit event object.
    */
   async handlePaymentSubmission(e) {
       e.preventDefault(); // Prevent the browser's default form submission and page reload

       // Check if a payment process is already running to prevent duplicate submissions
       if (this.state.isProcessing) {
           console.log("PaymentProcessor: Payment already processing, preventing double submission.");
           return; // Exit the function if already processing
       }

       // Set state to indicate that the payment process has started
       this.state.isProcessing = true;
       // Show a loading state to the user (e.g., disable button, show spinner)
       this.showLoadingState(true);
       console.log("PaymentProcessor: Starting payment submission process...");

       // Determine the selected payment method based on the checked radio button
       const selectedMethod = this.elements.cardMethodRadio.checked ? "card" : "upi";
       console.log(`PaymentProcessor: Selected payment method: ${selectedMethod}`);

       try {
           // Step 1: Perform client-side validation of the form inputs
           const validationResult = this.validatePaymentForm(selectedMethod);
           if (!validationResult.isValid) {
               // If client-side validation fails, display the specific error message and stop the process
               this.showMessage(this.elements.paymentMessage, validationResult.message, "error");
               console.warn("PaymentProcessor: Client-side validation failed:", validationResult.message);
               return; // Exit the try block
           }
           console.log("PaymentProcessor: Client-side validation passed.");

           // --- Additional Pre-Submission Checks (Specific to UPI Simulation) ---
           // In a real UPI "Collect" flow (where user enters ID), you might need
           // to ensure the UPI ID lookup was successful and verified before submitting.
           if (selectedMethod === 'upi') {
               // Check if there's an active error message displayed below the UPI ID input
               if (this.elements.upiIdErrorMessage && this.elements.upiIdErrorMessage.style.display === 'block') {
                    const errorText = this.elements.upiIdErrorMessage.textContent;
                    // Throw an error if a UPI ID validation/lookup error is visible
                    throw new Error(`UPI ID error: ${errorText}. Please correct it.`);
               }
               // Check if the user entered a UPI ID but the lookup hasn't completed or failed without showing an error
               // This is a safeguard for the simulation; a real system would handle this flow differently.
               if (this.elements.upiId && this.sanitizeInput(this.elements.upiId.value).length > 0 &&
                   this.elements.upiIdLookupResult && this.elements.upiIdLookupResult.style.display === 'none' && !this.state.isUpiLookingUp) {
                   // If input has text but no result/error is shown and no lookup is active, something is wrong or lookup failed silently
                    console.warn("PaymentProcessor: UPI ID entered but not verified or lookup failed silently.");
                   // Decide if you want to allow submission or force verification
                   // throw new Error("Please wait for UPI ID verification to complete or enter a valid ID.");
               }
           }
           // --- End Additional Pre-Submission Checks ---


           // Step 2: **Initiate the real payment process via your backend**
           // This is the crucial part that needs to be replaced with actual code
           // that sends the necessary payment data to your server.

           console.log("PaymentProcessor: Simulating backend payment processing...");
           // In a real application:
           // 1. Collect all necessary payment data from the form (card details, UPI ID, amount, vehicle details, user info).
           // 2. **IMPORTANT:** If using card details, send them securely to your backend, ideally using a Payment Gateway's client-side SDK
           //    to create a token first (like Stripe Elements, PayPal Braintree). You send the token, NOT raw card details, to your backend.
           // 3. Send other payment details (total amount, vehicle info, rental days, selected method, UPI ID if applicable) to your backend API endpoint.
           // 4. Your backend receives this data.
           // 5. Your backend then securely communicates with your chosen Payment Gateway's server-side API.
           // 6. The Payment Gateway processes the transaction with the user's bank/UPI system.
           // 7. The Payment Gateway informs your backend of the transaction result (success/failure).
           // 8. Your backend updates your database (e.g., marks order as paid, records transaction details).
           // 9. Your backend sends a response back to this client-side JavaScript code indicating the final result.

           // **YOU CANNOT DIRECTLY TRANSFER MONEY TO A PERSONAL BANK ACCOUNT (like 6305333302@ibl) FROM THIS CLIENT-SIDE JAVASCRIPT.**
           // The money from the customer's account goes to your MERCHANT ACCOUNT via the Payment Gateway.
           // Payouts from your merchant account to your linked bank account are managed via your Payment Gateway's dashboard/APIs (server-side).


           // --- SIMULATION START ---
           // This is a placeholder for the actual API call to your backend.
           // Simulate a network request delay and backend processing time
           await this.simulatePaymentProcessing(); // Simulate a delay

           // Simulate the outcome of the payment process (replace with actual logic based on backend response)
           // This simulation randomly decides success or failure.
           const simulatedSuccess = Math.random() > 0.15; // 85% chance of success in this simulation

           if (!simulatedSuccess) {
                // Simulate a specific failure message from the backend/gateway
                // Replace with actual error message parsing from your backend's API response
                const simulatedErrorReason = Math.random() > 0.5 ? "Transaction declined by issuing bank." : "Payment gateway error. Please try again later.";
                throw new Error(`Payment failed. Reason: ${simulatedErrorReason}`);
           }
           // --- CLIENT-SIDE SIMULATION END ---


           // Step 3: Handle the result received from your backend (Success or Failure)
           // If you reach here in the try block, it means the simulated payment was successful.

           const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`; // Simulated Transaction ID

           // Display a success message to the user
           this.showMessage(
               this.elements.paymentMessage,
               `Payment successful for ${this.state.vehicleName} rental! Transaction ID: ${transactionId}`,
               "success",
               10000 // Show success message for 10 seconds
           );
           console.log("PaymentProcessor: Simulated Payment successful!");

           // Step 4: Clean up or navigate on success
           this.resetPaymentForm(); // Reset the form for a clean state
           // In a real app, you would typically redirect the user to a confirmation page:
           // setTimeout(() => { window.location.href = `/payment-success?transactionId=${transactionId}`; }, this.config.messageDuration);

       } catch (error) {
           // If any error occurred during validation or the simulated/actual payment process, catch it here.
           console.error("PaymentProcessor: Payment processing failed:", error);
           // Display the error message to the user
           this.showMessage(
               this.elements.paymentMessage,
               error.message || "An unexpected error occurred during payment. Please try again.",
               "error"
           );

       } finally {
           // This block always runs after try/catch, regardless of success or failure.
           // It's used for cleanup like resetting the loading state.
           this.state.isProcessing = false; // Reset the processing flag
           this.showLoadingState(false); // Reset the loading indicator on the button
           console.log("PaymentProcessor: Payment submission process finished.");
       }
   }

   /**
    * Performs client-side validation for the payment form inputs based on the selected method.
    * This is a basic check for format and presence. **It does NOT replace server-side validation**,
    * which is essential for security and data integrity before processing payments.
    * @param {'card'|'upi'} paymentMethod The selected payment method ('card' or 'upi').
    * @returns {{isValid: boolean, message?: string}} An object indicating if the form is valid and a message if not.
    */
   validatePaymentForm(paymentMethod) {
       const { rentalDays, billAmount, cardName, cardNumber, expMonth, expYear, cvv, upiId } = this.elements;
       const { minRentalDays, minAmount, currency } = this.config;

       // Validate Rental Days (should already be handled by input listener, but double check)
       const days = parseInt(rentalDays ? rentalDays.value : 0) || 0;
       if (days < minRentalDays) {
           return { isValid: false, message: `Rental days must be at least ${minRentalDays}.` };
       }

       // Validate Total Amount (should be calculated correctly, but double check min amount)
       const amount = parseFloat(billAmount ? billAmount.value : 0) || 0;
       if (amount < minAmount) {
           // This check might be redundant if updateBillAmount already prevents amounts < minAmount
           return { isValid: false, message: `Bill amount must be at least ${currency}${minAmount.toFixed(2)}.` };
       }
       // Ensure the calculated amount matches the displayed amount (basic integrity check)
       if (Math.abs(amount - this.state.totalAmount) > 0.01) { // Allow for small floating point differences
            console.warn("PaymentProcessor: Calculated amount does not match displayed amount!", this.state.totalAmount, amount);
            // Decide if this should be an error preventing submission or just a warning
           // return { isValid: false, message: "Internal amount calculation error. Please refresh." };
       }


       // Perform validation specific to the selected payment method
       if (paymentMethod === "card") {
           console.log("PaymentProcessor: Validating card details...");
           // Validate Card Details (Presence and basic format)
           const name = cardName ? this.sanitizeInput(cardName.value) : '';
           const number = cardNumber ? this.sanitizeInput(cardNumber.value).replace(/\s/g, '') : ''; // Remove spaces for validation
           const month = expMonth ? this.sanitizeInput(expMonth.value) : '';
           const year = expYear ? parseInt(expYear.value) : 0;
           const cvvValue = cvv ? this.sanitizeInput(cvv.value) : '';

           // Check if input elements actually exist before validating their values
           if (!cardName || !cardNumber || !expMonth || !expYear || !cvv) {
               console.error("PaymentProcessor: Card input elements not found for validation.");
               return { isValid: false, message: "Card form elements are missing." };
           }

           // Validate Cardholder Name: Must be present and reasonably long
           if (!name || name.length < 2) {
               return { isValid: false, message: "Please enter the valid name on the card." };
           }

           // Validate Card Number: Basic numeric and length check (13-19 digits typically). Does NOT check checksum (Luhn algorithm).
           if (!/^\d{13,19}$/.test(number)) {
                return { isValid: false, message: "Please enter a valid credit card number (13-19 digits, digits only)." };
           }

           // Validate Expiration Month: Must be a valid month name or number (1-12)
           if (!month || !/^(0?[1-9]|1[0-2]|[Jj]an(uary)?|[Ff]eb(ruary)?|[Mm]ar(ch)?|[Aa]pr(il)?|[Mm]ay|[Jj]un(e)?|[Jj]ul(y)?|[Aa]ug(ust)?|[Ss]ep(tember)?|[Oo]ct(ober)?|[Nn]ov(ember)?|[Dd]ec(ember)?)$/i.test(month)) {
               return { isValid: false, message: "Please enter a valid expiration month (e.g., January or 01)." };
           }

           // Validate Expiration Year: Must be a number, current year or in the future (up to a reasonable limit)
           const currentYear = new Date().getFullYear();
           if (!year || isNaN(year) || year < currentYear || year > currentYear + 20) { // Limit max year to prevent typos
               return { isValid: false, message: `Expiration year must be a number between ${currentYear} and ${currentYear + 20}.` };
           }

           // Validate Expiration Date (Month and Year Combination): Ensure the card has not expired
           const enteredMonthNumber = parseInt(month); // Try parsing month as number first
           const monthNum = isNaN(enteredMonthNumber) ? this.getMonthNumber(month) : enteredMonthNumber; // Convert month name to number (1-12) if not already a number

           // Check if the expiration date is in the past
           if (year === currentYear && monthNum < (new Date().getMonth() + 1)) { // Compare with current month (0-indexed + 1)
               return { isValid: false, message: "Card has expired." };
           }


           // Validate CVV: Must be 3 or 4 digits
           if (!cvvValue || !/^\d{3,4}$/.test(cvvValue)) {
               return { isValid: false, message: "Please enter a valid CVV (3 or 4 digits)." };
           }

           console.log("PaymentProcessor: Card details client-side validation passed.");

       } else if (paymentMethod === "upi") {
           console.log("PaymentProcessor: Validating UPI details...");
           // UPI ID validation (optional field in this design, only validate format if entered)
           const upiValue = upiId ? this.sanitizeInput(upiId.value) : '';

           // If UPI ID was mandatory for submission, add this check:
           // if (!upiId || !upiValue) {
           //     return { isValid: false, message: "Please enter your UPI ID." };
           // }

           // If UPI ID is entered (even if optional), validate its format
           if (upiId && upiValue && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiValue)) {
                return { isValid: false, message: "Please enter a valid UPI ID format (e.g., yourname@bank)." };
           }

           // For UPI Scan & Pay (using QR code), no UPI ID input is required for submission.
           // If using UPI Collect (user enters ID), further server-side validation of the ID and lookup is critical.

           console.log("PaymentProcessor: UPI details client-side validation passed.");

       } else {
            // Should not happen if radio buttons are handled correctly
            console.error("PaymentProcessor: Unknown payment method selected for validation.");
            return { isValid: false, message: "Invalid payment method selected." };
       }

       // If all client-side checks for the selected method pass
       return { isValid: true };
   }

   /**
    * Helper function to convert a month name (or abbreviation) to its corresponding number (1-12).
    * Case-insensitive. Returns NaN for invalid input.
    * @param {string} monthName The month name or abbreviation (e.g., "January", "Jan", "01", "1").
    * @returns {number} The month number (1 for January, 12 for December), or NaN if the input is not a valid month.
    */
   getMonthNumber(monthName) {
       if (typeof monthName !== 'string') return NaN;
       const lowerMonth = monthName.toLowerCase().trim();
       // Check if it's a number first (e.g., "01", "12")
       const monthNum = parseInt(lowerMonth);
       if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
           return monthNum;
       }
       // Check against month names/abbreviations
       const months = {
           jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
           may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, september: 9,
           oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12
       };
       return months[lowerMonth] || NaN; // Return number or NaN if not found
   }


   /**
    * Simulates an asynchronous backend process, such as sending payment data to a server.
    * This method **needs to be completely replaced** with your actual JavaScript code
    * that makes an API call to your backend server for payment processing.
    * @returns {Promise<void>} A promise that resolves after a simulated delay.
    */
   simulatePaymentProcessing() {
       // Log to console to indicate simulation is running
       console.log("PaymentProcessor: Simulating backend payment processing...");
       // Return a Promise that resolves after a specified delay, mimicking an async network request
       return new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a 2-second processing time
   }

   /**
    * Displays a message to the user in the payment message area.
    * Applies appropriate styling based on message type (success/error/processing).
    * Uses the same styling classes expected by the UIManager's showMessage method.
    * @param {HTMLElement} messageEl The message element where the text will be displayed (this.elements.paymentMessage).
    * @param {string} message The message text content to display.
    * @param {'success'|'error'|''} type The type of message for styling ('success', 'error', or empty string for general/processing messages).
    * @param {number} [duration=this.config.messageDuration] The duration (in milliseconds) to show the message if it's a 'success' or 'error' type before hiding it.
    */
   showMessage(messageEl, message, type, duration = this.config.messageDuration) {
       // Ensure the message element exists before trying to manipulate it
       if (!messageEl) {
           console.warn("PaymentProcessor: Message element not provided or not found. Cannot display message:", message);
           return;
       }
       // Set the text content of the message element
       messageEl.textContent = message;

       // Reset any existing message-specific classes and add the base class
       // Assumes your CSS defines styles for '.form-message', '.form-message--success', '.form-message--error'
       // The refined CSS uses '.form-message' as the base class.
       messageEl.className = 'form-message'; // Reset class list to just 'form-message'

       // Add specific class based on the message type
       if (type === 'success') {
           messageEl.classList.add('form-message--success'); // Use the class from refined CSS
            messageEl.style.color = ''; // Let CSS handle color
       } else if (type === 'error') {
           messageEl.classList.add('form-message--error'); // Use the class from refined CSS
            messageEl.style.color = ''; // Let CSS handle color
       } else {
           // Default style for processing/info messages (optional, you might style .form-message directly)
            messageEl.style.color = '#333'; // Example default color if needed
       }
       // Ensure the message element is displayed
       messageEl.style.display = 'block';

       // Automatically hide the message after a delay if it's a final result (success or error)
       // Processing messages (type='') should typically remain visible until a final result is shown.
       if (type !== '') {
            // Clear any previous timeout set for this message element
            if (messageEl.dataset.hideTimeout) {
                clearTimeout(parseInt(messageEl.dataset.hideTimeout));
            }
            // Set a new timeout to hide the message
            const timeoutId = setTimeout(() => {
                messageEl.style.display = 'none';
            }, duration);
            // Store the timeout ID on the element itself so it can be cleared later if needed
            messageEl.dataset.hideTimeout = timeoutId.toString();
       } else {
           // For non-final messages (like 'Processing...'), ensure no hide timeout is pending
           if (messageEl.dataset.hideTimeout) {
               clearTimeout(parseInt(messageEl.dataset.hideTimeout));
               delete messageEl.dataset.hideTimeout; // Remove the data attribute
           }
       }
   }

   /**
    * Toggles the loading state indicator on the payment form's submit button.
    * Disables the button and changes its text while processing.
    * @param {boolean} isLoading True to show loading state, false to hide.
    */
   showLoadingState(isLoading) {
       const submitButton = this.elements.submitButton; // Use the stored submit button reference
       if (submitButton) {
           submitButton.disabled = isLoading; // Disable button to prevent clicks while processing
           // Change button text based on loading state
           submitButton.textContent = isLoading ? "Processing..." : "Pay Now";
           // Optional: Add/remove a CSS class for styling loading state (e.g., adding a spinner)
           // submitButton.classList.toggle('is-loading', isLoading);
       } else {
           console.warn("PaymentProcessor: Submit button not found to show loading state.");
       }
   }

   /**
    * Resets the payment form inputs and state after a successful submission.
    * Clears input values, resets state variables, and sets the default payment method view.
    */
   resetPaymentForm() {
       if (this.elements.paymentForm) {
           this.elements.paymentForm.reset(); // Use the native form reset method
           console.log("PaymentProcessor: Payment form reset.");

           // Reset state variables to their initial defaults or parsed values
           this.state.rentalDays = this.config.minRentalDays; // Reset rental days to minimum
           // Note: vehicleName, price, type should ideally come from URL again or context if needed
           this.state.totalAmount = 0; // Reset total amount

           // Reset UI elements to their initial visual state
           if (this.elements.rentalDays) this.elements.rentalDays.value = this.config.minRentalDays; // Reset input value
           if (this.elements.billAmount) this.elements.billAmount.value = '0.00'; // Reset total amount display
           if (this.elements.cardMethodRadio) { // Ensure card method is checked by default
                this.elements.cardMethodRadio.checked = true;
           }
           this.togglePaymentMethod('card'); // Show the card section as the default view and manage required fields

            // Clear UPI lookup messages and QR code on form reset
            if (this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
            if (this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';
            if (this.elements.qrCodeDiv) this.elements.qrCodeDiv.innerHTML = ""; // Clear QR code div
             // Remove the help text below the QR code if it exists
             const helpTextElement = this.elements.qrCodeDiv ? this.elements.qrCodeDiv.parentElement.querySelector('.upi-help:not(.upi-error-message)') : null;
              if (helpTextElement && helpTextElement.parentElement !== this.elements.qrCodeDiv) {
                helpTextElement.remove();
             }
       } else {
            console.warn("PaymentProcessor: Payment form not found for reset operation.");
       }
   }

   /**
    * Sanitizes an input string to prevent basic Cross-Site Scripting (XSS) attacks
    * by converting specific characters to their HTML entity equivalents. Also trims
    * leading and trailing whitespace.
    * @param {string} input The string to sanitize.
    * @returns {string} The sanitized string.
    */
   sanitizeInput(input) {
       // Return null, undefined, or non-strings directly or as empty string based on desired handling
       if (typeof input !== 'string') {
           // console.warn("PaymentProcessor: sanitizeInput received non-string value:", input);
           return input || ''; // Return empty string for null/undefined, or non-strings as is
       }
       // Map characters that should be replaced
       const map = {
           '&': '&amp;',
           '<': '&lt;',
           '>': '&gt;',
           '"': '&quot;',
           "'": '&#x27;', // Use HTML entity for single quote
           '/': '&#x2F;', // Use HTML entity for slash
       };
       // Regular expression to find any of the characters in the map, globally and case-insensitively
       const reg = /[&<>"'/]/ig;
       // Replace each found character using the map and return the result after trimming whitespace
       return input.replace(reg, (match)=>(map[match])).trim();
   }

   /**
    * Capitalizes the first letter of a single string.
    * @param {string} str The string to capitalize.
    * @returns {string} The capitalized string.
    */
   capitalize(str) {
       if (typeof str !== 'string' || str.length === 0) return "";
       // Return the first character capitalized, followed by the rest of the string
       return str.charAt(0).toUpperCase() + str.slice(1);
   }

   /**
    * Capitalizes the first letter of each word in a string.
    * Useful for formatting names.
    * @param {string} str The string to capitalize words in.
    * @returns {string} The string with the first letter of each word capitalized.
    */
   capitalizeWords(str) {
       if (typeof str !== 'string' || str.length === 0) return "";
       // Convert the entire string to lowercase first, then split into words by spaces,
       // map over each word to capitalize its first letter, and finally join the words back with spaces.
       return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
   }


  /**
   * Basic debounce function to limit the rate at which a function is called.
   * When the debounced function is called repeatedly, the actual function
   * is only executed after a specified delay has passed without any further calls.
   * Useful for event listeners like 'input' or 'resize'.
   * @param {Function} func The function to debounce.
   * @param {number} delay The delay in milliseconds before the function is executed.
   * @returns {Function} The new, debounced function.
   */
  debounce(func, delay) {
      let timeoutId; // Variable to store the timeout ID

      // Return a new function that will be the debounced version
      return (...args) => {
          // Clear any existing timeout whenever the debounced function is called
          clearTimeout(timeoutId);
          // Set a new timeout. The actual function 'func' will be called
          // after the 'delay' if the debounced function is not called again
          // within that delay. 'apply(this, args)' ensures 'func' is called
          // with the correct 'this' context and arguments.
          timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
  }

}

// =====================================================
// Application Initialization
// This section runs when the script is executed.
// Instantiate the necessary classes based on the page structure.
// =====================================================

// Initialize the UIManager for general page interactions.
// This class is relevant if the header, mobile menu, login/signup forms,
// parallax effects, or Swiper sliders are present on the page.
// Since the payment.html includes header and form modals, UIManager is relevant here.
const uiManager = new UIManager();


// Initialize the PaymentProcessor if the main payment form (#paymentForm) is present in the DOM.
// This class is specific to the payment page functionality.
// The PaymentProcessor's constructor includes a check (this.isPaymentPage) to ensure
// its initialization logic only runs when the payment form exists.
const paymentProcessor = new PaymentProcessor();

// Note: If PaymentProcessor and UIManager need to tightly interact (e.g., UIManager opens
// a payment modal and needs to trigger payment processing), you might pass instances
// or references between them during initialization. For this setup, they are
// largely independent except for potential element overlaps and the use of
// shared utility methods like sanitizeInput.