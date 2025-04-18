/**
 * Represents the main application manager for UI interactions and initializations.
 * Handles header, mobile menu, login/signup forms, and parallax effect.
 * This class is intended for the main landing page or overall site interactions.
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
          homeSection: document.getElementById('home'), // Get the whole section for parallax
          homeImg: document.querySelector('.home-img'),
          homeHeading: document.querySelector('.home .heading'),
          homeBtn: document.querySelector('.home .btn'),
          // Assuming you have similar structures for vehicles, featured, and reviews sliders
          vehicleSlider: document.querySelector('.vehicle .featured-slider'), // Used by Swiper
          featuredSlider: document.querySelector('.featured .featured-slider'), // Used by Swiper
          reviewsSlider: document.querySelector('.reviews .reviews-slider'), // Used by Swiper

          // Elements for signup form, if needed in this manager
          signupFormContainer: document.querySelector(".sign-form-container"),
          closeSignForm: document.querySelector("#close-sign-form"),
          signupLink: document.querySelector("#signupLink"),
          loginLink: document.querySelector("#loginLink"),
          loginForm: document.getElementById("loginForm"),
          signupForm: document.getElementById("signupForm"),
          loginMessage: document.getElementById("loginMessage"),
          signupMessage: document.getElementById("signupMessage"),
      };

      // Ensure DOM is fully loaded before initialization
      document.addEventListener('DOMContentLoaded', () => {
          this.init();
      });
  }

  /**
   * Main initialization function for UIManager.
   * Calls methods to set up listeners and components.
   */
  init() {
      console.log("UIManager initialized."); // Debug log
      this.setupEventListeners();
      this.initializeSwipers();
      this.setupParallax(); // Setup parallax effect
      this.addScrollEffectToHeader(); // Add header scroll effect
  }

  /**
   * Sets up all global event listeners for UIManager.
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
          console.warn("UIManager: Login button or form elements not found.");
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
          console.warn("UIManager: Menu button or navbar not found.");
      }

      // Close mobile menu on window scroll for desktop view or when scrolling
      window.addEventListener('scroll', () => {
           // Only close if menu is active and screen is larger than mobile breakpoint OR if scrolling
          if (this.elements.navbar.classList.contains('active') && window.innerWidth <= 991) { // Assuming 991px is the breakpoint
               // Or simply: if (this.elements.navbar.classList.contains('active')) {
              this.toggleMobileMenu(false); // Pass false to explicitly close
          }
          // Add header scroll effect
          this.handleHeaderScroll();
      });

      // Close login/signup forms if open when window is resized (optional)
      window.addEventListener('resize', () => {
           if (this.elements.loginFormContainer && this.elements.loginFormContainer.classList.contains('active') && window.innerWidth >= 991) {
               this.toggleForm('login', false); // Close login form on larger screens if open
           }
           if (this.elements.signupFormContainer && this.elements.signupFormContainer.classList.contains('active') && window.innerWidth >= 991) {
                this.toggleForm('signup', false); // Close signup form on larger screens if open
           }
           // Re-setup parallax on resize might be needed depending on implementation
           // this.setupParallax(); // Might be too heavy, test performance
      });

       // Handle click to show signup form from login form
       if (this.elements.signupLink) {
          this.elements.signupLink.addEventListener("click", (e) => {
              e.preventDefault();
              this.toggleForm("login", false);
              this.toggleForm("signup", true);
          });
       } else {
           console.warn("UIManager: Signup link not found.");
       }

       // Handle click to show login form from signup form
       if (this.elements.loginLink) {
          this.elements.loginLink.addEventListener("click", (e) => {
              e.preventDefault();
              this.toggleForm("signup", false);
              this.toggleForm("login", true);
          });
       } else {
           console.warn("UIManager: Login link not found.");
       }

       // Handle close button for signup form
       if (this.elements.closeSignForm) {
          this.elements.closeSignForm.addEventListener("click", () =>
              this.toggleForm("signup", false)
          );
       } else {
           console.warn("UIManager: Close signup form button not found.");
       }


       // Handle login and signup form submissions (simulated authentication)
       if (this.elements.loginForm) {
          this.elements.loginForm.addEventListener("submit", (e) =>
              this.handleAuthSubmission(e, 'login')
          );
       } else {
            console.warn("UIManager: Login form not found.");
       }
       if (this.elements.signupForm) {
           this.elements.signupForm.addEventListener("submit", (e) =>
              this.handleAuthSubmission(e, 'signup')
          );
       } else {
           console.warn("UIManager: Signup form not found.");
       }
  }

  /**
   * Toggles the visibility of login or signup forms containers.
   * Manages body scroll overflow.
   * @param {'login'|'signup'} formType The type of form to toggle.
   * @param {boolean} show True to show, false to hide.
   */
  toggleForm(formType, show) {
      const container = formType === "login" ? this.elements.loginFormContainer : this.elements.signupFormContainer;
      const otherContainer = formType === "login" ? this.elements.signupFormContainer : this.elements.loginFormContainer; // The other form container

      if (!container) return;

      if (show) {
          container.classList.add("active");
          if(otherContainer && otherContainer.classList.contains('active')) {
               otherContainer.classList.remove('active'); // Hide the other form if it's open
          }
          document.body.style.overflowY = 'hidden'; // Prevent scrolling when any form is open
      } else {
          container.classList.remove("active");
           // Only restore scrolling if *both* form containers are now closed
          if (!this.elements.loginFormContainer.classList.contains('active') && !this.elements.signupFormContainer.classList.contains('active')) {
               document.body.style.overflowY = 'auto';
          }
      }
       console.log(`${formType} form toggled: ${show ? 'shown' : 'hidden'}`);
  }


  /**
   * Toggles the visibility of the mobile navigation menu.
   * Also toggles the menu button icon.
   * @param {boolean|null} forceState Optional boolean to force the state (true for open, false for close).
   */
  toggleMobileMenu(forceState = null) {
      if (!this.elements.navbar || !this.elements.menuBtn) {
          console.warn("UIManager: Cannot toggle mobile menu, elements not found.");
          return;
      }
      const isActive = this.elements.navbar.classList.contains('active');
       if (forceState === true || (forceState === null && !isActive)) {
          this.elements.navbar.classList.add('active');
          this.elements.menuBtn.classList.add('fa-times'); // Change icon to 'X'
       } else if (forceState === false || (forceState === null && isActive)) {
          this.elements.navbar.classList.remove('active');
          this.elements.menuBtn.classList.remove('fa-times'); // Change icon back to bars
       }
       console.log(`Mobile menu toggled: ${this.elements.navbar.classList.contains('active') ? 'open' : 'closed'}`);
  }

   /**
    * Adds a 'scrolled' class to the header when the page is scrolled down.
    * This allows CSS to style the header differently when not at the top.
    */
   addScrollEffectToHeader() {
       const header = document.querySelector('.header');
       if (!header) {
           console.warn("UIManager: Header element not found for scroll effect.");
           return;
       }

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
   * Sets up the parallax effect for elements in the home section.
   * Uses a mousemove event listener to move elements relative to mouse position.
   */
  setupParallax() {
      if (!this.elements.homeSection || !this.elements.homeImg || !this.elements.homeHeading || !this.elements.homeBtn) {
           console.warn("UIManager: Home section elements for parallax not found.");
           return;
      }

      window.addEventListener('mousemove', (e) => {
          // Calculate movement relative to the center of the screen
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;

          const mouseX = e.pageX - centerX;
          const mouseY = e.pageY - centerY;

          // Apply transform based on mouse position and data-speed attribute
          const applyParallax = (element, speed) => {
              if (!element || speed === null || isNaN(speed)) return; // Check if element and valid speed exist
              // Adjust divisor for sensitivity - larger divisor means less movement
              const sensitivity = 1000; // You can adjust this value
              const x = (mouseX * speed) / sensitivity;
              const y = (mouseY * speed) / sensitivity;
              element.style.transform = `translate(${x}px, ${y}px)`; // Use translate for clarity
          };

          // Get speed from data-speed attributes and apply parallax
          applyParallax(this.elements.homeImg, parseFloat(this.elements.homeImg.getAttribute('data-speed')));
          applyParallax(this.elements.homeHeading, parseFloat(this.elements.homeHeading.getAttribute('data-speed')));
          applyParallax(this.elements.homeBtn, parseFloat(this.elements.homeBtn.getAttribute('data-speed')));
      });
       console.log("UIManager: Parallax mousemove listener attached.");
  }


  /**
   * Initializes all Swiper carousels/sliders found in the DOM.
   * Requires the Swiper library to be included in the HTML.
   */
  initializeSwipers() {
      // Ensure Swiper library is available globally
      if (typeof Swiper === 'undefined') {
          console.error("UIManager: Swiper library not found. Please ensure swiper-bundle.min.js is included in your HTML.");
          return;
      }
      console.log("UIManager: Swiper library detected. Initializing sliders...");

      // Initialize Vehicle Swiper
      if (this.elements.vehicleSlider) {
          new Swiper(this.elements.vehicleSlider, {
              grabCursor: true,
              loop: true,
              centeredSlides: true,
              spaceBetween: 20,
              pagination: {
                  el: '.vehicle .swiper-pagination', // Specific pagination container for this slider
                  clickable: true,
              },
              breakpoints: {
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  991: { slidesPerView: 3 },
              },
               // Add navigation arrows if desired (ensure corresponding HTML buttons exist)
               // navigation: {
               //     nextEl: '.vehicle .swiper-button-next',
               //     prevEl: '.vehicle .swiper-button-prev',
               // },
          });
           console.log("UIManager: Vehicle Swiper initialized.");
      } else {
           console.warn("UIManager: Vehicle slider element not found for Swiper initialization.");
      }

      // Initialize Featured Swiper
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
          console.warn("UIManager: Featured slider element not found for Swiper initialization.");
      }

      // Initialize Reviews Swiper
      if (this.elements.reviewsSlider) {
           new Swiper(this.elements.reviewsSlider, {
              grabCursor: true,
              loop: true,
              centeredSlides: true, // Maybe not centered for reviews? Adjust as needed.
              spaceBetween: 20,
               pagination: {
                  el: '.reviews .swiper-pagination', // Specific pagination container for this slider
                  clickable: true,
              },
               breakpoints: {
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  991: { slidesPerView: 3 },
              },
               // navigation: {
               //     nextEl: '.reviews .swiper-button-next',
               //     prevEl: '.reviews .swiper-button-prev',
               // },
          });
          console.log("UIManager: Reviews Swiper initialized.");
      } else {
          console.warn("UIManager: Reviews slider element not found for Swiper initialization.");
      }
  }

  /**
   * Handles simulated login and signup form submissions.
   * In a real app, this would involve sending data to a backend for authentication.
   * @param {Event} e The submit event.
   * @param {'login'|'signup'} formType The type of form being submitted ('login' or 'signup').
   */
   async handleAuthSubmission(e, formType) {
      e.preventDefault(); // Prevent default form submission and page reload

      const form = formType === 'login' ? this.elements.loginForm : this.elements.signupForm;
      const messageEl = formType === 'login' ? this.elements.loginMessage : this.elements.signupMessage;

       if (!form || !messageEl) {
           console.error(`UIManager: Form or message element not found for ${formType}.`);
           return;
       }

      // Show initial processing message
      this.showMessage(messageEl, 'Processing...', ''); // Use UIManager's showMessage

      // Basic validation (add more robust validation as needed)
      let isValid = true;
      let errorMessage = '';

      if (formType === 'login') {
          const usernameInput = form.querySelector('#loginUsername');
          const passwordInput = form.querySelector('#loginPassword');
           if (!usernameInput || !passwordInput) {
               isValid = false; errorMessage = "Form inputs not found.";
           } else {
               const username = this.sanitizeInput(usernameInput.value);
               const password = this.sanitizeInput(passwordInput.value);
               if (!username || !password) {
                   isValid = false;
                   errorMessage = 'Please fill in both username and password.';
               }
                // Add more login-specific validation if needed (e.g., format checks)
           }
      } else { // Signup form
          const emailInput = form.querySelector('#signupEmail');
          const nameInput = form.querySelector('#signupName');
          const usernameInput = form.querySelector('#signupUsername');
          const passwordInput = form.querySelector('#signupPassword');
          const confirmPasswordInput = form.querySelector('#signupConfirmPassword');

          if (!emailInput || !nameInput || !usernameInput || !passwordInput || !confirmPasswordInput) {
               isValid = false; errorMessage = "Form inputs not found.";
          } else {
              const email = this.sanitizeInput(emailInput.value);
              const name = this.sanitizeInput(nameInput.value);
              const username = this.sanitizeInput(usernameInput.value);
              const password = this.sanitizeInput(passwordInput.value);
              const confirmPassword = this.sanitizeInput(confirmPasswordInput.value);

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
               // Add more signup-specific validation (e.g., password strength, username availability check)
          }
      }

      if (!isValid) {
          this.showMessage(messageEl, errorMessage, 'error');
          return;
      }

      try {
          // Simulate an asynchronous authentication process (e.g., sending data to a server)
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

          // --- Real-world scenario: Send data to backend ---
          // Collect form data:
          // const formData = new FormData(form);
          // const jsonData = Object.fromEntries(formData.entries());

          // const response = await fetch('/api/auth/' + formType, { // Example API endpoint
          //     method: 'POST',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify(jsonData)
          // });
          // const result = await response.json();
          // if (!response.ok) {
          //     // Handle specific backend errors (e.g., user already exists, invalid credentials)
          //     throw new Error(result.message || `Authentication ${formType} failed.`);
          // }
          // --- End Real-world scenario ---


          // Simulated success
          if (formType === 'login') {
               this.showMessage(messageEl, 'Login successful! Redirecting...', 'success');
               // In a real app, you would handle session/token and redirect
               // setTimeout(() => { this.toggleForm('login', false); /* window.location.href = '/dashboard'; */ }, 1000);
               setTimeout(() => { this.toggleForm('login', false); console.log("Simulated Login Success!"); }, 1000); // Close form on success simulation
          } else { // Signup success
              this.showMessage(messageEl, 'Account created successfully! Please login.', 'success');
              // Optionally clear form and switch to login form
               form.reset();
               setTimeout(() => {
                   this.toggleForm('signup', false);
                   // Optionally show login form after signup success
                   // this.toggleForm('login', true);
                   console.log("Simulated Signup Success!");
               }, 1500);

          }

      } catch (error) {
          // Simulated or actual error handling
           console.error(`${formType} failed:`, error);
           this.showMessage(messageEl, error.message || `${formType} failed. Please try again.`, 'error');
      }
   }


  /**
   * Sanitizes input string to prevent basic XSS and trims whitespace.
   * @param {string} input The string to sanitize.
   * @returns {string} The sanitized string.
   */
  sanitizeInput(input) {
      if (typeof input !== 'string') return input; // Return non-strings directly
      const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '/': '&#x2F;',
      };
      const reg = /[&<>"'/]/ig;
      return input.replace(reg, (match)=>(map[match])).trim();
  }

  /**
   * Displays a message within a specific message element.
   * @param {HTMLElement} messageEl The element to display the message in.
   * @param {string} message The message text.
   * @param {'success'|'error'|''} type The type of message for styling (maps to CSS classes).
   * @param {number} [duration=5000] The duration (in ms) to show the message if it's success or error.
   */
  showMessage(messageEl, message, type, duration = 5000) {
       if (!messageEl) {
           console.warn("UIManager: Message element not provided or not found.");
           return;
       }
       messageEl.textContent = message;
       // Reset existing message classes and add the appropriate one
       // Assuming base message classes are 'message', 'message--success', 'message--error'
       messageEl.className = 'form-message'; // Use the base class from refined CSS

       if (type === 'success') {
           messageEl.classList.add('form-message--success');
       } else if (type === 'error') {
           messageEl.classList.add('form-message--error');
       }
       messageEl.style.display = 'block'; // Make the message visible

       // Hide the message after a delay if it's a final result (success or error)
       if (type !== '') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, duration);
       }
  }

  // --- Add more UIManager specific methods here as needed ---
  // handleContactFormSubmit() { ... }
  // handleVehicleFilter() { ... }
  // ... and so on
}

