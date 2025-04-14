class PaymentProcessor {
    constructor() {
      // DOM Elements
      this.elements = {
        vehicleType: document.getElementById("vehicleType"),
        vehicleName: document.getElementById("vehicleName"),
        vehiclePrice: document.getElementById("vehiclePrice"),
        rentalDays: document.getElementById("rentalDays"),
        billAmount: document.getElementById("bill-amount"),
        cardMethod: document.getElementById("card-method"),
        upiMethod: document.getElementById("upi-method"),
        cardSection: document.getElementById("card-section"),
        upiSection: document.getElementById("upi-section"),
        qrCodeDiv: document.getElementById("upi-qr-code"),
        paymentForm: document.getElementById("paymentForm"),
        paymentMessage: document.getElementById("paymentMessage"),
        loginBtn: document.querySelector("#login .btn"),
        loginFormContainer: document.querySelector(".login-form-container"),
        signupFormContainer: document.querySelector(".sign-form-container"),
        closeLoginForm: document.querySelector("#close-login-form"),
        closeSignForm: document.querySelector("#close-sign-form"),
        signupLink: document.querySelector("#signupLink"),
        loginLink: document.querySelector("#loginLink"),
        loginForm: document.getElementById("loginForm"),
        signupForm: document.getElementById("signupForm"),
        loginMessage: document.getElementById("loginMessage"),
        signupMessage: document.getElementById("signupMessage"),
      };
  
      // Configuration
      this.config = {
        merchantVPA: "merchant@upi", // Replace with actual VPA in production
        merchantName: "Vroom Rentals",
        minRentalDays: 1,
        minAmount: 1,
        currency: "INR",
        qrCodeSize: 150,
      };
  
      // State
      this.state = {
        vehicleName: "",
        vehiclePrice: 0,
        vehicleType: "",
        totalAmount: 0,
        isProcessing: false,
      };
  
      // Initialize
      this.init();
    }
  
    init() {
      this.parseURLParams();
      this.setupEventListeners();
      this.renderVehicleDetails();
      this.updateBillAmount();
    }
  
    parseURLParams() {
      const urlParams = new URLSearchParams(window.location.search);
      this.state.vehicleName =
        this.sanitizeInput(urlParams.get("vehicle")) || "Unknown Vehicle";
      this.state.vehiclePrice = parseFloat(urlParams.get("price")) || 0;
      this.state.vehicleType =
        this.sanitizeInput(urlParams.get("type")) || "Unknown";
    }
  
    setupEventListeners() {
      // Payment Events
      this.elements.rentalDays.addEventListener(
        "input",
        this.debounce(this.updateBillAmount.bind(this), 300)
      );
  
      this.elements.cardMethod.addEventListener("change", () =>
        this.togglePaymentMethod("card")
      );
      this.elements.upiMethod.addEventListener("change", () =>
        this.togglePaymentMethod("upi")
      );
  
      this.elements.paymentForm.addEventListener(
        "submit",
        this.handleFormSubmission.bind(this)
      );
  
      // Login/Signup Events
      this.elements.loginBtn.addEventListener("click", () =>
        this.toggleForm("login", true)
      );
      this.elements.closeLoginForm.addEventListener("click", () =>
        this.toggleForm("login", false)
      );
      this.elements.closeSignForm.addEventListener("click", () =>
        this.toggleForm("signup", false)
      );
      this.elements.signupLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleForm("login", false);
        this.toggleForm("signup", true);
      });
      this.elements.loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleForm("signup", false);
        this.toggleForm("login", true);
      });
  
      this.elements.loginForm.addEventListener("submit", (e) =>
        this.handleLoginSubmission(e)
      );
      this.elements.signupForm.addEventListener("submit", (e) =>
        this.handleSignupSubmission(e)
      );
    }
  
    toggleForm(formType, show) {
      const container =
        formType === "login"
          ? this.elements.loginFormContainer
          : this.elements.signupFormContainer;
      container.classList.toggle("active", show);
    }
  
    async handleLoginSubmission(e) {
      e.preventDefault();
      const username = this.sanitizeInput(
        document.getElementById("loginUsername").value
      );
      const password = this.sanitizeInput(
        document.getElementById("loginPassword").value
      );
  
      try {
        if (!username || !password) {
          throw new Error("Please fill all fields.");
        }
  
        // Simulate login API call
        await this.simulateAuthProcessing();
        this.showMessage(
          "login",
          "Login successful! Welcome back.",
          "success"
        );
        this.elements.loginForm.reset();
        this.toggleForm("login", false);
      } catch (error) {
        this.showMessage("login", error.message || "Login failed.", "error");
      }
    }
  
    async handleSignupSubmission(e) {
      e.preventDefault();
      const email = this.sanitizeInput(
        document.getElementById("signupEmail").value
      );
      const name = this.sanitizeInput(
        document.getElementById("signupName").value
      );
      const username = this.sanitizeInput(
        document.getElementById("signupUsername").value
      );
      const password = this.sanitizeInput(
        document.getElementById("signupPassword").value
      );
      const confirmPassword = this.sanitizeInput(
        document.getElementById("signupConfirmPassword").value
      );
  
      try {
        if (!email || !name || !username || !password || !confirmPassword) {
          throw new Error("Please fill all fields.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("Please enter a valid email.");
        }
  
        // Simulate signup API call
        await this.simulateAuthProcessing();
        this.showMessage(
          "signup",
          "Account created successfully!",
          "success"
        );
        this.elements.signupForm.reset();
        this.toggleForm("signup", false);
      } catch (error) {
        this.showMessage(
          "signup",
          error.message || "Signup failed.",
          "error"
        );
      }
    }
  
    simulateAuthProcessing() {
      return new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
    }
  
    renderVehicleDetails() {
      const { vehicleType, vehicleName, vehiclePrice } = this.state;
      const { vehicleType: typeEl, vehicleName: nameEl, vehiclePrice: priceEl } =
        this.elements;
  
      typeEl.textContent = this.capitalize(vehicleType);
      nameEl.textContent = vehicleName;
      priceEl.textContent = `₹${vehiclePrice.toFixed(2)}/Day`;
    }
  
    updateBillAmount() {
      const days =
        parseInt(this.elements.rentalDays.value) || this.config.minRentalDays;
      this.state.totalAmount = this.state.vehiclePrice * days;
      this.elements.billAmount.value = this.state.totalAmount.toFixed(2);
      this.updateQRCode();
    }
  
    togglePaymentMethod(method) {
      const { cardSection, upiSection } = this.elements;
      const isCard = method === "card";
  
      cardSection.style.display = isCard ? "block" : "none";
      upiSection.style.display = isCard ? "none" : "block";
  
      this.toggleRequiredFields(cardSection, isCard);
      this.toggleRequiredFields(upiSection, !isCard);
  
      if (!isCard) {
        this.updateQRCode();
      }
    }
  
    toggleRequiredFields(section, required) {
      const inputs = section.querySelectorAll('input:not([id="upi-id"])');
      inputs.forEach((input) => {
        input.required = required;
      });
    }
  
    updateQRCode() {
      const { qrCodeDiv } = this.elements;
      const { totalAmount } = this.state;
      const { merchantVPA, merchantName, qrCodeSize, currency } = this.config;
  
      qrCodeDiv.innerHTML = "";
  
      if (totalAmount < this.config.minAmount) {
        qrCodeDiv.innerHTML =
          '<p class="upi-help">Enter a valid amount (₹1 or more) to generate QR code.</p>';
        return;
      }
  
      const transactionId = `TXN${Date.now()}`;
      const upiUrl = `upi://pay?pa=${encodeURIComponent(
        merchantVPA
      )}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(
        2
      )}&cu=${currency}&tn=Payment%20for%20${encodeURIComponent(
        this.state.vehicleName
      )}&tr=${transactionId}`;
  
      new QRCode(qrCodeDiv, {
        text: upiUrl,
        width: qrCodeSize,
        height: qrCodeSize,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  
    async handleFormSubmission(e) {
      e.preventDefault();
      if (this.state.isProcessing) return;
  
      this.state.isProcessing = true;
      this.showLoadingState(true);
  
      const paymentMethod = document.querySelector(
        'input[name="payment-method"]:checked'
      ).value;
  
      try {
        const validationResult = await this.validateForm(paymentMethod);
        if (!validationResult.isValid) {
          throw new Error(validationResult.message);
        }
  
        // Simulate payment processing (replace with actual API call)
        await this.simulatePaymentProcessing();
  
        this.showMessage(
          "payment",
          `Payment successful for ${this.state.vehicleName}!`,
          "success"
        );
        this.resetForm();
      } catch (error) {
        this.showMessage(
          "payment",
          error.message || "Payment failed. Please try again.",
          "error"
        );
      } finally {
        this.state.isProcessing = false;
        this.showLoadingState(false);
      }
    }
  
    async validateForm(paymentMethod) {
      const { rentalDays, billAmount } = this.elements;
      const days = parseInt(rentalDays.value) || this.config.minRentalDays;
      const amount = parseFloat(billAmount.value);
  
      if (days < this.config.minRentalDays) {
        return {
          isValid: false,
          message: "Rental days must be at least 1.",
        };
      }
  
      if (amount < this.config.minAmount) {
        return {
          isValid: false,
          message: "Bill amount must be at least ₹1.",
        };
      }
  
      if (paymentMethod === "card") {
        const cardName = this.sanitizeInput(
          document.getElementById("card-name").value
        );
        const cardNumber = this.sanitizeInput(
          document.getElementById("card-number").value.replace(/\s/g, "")
        );
        const expMonth = this.sanitizeInput(
          document.getElementById("exp-month").value
        );
        const expYear = parseInt(document.getElementById("exp-year").value);
        const cvv = this.sanitizeInput(document.getElementById("cvv").value);
  
        if (!cardName || cardName.length < 2) {
          return {
            isValid: false,
            message: "Please enter a valid cardholder name.",
          };
        }
  
        if (!/^\d{13,19}$/.test(cardNumber)) {
          return {
            isValid: false,
            message: "Please enter a valid card number (13-19 digits).",
          };
        }
  
        if (!expMonth || !/^[A-Za-z]+$/.test(expMonth)) {
          return {
            isValid: false,
            message: "Please enter a valid expiration month (e.g., January).",
          };
        }
  
        if (!expYear || expYear < new Date().getFullYear()) {
          return {
            isValid: false,
            message: `Expiration year must be ${new Date().getFullYear()} or later.`,
          };
        }
  
        if (!/^\d{3,4}$/.test(cvv)) {
          return {
            isValid: false,
            message: "Please enter a valid CVV (3-4 digits).",
          };
        }
      } else if (paymentMethod === "upi") {
        const upiId = this.sanitizeInput(
          document.getElementById("upi-id").value
        );
        if (upiId && !/[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/.test(upiId)) {
          return {
            isValid: false,
            message: "Please enter a valid UPI ID (e.g., yourname@upi).",
          };
        }
      }
  
      return { isValid: true };
    }
  
    simulatePaymentProcessing() {
      return new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay
    }
  
    showMessage(formType, message, type) {
      const messageEl =
        formType === "payment"
          ? this.elements.paymentMessage
          : formType === "login"
          ? this.elements.loginMessage
          : this.elements.signupMessage;
      messageEl.textContent = message;
      messageEl.style.color = type === "success" ? "#2ecc71" : "#e63946";
      messageEl.style.display = "block";
      setTimeout(() => {
        messageEl.style.display = "none";
      }, 5000);
    }
  
    showLoadingState(isLoading) {
      const { paymentForm, paymentMessage } = this.elements;
      paymentForm.querySelector(".submit-btn").disabled = isLoading;
      paymentForm.querySelector(".submit-btn").textContent = isLoading
        ? "Processing..."
        : "Pay Now";
      paymentMessage.style.display = "none";
    }
  
    resetForm() {
      this.elements.paymentForm.reset();
      this.elements.cardMethod.checked = true;
      this.togglePaymentMethod("card");
      this.updateBillAmount();
    }
  
    sanitizeInput(input) {
      if (!input) return "";
      return input.replace(/[<>&'"]/g, (char) => {
        const escapes = {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          "'": "&apos;",
          '"': "&quot;",
        };
        return escapes[char] || char;
      }).trim();
    }
  
    capitalize(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
  
    debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }
  }
  
  // Initialize on DOM load
  document.addEventListener("DOMContentLoaded", () => {
    new PaymentProcessor();
  });