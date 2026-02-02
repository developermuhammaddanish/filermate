document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const toggle = document.getElementById("menu-toggle");
  const mobileMenuContainer = document.getElementById("mobile-menu-container");
  const body = document.body;

  if (toggle) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event from bubbling up

      const isOpen = mobileMenuContainer.classList.toggle("active");

      // Change hamburger icon
      if (isOpen) {
        toggle.innerHTML = "✕"; // Close icon
        toggle.style.color = "#000";
        toggle.style.borderColor = "#aaa";
        body.classList.add("menu-open");
        // Prevent body scrolling when menu is open
        body.style.overflow = "hidden";
      } else {
        toggle.innerHTML = "☰"; // Hamburger icon
        toggle.style.color = "#000";
        toggle.style.borderColor = "#ddd";
        body.classList.remove("menu-open");
        // Re-enable body scrolling
        body.style.overflow = "";
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        mobileMenuContainer.classList.contains("active") &&
        !event.target.closest(".navbar")
      ) {
        mobileMenuContainer.classList.remove("active");
        toggle.innerHTML = "☰";
        toggle.style.borderColor = "#ddd";
        body.classList.remove("menu-open");
        body.style.overflow = "";
      }
    });

    // Close menu when clicking a link
    document.querySelectorAll(".mobile-menu a").forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenuContainer.classList.remove("active");
        toggle.innerHTML = "☰";
        toggle.style.borderColor = "#ddd";
        body.classList.remove("menu-open");
        body.style.overflow = "";
      });
    });
  }

  // Highlight active menu item based on current page
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".navbar a");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    // Check if this link corresponds to the current page
    if (
      currentPath.endsWith(href) ||
      (currentPath === "/" && href === "index.html") ||
      (currentPath === "" && href === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Contact Form Validation
  const contactForm = document.getElementById("contactForm");
  const modal = document.getElementById("successModal");
  const modalBtn = document.getElementById("modalOkBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      // Basic validation
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      let isValid = true;

      // Reset previous error states
      document.querySelectorAll(".error-message").forEach((el) => el.remove());
      document
        .querySelectorAll(".form-group")
        .forEach((el) => el.classList.remove("error"));

      if (!name) {
        showError("name", "Please enter your full name");
        isValid = false;
      }
      if (!email || !isValidEmail(email)) {
        showError("email", "Please enter a valid email address");
        isValid = false;
      }
      if (!phone) {
        showError("phone", "Please enter your phone number");
        isValid = false;
      }
      if (!message) {
        showError("message", "Please enter your message");
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
      } else {
        // Let Netlify capture the submission first
        setTimeout(() => {
          // Show custom modal
          modal.style.display = "flex";
        }, 100);
      }
    });
  }

  // When user clicks OK
  modalBtn.addEventListener("click", function () {
    modal.style.display = "none";
    contactForm.reset();
  });

  // Helper functions
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest(".form-group");
    formGroup.classList.add("error");

    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;

    formGroup.appendChild(errorElement);
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });

          // Close mobile menu if open
          if (
            window.innerWidth <= 768 &&
            mobileMenuContainer.classList.contains("active")
          ) {
            mobileMenuContainer.classList.remove("active");
            toggle.innerHTML = "☰";
            toggle.style.borderColor = "#ddd";
            body.classList.remove("menu-open");
            body.style.overflow = "";
          }
        }
      }
    });
  });

  // Filter buttons active state for services page
  document.querySelectorAll(".bar-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") {
        e.preventDefault();
      }

      // Remove active class from all links
      document
        .querySelectorAll(".bar-link")
        .forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");
    });
  });
});