/**
* Represents the Payment specific functionalities.
* This class is intended to run on a dedicated payment page HTML file
* or be instantiated when a payment flow is initiated (e.g., in a modal).
*/
class PaymentProcessor {
   /**
    * Constructor for the PaymentProcessor class.
    * Initializes DOM elements, configuration, and state, and sets up event listeners.
    */
   constructor() {
       // DOM Elements specific to the payment page
       this.elements = {
          vehicleType: document.getElementById("vehicleType"),
          vehicleName: document.getElementById("vehicleName"),
          vehiclePrice: document.getElementById("vehiclePrice"), // This likely displays price per day
          rentalDays: document.getElementById("rentalDays"),
          billAmount: document.getElementById("bill-amount"), // This should be the input for the total calculated amount
          cardMethodRadio: document.getElementById("card-method"),
          upiMethodRadio: document.getElementById("upi-method"),
          cardSection: document.getElementById("card-section"),
          upiSection: document.getElementById("upi-section"),
          qrCodeDiv: document.getElementById("upi-qr-code"), // Container for QR code
          paymentForm: document.getElementById("paymentForm"), // The main payment form
          paymentMessage: document.getElementById("paymentMessage"), // Message area for payment results

          // Card form inputs
          cardName: document.getElementById("card-name"),
          cardNumber: document.getElementById("card-number"),
          expMonth: document.getElementById("exp-month"),
          expYear: document.getElementById("exp-year"),
          cvv: document.getElementById("cvv"),

           // UPI form inputs and elements for lookup result/error
           upiId: document.getElementById("upi-id"),
           upiIdLookupResult: null, // Element to show verified name
           upiIdErrorMessage: null, // Element to show specific UPI error
       };

       // Configuration
       this.config = {
           // NOTE: merchantVPA is for generating the QR code/link.
           // Real payment gateway integration would use different credentials/keys server-side.
          merchantVPA: "merchant@upi", // Example VPA for QR code (replace with real VPA for QR)
          merchantName: "Vroom Rentals", // Example name for QR code (replace with real name for QR)
          // IMPORTANT: 6305333302@ibl is your personal UPI ID.
          // You should NOT hardcode this or any personal banking details in client-side code.
          // Real payment processing involves sending money to a MERCHANT ACCOUNT
          // linked to a payment gateway, NOT directly to a personal UPI ID or bank account
          // from the client-side.
          // This field is ignored for actual payment simulation logic below.

          minRentalDays: 1,
          minAmount: 1, // Minimum amount for payment
          currency: "INR", // Currency code (e.g., USD, EUR, INR)
          qrCodeSize: 180, // Increased QR code size for better scanning

          // Message display duration
          messageDuration: 5000, // 5 seconds

          // UPI lookup simulation settings
          upiLookupDelay: 800, // Simulate lookup delay (milliseconds)
          upiLookupSimulatedValidIds: ['test@upi', 'success@bank', 'user123@vpa'], // Simulated valid IDs
      };

      // State
      this.state = {
          vehicleName: "",
          vehiclePricePerDay: 0, // Renamed for clarity
          vehicleType: "",
          rentalDays: 0,
          totalAmount: 0,
          isProcessing: false, // For payment processing submission
          isUpiLookingUp: false, // For active UPI ID lookup process
      };

      // Find the lookup result and error message elements dynamically
      // Assumes the structure is: input -> lookup-result-p -> error-message-p
      if (this.elements.upiId) {
           let nextSibling = this.elements.upiId.nextElementSibling;
           while(nextSibling) {
                if (nextSibling.classList && nextSibling.classList.contains('upi-lookup-result')) {
                     this.elements.upiIdLookupResult = nextSibling;
                } else if (nextSibling.classList && nextSibling.classList.contains('upi-error-message')) {
                     this.elements.upiIdErrorMessage = nextSibling;
                }
                // If we found both, we can stop
                if (this.elements.upiIdLookupResult && this.elements.upiIdErrorMessage) break;
                nextSibling = nextSibling.nextElementSibling;
           }

           // Optional: If elements were not found, create them (ensure your HTML is structured correctly instead)
           // Example (basic, assumes parentElement exists):
           // if (!this.elements.upiIdLookupResult) {
           //      this.elements.upiIdLookupResult = document.createElement('p');
           //      this.elements.upiIdLookupResult.className = 'upi-lookup-result';
           //      this.elements.upiId.parentElement.insertBefore(this.elements.upiIdLookupResult, this.elements.upiId.nextElementSibling);
           // }
           // if (!this.elements.upiIdErrorMessage) {
           //       this.elements.upiIdErrorMessage = document.createElement('p');
           //       this.elements.upiIdErrorMessage.className = 'upi-error-message';
           //       this.elements.upiId.parentElement.insertBefore(this.elements.upiIdErrorMessage, (this.elements.upiIdLookupResult || this.elements.upiId).nextElementSibling);
           // }
           // Apply initial styles if created dynamically or just ensure they have the right class
           if(this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
           if(this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';

      }


      // Check if we are on the payment page (by checking for payment form existence)
      this.isPaymentPage = !!this.elements.paymentForm;

      // Initialize PaymentProcessor only if on the payment page
      if (this.isPaymentPage) {
          document.addEventListener("DOMContentLoaded", () => {
             this.init();
          });
      } else {
          console.log("PaymentProcessor: Payment form not found. PaymentProcessor features disabled.");
      }
   }

   /**
    * Initializes the payment processor.
    * Parses URL parameters, sets up event listeners, renders vehicle details,
    * and updates the bill amount.
    */
   init() {
       console.log("PaymentProcessor initialized.");
       this.parseURLParams();
       this.renderVehicleDetails(); // Render details first
       this.setupEventListeners(); // Then setup listeners that might use these details
       this.updateBillAmount(); // Calculate initial amount and QR code

       // Ensure the correct section is shown based on initial radio state
       // Check if radios exist before accessing .checked
       if(this.elements.cardMethodRadio && this.elements.upiMethodRadio){
           this.togglePaymentMethod(this.elements.cardMethodRadio.checked ? 'card' : 'upi');
       } else {
           // Default to card view if radios not found
           this.togglePaymentMethod('card');
       }

       // Initial check for UPI ID if pre-filled (unlikely but good practice)
       if (this.elements.upiId && this.elements.upiId.value) {
            this.validateUpiIdAndFetchName(this.elements.upiId.value);
       }
   }

   /**
    * Parses URL parameters to extract vehicle details.
    */
   parseURLParams() {
       const urlParams = new URLSearchParams(window.location.search);
       this.state.vehicleName = this.sanitizeInput(urlParams.get("vehicle")) || "Unknown Vehicle";
       // Parse price per day, assume it's passed as 'price'
       this.state.vehiclePricePerDay = parseFloat(urlParams.get("price")) || 0;
       this.state.vehicleType = this.sanitizeInput(urlParams.get("type")) || "Unknown";
       this.state.rentalDays = parseInt(urlParams.get("days")) || this.config.minRentalDays; // Get initial days if passed
       if (this.elements.rentalDays) {
            const days = parseInt(urlParams.get("days"));
            // Set the input value, ensuring it's at least the minimum
            this.elements.rentalDays.value = (days && days >= this.config.minRentalDays) ? days : this.config.minRentalDays;
            this.state.rentalDays = parseInt(this.elements.rentalDays.value); // Update state based on the set value
       } else {
           console.warn("PaymentProcessor: Rental days input element not found for URL param initialization.");
       }
       console.log("PaymentProcessor: Parsed URL Params:", this.state);
   }

   /**
    * Sets up event listeners specific to the payment form.
    */
   setupEventListeners() {
       // Event listener for rental days input change
       if (this.elements.rentalDays) {
            this.elements.rentalDays.addEventListener(
                "input",
                // Use debounce to avoid excessive updates while typing
                this.debounce(() => {
                    const days = parseInt(this.elements.rentalDays.value);
                    // Update state only if it's a valid number, otherwise use min days
                    this.state.rentalDays = (days && days >= this.config.minRentalDays) ? days : this.config.minRentalDays;
                    console.log("PaymentProcessor: Rental days updated to", this.state.rentalDays);
                    this.updateBillAmount();
                }, 300)
            );
       } else {
           console.warn("PaymentProcessor: Rental days input element not found.");
       }


       // Event listeners for payment method radio buttons
       if (this.elements.cardMethodRadio) {
           this.elements.cardMethodRadio.addEventListener("change", () =>
               this.togglePaymentMethod("card")
           );
       }
       if (this.elements.upiMethodRadio) {
           this.elements.upiMethodRadio.addEventListener("change", () =>
               this.togglePaymentMethod("upi")
           );
       }
       if (!this.elements.cardMethodRadio || !this.elements.upiMethodRadio) {
           console.warn("PaymentProcessor: Payment method radio buttons not found.");
       }


       // Event listener for UPI ID input for live lookup simulation
       if (this.elements.upiId) {
          this.elements.upiId.addEventListener(
              "input",
              // Debounce the lookup to reduce requests while typing
              this.debounce(() => {
                   const upiId = this.sanitizeInput(this.elements.upiId.value);
                   if (upiId.length > 0) {
                        this.validateUpiIdAndFetchName(upiId);
                   } else {
                        // Clear previous results if the input is empty
                        if (this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
                        if (this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';
                   }
              }, 500) // Adjust debounce delay as needed
          );
           console.log("PaymentProcessor: UPI ID input listener added for lookup simulation.");
      } else {
           console.warn("PaymentProcessor: UPI ID input element not found. UPI lookup simulation disabled.");
      }


       // Event listener for the main payment form submission
       if (this.elements.paymentForm) {
            this.elements.paymentForm.addEventListener(
                "submit",
                this.handlePaymentSubmission.bind(this)
            );
             console.log("PaymentProcessor: Payment form submit listener added.");
       } else {
          console.error("PaymentProcessor: Payment form element not found. Payment submission cannot be handled.");
       }
   }

   /**
    * Renders the vehicle details on the payment page UI.
    */
   renderVehicleDetails() {
       if (this.elements.vehicleType) this.elements.vehicleType.textContent = this.capitalize(this.state.vehicleType);
       if (this.elements.vehicleName) this.elements.vehicleName.textContent = this.state.vehicleName;
       // Display price per day
       if (this.elements.vehiclePrice) this.elements.vehiclePrice.textContent = `${this.config.currency} ${this.state.vehiclePricePerDay.toFixed(2)}/Day`;

       console.log("PaymentProcessor: Vehicle details rendered.");
   }

   /**
    * Updates the total bill amount based on rental days and vehicle price.
    * Also updates the bill amount input (read-only) and triggers QR code update.
    */
   updateBillAmount() {
       const rentalDays = this.state.rentalDays; // Use state value which is updated by input listener
       const pricePerDay = this.state.vehiclePricePerDay;

       if (rentalDays >= this.config.minRentalDays && pricePerDay > 0) {
           this.state.totalAmount = pricePerDay * rentalDays;
       } else {
           this.state.totalAmount = 0; // Amount is 0 if days are invalid or price is 0
       }

       // Update the bill amount input field (read-only)
       if (this.elements.billAmount) {
            this.elements.billAmount.value = this.state.totalAmount.toFixed(2);
            console.log("PaymentProcessor: Bill amount updated to", this.state.totalAmount);
       } else {
          console.warn("PaymentProcessor: Bill amount input element (bill-amount) not found.");
       }

       // Update QR code if UPI method is selected and amount is valid
       if (this.elements.upiMethodRadio && this.elements.upiMethodRadio.checked) {
           this.updateQRCode();
       }
   }

   /**
    * Toggles the visibility of payment method sections (Card vs UPI).
    * Also manages the `required` attribute for inputs in the visible section.
    * @param {'card'|'upi'} method The payment method to display ('card' or 'upi').
    */
   togglePaymentMethod(method) {
       const isCard = method === "card";

       if (this.elements.cardSection) this.elements.cardSection.style.display = isCard ? "block" : "none";
       if (this.elements.upiSection) this.elements.upiSection.style.display = isCard ? "none" : "block";

       // Toggle required attribute for inputs in the respective sections
       if (this.elements.cardSection) this.toggleRequiredFields(this.elements.cardSection, isCard);
       if (this.elements.upiSection) this.toggleRequiredFields(this.elements.upiSection, !isCard); // UPI section inputs

       // Update QR code if switching to UPI and amount is valid
       if (!isCard) {
           this.updateQRCode();
       }
        // Clear UPI lookup messages when switching away from UPI
        if (isCard) {
            if (this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
            if (this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';
        }

       console.log(`PaymentProcessor: Switched to ${method} payment method.`);
   }

   /**
    * Sets or removes the 'required' attribute for input elements within a given section.
    * Excludes the UPI ID input as it's optional in this design.
    * @param {HTMLElement} section The section element containing inputs.
    * @param {boolean} required True to set required, false to remove.
    */
   toggleRequiredFields(section, required) {
       if (!section) return;
       // Select all inputs that should be required in this section, excluding optional UPI ID and the readonly bill amount
       const inputs = section.querySelectorAll('input:not([readonly]), select, textarea');
       inputs.forEach((input) => {
           // Only modify inputs based on their original required attribute or if they are part of a required set (like card details)
           // A more robust approach might use data attributes like data-required-group="card"
           if (section === this.elements.cardSection) {
                // For card section, all inputs (name, number, month, year, cvv) are required when visible
                input.required = required;
           } else if (section === this.elements.upiSection) {
                // For UPI section, the upi-id input is explicitly optional in this design.
                if (input.id === 'upi-id') {
                     input.required = false; // Explicitly keep optional
                } else {
                     // Other potential inputs in UPI section could be made required if needed
                     // input.required = required;
                }
           } else {
               // Default behavior for other sections
               input.required = required;
           }


            // You might want to clear values when hiding a section (optional)
            if (!required) {
                // input.value = ''; // Uncomment to clear inputs when section is hidden
            }
       });
       console.log(`PaymentProcessor: Required fields updated for section based on visibility.`);
   }


   /**
    * Generates or updates the QR code for UPI payment based on the current total amount.
    * Requires the QRCode.js library.
    */
   updateQRCode() {
       const { qrCodeDiv } = this.elements;
       const { totalAmount } = this.state;
       const { merchantVPA, merchantName, qrCodeSize, currency, minAmount } = this.config;

       if (!qrCodeDiv) {
           console.warn("PaymentProcessor: QR code div element not found.");
           return;
       }

       // Clear any existing QR code or message within the QR container
       qrCodeDiv.innerHTML = "";

       if (totalAmount < minAmount) {
           qrCodeDiv.innerHTML = `<p class="upi-help">Enter a valid amount (minimum ${currency}${minAmount.toFixed(2)}) to generate QR code.</p>`;
           console.log("PaymentProcessor: Total amount too low for QR code generation.");
           return;
       }

       // Basic transaction reference - improve with a unique ID from your backend in production
       const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
       // Construct the UPI deep link URL
       const upiUrl = `upi://pay?pa=${encodeURIComponent(merchantVPA)}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=${currency}&tn=Payment%20for%20${encodeURIComponent(this.state.vehicleName)}%20rental&tr=${transactionId}`;

       // Generate the QR code using QRCode.js
       try {
            new QRCode(qrCodeDiv, {
               text: upiUrl,
               width: qrCodeSize,
               height: qrCodeSize,
               colorDark: "#000000", // QR code dots color
               colorLight: "#ffffff", // QR code background color
               correctLevel: QRCode.CorrectLevel.H, // High error correction level
           });
           console.log("PaymentProcessor: QR code generated successfully.");

           // Add a descriptive text below the QR code if it doesn't exist
           let helpTextElement = qrCodeDiv.parentElement.querySelector('.upi-help:not(.upi-error-message)');
           if (!helpTextElement || helpTextElement.parentElement !== qrCodeDiv.parentElement) {
                helpTextElement = document.createElement('p');
                helpTextElement.className = 'upi-help';
                helpTextElement.textContent = 'Use PhonePe, Google Pay, or any UPI app to scan and pay.';
                 // Find a suitable place to insert it, e.g., right after the qrCodeDiv
                qrCodeDiv.parentElement.insertBefore(helpTextElement, qrCodeDiv.nextElementSibling);
           }


       } catch (error) {
           console.error("PaymentProcessor: Error generating QR code:", error);
           qrCodeDiv.innerHTML = '<p class="upi-help error">Error generating QR code. Please try again.</p>';
       }
   }

   /**
    * Handles the main payment form submission.
    * Validates the form and simulates payment processing.
    * This is where you would integrate with your backend payment API.
    * @param {Event} e The submit event.
    */
   async handlePaymentSubmission(e) {
       e.preventDefault(); // Prevent default form submission and page reload

       if (this.state.isProcessing) {
           console.log("PaymentProcessor: Payment already processing, preventing double submission.");
           return; // Prevent double submission
       }

       this.state.isProcessing = true;
       this.showLoadingState(true); // Indicate processing state to the user

       const selectedMethod = this.elements.cardMethodRadio.checked ? "card" : "upi";
       console.log(`PaymentProcessor: Attempting payment via ${selectedMethod}...`);

       try {
           // Perform client-side validation
           const validationResult = this.validatePaymentForm(selectedMethod);
           if (!validationResult.isValid) {
               // If validation fails, show the message and stop
               this.showMessage(this.elements.paymentMessage, validationResult.message, "error");
               console.warn("PaymentProcessor: Client-side validation failed:", validationResult.message);
               return; // Stop execution if validation fails
           }

           // --- Additional check for UPI lookup result before submission (Simulation based) ---
           if (selectedMethod === 'upi') {
               // In a real scenario, you'd check if the backend UPI validation (if done separately) was successful
               // For this simulation, we'll check if there's an error message displayed below the input
               if (this.elements.upiIdErrorMessage && this.elements.upiIdErrorMessage.style.display === 'block') {
                    const errorText = this.elements.upiIdErrorMessage.textContent;
                    throw new Error(`UPI ID error: ${errorText}`);
               }
               // If UPI ID is entered but no result/error is shown, it might still be looking up (in simulation)
               if (this.elements.upiId && this.sanitizeInput(this.elements.upiId.value).length > 0 &&
                   this.elements.upiIdLookupResult && this.elements.upiIdLookupResult.style.display === 'none') {
                   throw new Error("Please wait for UPI ID verification to complete or enter a valid ID.");
               }
           }
           // --- End Additional check ---


           // --- Simulate actual payment processing (REPLACE WITH REAL BACKEND API CALL) ---
           console.log("PaymentProcessor: Simulating backend payment processing...");
           // In a real application, you would send payment details (card token, UPI details, amount, etc.)
           // to your backend server. The backend then securely interacts with a Payment Gateway.
           // The Payment Gateway handles the transaction with the bank and informs your backend of the result.
           // Your backend then updates your database and informs the client (this JS code).

           // THIS IS WHERE YOUR BACKEND WOULD RECEIVE THE PAYMENT AND THEN TRIGGER
           // A TRANSFER TO YOUR MERCHANT ACCOUNT LINKED TO YOUR PAYMENT GATEWAY.
           // YOU CANNOT DIRECTLY SEND MONEY TO A PERSONAL BANK ACCOUNT (like 6305333302@ibl)
           // from this client-side JavaScript code for security reasons.

           await this.simulatePaymentProcessing(); // Simulate network delay and processing time

           // Simulate success scenario (replace with actual success check from your backend response)
           const isSuccess = Math.random() > 0.15; // 85% chance of success in this simulation
           if (!isSuccess) {
                // Simulate a specific payment gateway or bank error response
                throw new Error("Transaction failed. Reason: Insufficient funds.");
           }
           // --- END SIMULATION ---


           // Handle successful payment based on the actual response from your backend
           const transactionId = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`; // Simulated Transaction ID
           this.showMessage(
               this.elements.paymentMessage,
               `Payment successful for ${this.state.vehicleName} rental! Transaction ID: ${transactionId}`,
               "success",
               10000 // Show success message longer
           );
           console.log("PaymentProcessor: Simulated Payment successful!");

           // Reset the form or redirect on success
           this.resetPaymentForm();
           // In a real app, you might redirect to a confirmation page:
           // setTimeout(() => { window.location.href = `/payment-success?transactionId=${transactionId}`; }, this.config.messageDuration);

       } catch (error) {
           // Handle payment failure or validation errors
           console.error("PaymentProcessor: Payment processing failed:", error);
           // Display the error message received from validation or the simulated backend error
           this.showMessage(
               this.elements.paymentMessage,
               error.message || "An unexpected error occurred during payment. Please try again.",
               "error"
           );

       } finally {
           // Always reset processing state and loading indicator, regardless of success or failure
           this.state.isProcessing = false;
           this.showLoadingState(false);
           console.log("PaymentProcessor: Processing state reset.");
       }
   }

   /**
    * Performs client-side validation for the payment form inputs.
    * Does NOT replace server-side validation which is essential for security.
    * @param {'card'|'upi'} paymentMethod The selected payment method.
    * @returns {{isValid: boolean, message?: string}} Validation result object.
    */
   validatePaymentForm(paymentMethod) {
       const { rentalDays, billAmount, cardName, cardNumber, expMonth, expYear, cvv, upiId } = this.elements;
       const { minRentalDays, minAmount } = this.config;

       const days = parseInt(rentalDays ? rentalDays.value : 0) || 0;
       const amount = parseFloat(billAmount ? billAmount.value : 0) || 0;

       if (days < minRentalDays) {
           return { isValid: false, message: `Rental days must be at least ${minRentalDays}.` };
       }

       if (amount < minAmount) {
           return { isValid: false, message: `Bill amount must be at least ${this.config.currency}${minAmount.toFixed(2)}.` };
       }

       if (paymentMethod === "card") {
           // Basic card details validation (add more rigorous checks as needed)
           // Note: Card number validation should ideally include a checksum (Luhn algorithm)
           // and potentially format checks based on card type (Visa, MC, etc.)
           const name = cardName ? this.sanitizeInput(cardName.value) : '';
           const number = cardNumber ? this.sanitizeInput(cardNumber.value).replace(/\s/g, '') : '';
           const month = expMonth ? this.sanitizeInput(expMonth.value) : '';
           const year = expYear ? parseInt(expYear.value) : 0;
           const cvvValue = cvv ? this.sanitizeInput(cvv.value) : '';


           if (!name || name.length < 2) {
               return { isValid: false, message: "Please enter a valid cardholder name." };
           }
           if (!number || !/^\d{13,19}$/.test(number)) {
                return { isValid: false, message: "Please enter a valid card number (13-19 digits)." };
           }
           // Basic month validation (accepts month names or numbers)
           if (!month || !/^(0?[1-9]|1[0-2]|[Jj]an(uary)?|[Ff]eb(ruary)?|[Mm]ar(ch)?|[Aa]pr(il)?|[Mm]ay|[Jj]un(e)?|[Jj]ul(y)?|[Aa]ug(ust)?|[Ss]ep(tember)?|[Oo]ct(ober)?|[Nn]ov(ember)?|[Dd]ec(ember)?)$/i.test(month)) { // Added /i for case-insensitivity
               return { isValid: false, message: "Please enter a valid expiration month." };
           }
           // Basic year validation - ensure year is current or in the future (up to 20 years ahead)
           const currentYear = new Date().getFullYear();
           if (!year || year < currentYear || year > currentYear + 20) {
               return { isValid: false, message: `Expiration year must be between ${currentYear} and ${currentYear + 20}.` };
           }
           // Basic combined month/year logic (check if past expiration date)
           const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
           const enteredMonthNumber = parseInt(month); // Try parsing month as number first
           const monthNum = isNaN(enteredMonthNumber) ? this.getMonthNumber(month) : enteredMonthNumber; // Convert month name if not a number

           if (year === currentYear && monthNum < currentMonth) {
               return { isValid: false, message: "Card has expired." };
           }


           // Basic CVV validation (3 or 4 digits)
           if (!cvvValue || !/^\d{3,4}$/.test(cvvValue)) {
               return { isValid: false, message: "Please enter a valid CVV (3 or 4 digits)." };
           }

       } else if (paymentMethod === "upi") {
           // UPI ID validation (optional field in this design, only validate format if entered)
           const upiValue = upiId ? this.sanitizeInput(upiId.value) : '';
           if (upiId && upiValue && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiValue)) {
                return { isValid: false, message: "Please enter a valid UPI ID format (e.g., yourname@bank)." };
           }
           // If UPI ID was mandatory, add a check here: if (!upiValue) { return { isValid: false, message: "Please enter your UPI ID." }; }

       }

       // If all client-side checks pass
       return { isValid: true };
   }

   /**
    * Helper function to convert month name (or abbreviation) to number (1-12).
    * @param {string} monthName The month name or abbreviation.
    * @returns {number} The month number (1-12) or NaN if invalid.
    */
   getMonthNumber(monthName) {
       const months = {
           jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
           may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, september: 9,
           oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12
       };
       return months[monthName.toLowerCase()];
   }

   /**
    * Simulates an asynchronous payment processing request to a backend.
    * REPLACE THIS ENTIRE METHOD WITH YOUR ACTUAL API CALL TO YOUR BACKEND.
    * @returns {Promise<void>} A promise that resolves when simulation is complete.
    */
   simulatePaymentProcessing() {
       // Simulate a network request delay and backend processing time
       console.log("PaymentProcessor: Simulating backend payment processing...");
       return new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2-second processing delay
   }

   /**
    * Displays a message to the user in the payment message area.
    * Uses the same styling logic as UIManager's showMessage but for the payment message element.
    * @param {HTMLElement} messageEl The message element (this.elements.paymentMessage).
    * @param {string} message The message text.
    * @param {'success'|'error'|''} type The type of message for styling ('success', 'error', or empty for processing).
    * @param {number} [duration=this.config.messageDuration] The duration (in ms) to show the message if it's success or error.
    */
   showMessage(messageEl, message, type, duration = this.config.messageDuration) {
       if (!messageEl) {
           console.warn("PaymentProcessor: Message element not provided or not found.");
           return;
       }
       messageEl.textContent = message;
       // Reset existing message classes and add the appropriate one
       messageEl.className = 'message'; // Assuming a base 'message' class exists in CSS

       if (type === 'success') {
           messageEl.classList.add('success');
       } else if (type === 'error') {
           messageEl.classList.add('error');
       }
       messageEl.style.display = 'block'; // Make the message visible

       // Hide the message after a delay if it's a final result (success or error)
       if (type !== '') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, duration);
       }
   }

   /**
    * Toggles the loading state indicator on the submit button of the payment form.
    * Disables the button and changes text while loading.
    * @param {boolean} isLoading True to show loading state, false to hide.
    */
   showLoadingState(isLoading) {
       const submitButton = this.elements.paymentForm ? this.elements.paymentForm.querySelector('button[type="submit"]') : null;
       if (submitButton) {
           submitButton.disabled = isLoading; // Disable button while processing
           submitButton.textContent = isLoading ? "Processing..." : "Pay Now"; // Change button text
           // You could also add/remove a loading spinner CSS class here
           // submitButton.classList.toggle('loading', isLoading);
       }
   }

   /**
    * Resets the payment form after a successful submission.
    * Clears inputs, resets state, and sets default payment method.
    */
   resetPaymentForm() {
       if (this.elements.paymentForm) {
           this.elements.paymentForm.reset();
           console.log("PaymentProcessor: Payment form reset.");
           // Reset state variables related to inputs if necessary
           this.state.rentalDays = this.config.minRentalDays; // Reset to minimum days
           this.state.totalAmount = 0;
           // Reset UI elements to initial state
           if (this.elements.rentalDays) this.elements.rentalDays.value = this.config.minRentalDays;
           if (this.elements.billAmount) this.elements.billAmount.value = '';
           if (this.elements.cardMethodRadio) this.elements.cardMethodRadio.checked = true; // Default back to card
           this.togglePaymentMethod('card'); // Show card section and handle required fields

            // Clear UPI lookup messages and QR code on form reset
            if (this.elements.upiIdLookupResult) this.elements.upiIdLookupResult.style.display = 'none';
            if (this.elements.upiIdErrorMessage) this.elements.upiIdErrorMessage.style.display = 'none';
            if (this.elements.qrCodeDiv) this.elements.qrCodeDiv.innerHTML = ""; // Clear QR code
       }
   }

   /**
    * Sanitizes input string to prevent basic XSS and trims whitespace.
    * @param {string} input The string to sanitize.
    * @returns {string} The sanitized string.
    */
   sanitizeInput(input) {
       if (typeof input !== 'string') return input; // Return non-strings directly
       const map = {
           '&': '&amp;',
           '<': '&lt;',
           '>': '&gt;',
           '"': '&quot;',
           "'": '&#x27;',
           '/': '&#x2F;',
       };
       // Use a regular expression to find and replace characters
       const reg = /[&<>"'/]/ig;
       return input.replace(reg, (match)=>(map[match])).trim();
   }

   /**
    * Capitalizes the first letter of a string.
    * @param {string} str The string to capitalize.
    * @returns {string} The capitalized string.
    */
   capitalize(str) {
       if (typeof str !== 'string' || str.length === 0) return "";
       return str.charAt(0).toUpperCase() + str.slice(1);
   }

   /**
    * Capitalizes the first letter of each word in a string.
    * @param {string} str The string to capitalize.
    * @returns {string} The string with each word capitalized.
    */
   capitalizeWords(str) {
       if (typeof str !== 'string' || str.length === 0) return "";
       // Convert to lowercase first, then split by space, map to capitalize each word, and join back
       return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
   }


  /**
   * Basic debounce function to limit the rate of function execution.
   * Useful for input event listeners to avoid running logic too frequently.
   * @param {Function} func The function to debounce.
   * @param {number} delay The delay in milliseconds before the function is called.
   * @returns {Function} The debounced function.
   */
  debounce(func, delay) {
      let timeoutId;
      return (...args) => {
          // Clear the previous timeout if the function is called again within the delay
          clearTimeout(timeoutId);
          // Set a new timeout
          timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
  }

}

// --- Application Initialization ---

// Initialize the UIManager for general page interactions (header, menu, forms, parallax, swipers).
// Instantiate this class if you are on the main landing page or a page requiring these general UI features.
// const uiManager = new UIManager(); // <-- Uncomment this line if you are using this JS on your main page

// Initialize the PaymentProcessor if the payment form elements are present in the DOM.
// This is suitable if payment is on a dedicated page or if the payment form exists in a modal
// on the same page as other UI elements.
const paymentProcessor = new PaymentProcessor(); // <-- Keep this line for your payment page

// Note on multiple instances: If UIManager and PaymentProcessor are both running on the same page
// and there are overlapping elements (like login/signup forms), ensure their logic
// doesn't conflict. In this combined code, both classes might try to attach listeners
// to the same form elements. You might need to adjust the instantiation logic
// or combine related functionalities into a single class if they are tightly coupled.
// For this response, they are kept separate as requested, assuming they might run on
// different pages or that the UIManager handles initial form *toggling* and PaymentProcessor
// handles the form *submission* logic.