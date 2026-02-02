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
  // const contactForm = document.getElementById("contactForm");

  // if (contactForm) {
  //   contactForm.addEventListener("submit", function (e) {
  //     // Basic validation
  //     const name = document.getElementById("name").value.trim();
  //     const email = document.getElementById("email").value.trim();
  //     const phone = document.getElementById("phone").value.trim();
  //     const message = document.getElementById("message").value.trim();

  //     let isValid = true;

  //     // Reset previous error states
  //     document.querySelectorAll(".error-message").forEach((el) => el.remove());
  //     document
  //       .querySelectorAll(".form-group")
  //       .forEach((el) => el.classList.remove("error"));

  //     if (!name) {
  //       showError("name", "Please enter your full name");
  //       isValid = false;
  //     }
  //     if (!email || !isValidEmail(email)) {
  //       showError("email", "Please enter a valid email address");
  //       isValid = false;
  //     }
  //     if (!phone) {
  //       showError("phone", "Please enter your phone number");
  //       isValid = false;
  //     }
  //     if (!message) {
  //       showError("message", "Please enter your message");
  //       isValid = false;
  //     }

  //     if (!isValid) {
  //       e.preventDefault();
  //     } else {
  //       const successMsg = document.createElement("div");
  //       successMsg.className = "success-message";
  //       successMsg.textContent = "Thank you for your message! We will get back to you soon.";
  //       contactForm.appendChild(successMsg);
  //       contactForm.reset();
  //     }
  //   });
  // }

  // function showError(fieldId, message) {
  //   const field = document.getElementById(fieldId);
  //   const formGroup = field.closest(".form-group");
  //   formGroup.classList.add("error");

  //   const errorElement = document.createElement("div");
  //   errorElement.className = "error-message";
  //   errorElement.textContent = message;

  //   formGroup.appendChild(errorElement);
  // }

  // function isValidEmail(email) {
  //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return re.test(email);
  // }

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