// Tax Calculator Functionality
document.addEventListener("DOMContentLoaded", function () {
  const taxCalculator = {
    // Tax slabs for 2024-2025
    slabs2024: [
      { min: 0, max: 600000, rate: 0, fixed: 0 },
      { min: 600001, max: 1200000, rate: 0.05, fixed: 0 },
      { min: 1200001, max: 2200000, rate: 0.15, fixed: 30000 },
      { min: 2200001, max: 3200000, rate: 0.25, fixed: 180000 },
      { min: 3200001, max: Infinity, rate: 0.35, fixed: 0 },
    ],

    // Tax slabs for 2025-2026
    slabs2025: [
      { min: 0, max: 600000, rate: 0, fixed: 0 },
      { min: 600001, max: 1200000, rate: 0.05, fixed: 0 },
      { min: 1200001, max: 2400000, rate: 0.1, fixed: 30000 },
      { min: 2400001, max: 3200000, rate: 0.15, fixed: 150000 },
      { min: 3200001, max: 4100000, rate: 0.3, fixed: 345000 },
      { min: 4100001, max: Infinity, rate: 0.35, fixed: 615000 },
    ],

    // Calculate tax based on income and year
    calculateTax: function (income, year) {
      let slabs = year === "2024-2025" ? this.slabs2024 : this.slabs2025;
      let tax = 0;
      let applicableSlab = null;

      // Find the applicable slab
      for (let slab of slabs) {
        if (income >= slab.min && income <= slab.max) {
          applicableSlab = slab;
          break;
        }
      }

      // If income is above the last slab (Infinity case)
      if (!applicableSlab && income > slabs[slabs.length - 1].min) {
        applicableSlab = slabs[slabs.length - 1];
      }

      if (applicableSlab) {
        if (applicableSlab.rate === 0) {
          tax = 0;
        } else {
          // Calculate tax based on slab
          const excess = income - applicableSlab.min;
          tax = applicableSlab.fixed + excess * applicableSlab.rate;
        }
      }

      // Round to nearest whole number
      tax = Math.round(tax);

      return {
        tax: tax,
        netIncome: income - tax,
        effectiveRate: income > 0 ? ((tax / income) * 100).toFixed(2) : 0,
        slab: applicableSlab,
        year: year,
      };
    },

    // Format number with commas
    formatNumber: function (num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Display results
    displayResults: function (results) {
      const resultsContainer = document.getElementById("calculator-results");
      const income = parseInt(document.getElementById("annual-income").value);

      // Create results HTML
      const resultsHTML = `
        <div class="results-display" id="results-display">
          <div class="result-summary">
            <div>Your Estimated Tax Liability</div>
            <div class="tax-amount">PKR ${this.formatNumber(results.tax)}</div>
            <div>for Tax Year ${results.year}</div>
          </div>
          
          <div class="result-details">
            <div class="result-item">
              <span class="result-label">Annual Income</span>
              <span class="result-value">PKR ${this.formatNumber(income)}</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Tax Amount</span>
              <span class="result-value">PKR ${this.formatNumber(results.tax)}</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Net Income After Tax</span>
              <span class="result-value">PKR ${this.formatNumber(results.netIncome)}</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Effective Tax Rate</span>
              <span class="result-value">${results.effectiveRate}%</span>
            </div>
            
            <div class="result-item">
              <span class="result-label">Tax Year</span>
              <span class="result-value">${results.year}</span>
            </div>
          </div>
          
          <div class="calculator-note" style="margin-top: 20px;">
            <p><i class="fas fa-calculator"></i> This is an estimate. Actual tax may vary based on deductions, allowances, and other factors. Consult a tax professional for accurate calculation.</p>
          </div>
        </div>
      `;

      // Replace content
      resultsContainer.innerHTML = resultsHTML;

      // Show results with animation
      setTimeout(() => {
        document.getElementById("results-display").style.display = "block";
      }, 10);
    },

    // Show error message
    showError: function (message) {
      const resultsContainer = document.getElementById("calculator-results");
      resultsContainer.innerHTML = `
        <div class="results-display" style="display: block;">
          <div class="calculator-note" style="background-color: #f8d7da; border-color: #dc3545;">
            <p><i class="fas fa-exclamation-circle" style="color: #dc3545;"></i> ${message}</p>
          </div>
        </div>
      `;
    },

    // Initialize calculator
    // Initialize calculator
    // Initialize calculator - SIMPLER VERSION
    init: function () {
      const calculateBtn = document.getElementById("calculate-tax");
      const incomeInput = document.getElementById("annual-income");
      const yearSelect = document.getElementById("tax-year");
      const slabs2024 = document.getElementById("slabs-2024");
      const slabs2025 = document.getElementById("slabs-2025");

      // Store raw value
      incomeInput.dataset.rawValue = "";

      // Format on blur (when user leaves the field)
      incomeInput.addEventListener("blur", function () {
        let value = this.value.replace(/[^0-9]/g, "");
        if (value) {
          const numValue = parseInt(value);
          if (!isNaN(numValue)) {
            this.value = numValue.toLocaleString("en-US");
            this.dataset.rawValue = value;
          }
        }
      });

      // Remove formatting on focus for easier editing
      incomeInput.addEventListener("focus", function () {
        let rawValue = this.dataset.rawValue;
        if (rawValue) {
          this.value = rawValue;
        }
      });

      // Calculate tax when button is clicked
      calculateBtn.addEventListener("click", () => {
        // Get the raw numeric value
        let incomeValue =
          incomeInput.dataset.rawValue ||
          incomeInput.value.replace(/[^0-9]/g, "");
        const selectedYear = yearSelect.value;

        // Validation
        if (!incomeValue || incomeValue === "0") {
          this.showError("Please enter a valid annual income amount.");
          return;
        }

        const income = parseInt(incomeValue);

        if (income < 0) {
          this.showError(
            "Income cannot be negative. Please enter a positive amount.",
          );
          return;
        }

        if (income > 100000000) {
          // 100 million limit
          this.showError(
            "Income amount is too high. Please enter a valid amount.",
          );
          return;
        }

        // Calculate tax
        const results = this.calculateTax(income, selectedYear);

        // Display results
        this.displayResults(results);
      });

      // Allow Enter key to calculate
      incomeInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          calculateBtn.click();
        }
      });

      // Update tax slabs display when year changes
      yearSelect.addEventListener("change", function () {
        if (this.value === "2024-2025") {
          slabs2024.classList.add("active");
          slabs2025.classList.remove("active");
        } else {
          slabs2024.classList.remove("active");
          slabs2025.classList.add("active");
        }
      });

      // Add year toggle buttons
      this.addYearToggle();
    },

    // Add year toggle buttons for better UX
    addYearToggle: function () {
      const yearSelect = document.getElementById("tax-year");
      const taxSlabsInfo = document.querySelector(".tax-slabs-info");

      // Create toggle buttons
      const toggleHTML = `
        <div class="year-toggle">
          <button class="year-btn active" data-year="2024-2025">2024-2025</button>
          <button class="year-btn" data-year="2025-2026">2025-2026</button>
        </div>
      `;

      // Insert before the first h3
      const firstH3 = taxSlabsInfo.querySelector("h3");
      firstH3.insertAdjacentHTML("afterend", toggleHTML);

      // Add event listeners to toggle buttons
      const yearBtns = taxSlabsInfo.querySelectorAll(".year-btn");
      yearBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          // Update active state
          yearBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          // Update select and trigger change
          const year = btn.getAttribute("data-year");
          yearSelect.value = year;
          yearSelect.dispatchEvent(new Event("change"));
        });
      });
    },
  };

  // Initialize the calculator
  taxCalculator.init();
});
