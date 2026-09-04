/* =========================================================
   BLACK HORSE CAR RENTAL — script.js
   Vanilla JS only. No frameworks, no libraries.
   ========================================================= */

(function () {
  "use strict";

  const WHATSAPP_NUMBER = "919034350803"; // country code + number, no +/spaces

  /* 1. Sticky navbar effect on scroll */
  const navbar = document.getElementById("navbar");
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* 2. Mobile hamburger menu */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* 3. Smooth scrolling accounting for fixed navbar height */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 84;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    });
  });

  /* 4. Build a WhatsApp URL safely with encodeURIComponent */
  function buildWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    window.open(buildWhatsAppUrl(message), "_blank", "noopener");
  }

  document.querySelectorAll(".js-whatsapp-link").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const msg = this.getAttribute("data-msg") || "Hello Black Horse Car Rental, I have a query.";
      openWhatsApp(msg);
    });
  });

  /* 5. Quick Booking Card -> "Check Availability" */
  function formatDate(value) {
    if (!value) return "Not specified";
    const d = new Date(value + "T00:00:00");
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  }

  const checkAvailBtn = document.getElementById("checkAvailBtn");
  if (checkAvailBtn) {
    checkAvailBtn.addEventListener("click", () => {
      const car = document.getElementById("qbCar").value;
      const type = document.getElementById("qbType").value;
      const pickup = document.getElementById("qbPickup").value;
      const ret = document.getElementById("qbReturn").value;

      const message =
        `Hello Black Horse Car Rental,\n\n` +
        `I want to check availability.\n\n` +
        `Car: ${car}\n` +
        `Service: ${type}\n` +
        `Pickup Date: ${formatDate(pickup)}\n` +
        `Return Date: ${formatDate(ret)}\n\n` +
        `Please share availability and price.\n\n` +
        `Thank you.`;

      openWhatsApp(message);
    });
  }

  /* 6. Booking Modal */
  const modal = document.getElementById("bookingModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const bookingForm = document.getElementById("bookingForm");
  let lastFocusedEl = null;

  function openModal(prefill) {
    lastFocusedEl = document.activeElement;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    clearFormErrors();

    if (prefill) {
      if (prefill.car) document.getElementById("bfCar").value = prefill.car;
      if (prefill.type) document.getElementById("bfType").value = prefill.type;
    }

    const firstField = document.getElementById("bfName");
    if (firstField) firstField.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll(".js-open-modal").forEach((el) => {
    el.addEventListener("click", () => {
      const car = el.getAttribute("data-car") || "";
      const type = el.getAttribute("data-type") || "";
      openModal({ car, type });
    });
  });

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  /* 7. Booking form validation + WhatsApp message */
  const fields = {
    name: document.getElementById("bfName"),
    phone: document.getElementById("bfPhone"),
    car: document.getElementById("bfCar"),
    type: document.getElementById("bfType"),
    pickup: document.getElementById("bfPickup"),
    return: document.getElementById("bfReturn"),
    message: document.getElementById("bfMessage"),
  };

  function setFieldError(key, msg) {
    const field = fields[key];
    const errorEl = document.getElementById(`err-${key}`);
    if (field) field.closest(".form__field").classList.toggle("has-error", !!msg);
    if (errorEl) errorEl.textContent = msg || "";
  }

  function clearFormErrors() {
    Object.keys(fields).forEach((key) => setFieldError(key, ""));
  }

  function validateBookingForm() {
    let valid = true;

    if (!fields.name.value.trim()) {
      setFieldError("name", "Please enter your name.");
      valid = false;
    } else {
      setFieldError("name", "");
    }

    const phoneVal = fields.phone.value.trim();
    if (!phoneVal) {
      setFieldError("phone", "Please enter your phone number.");
      valid = false;
    } else if (!/^[0-9+\-\s]{10,15}$/.test(phoneVal)) {
      setFieldError("phone", "Please enter a valid phone number.");
      valid = false;
    } else {
      setFieldError("phone", "");
    }

    if (!fields.car.value) {
      setFieldError("car", "Please select a car.");
      valid = false;
    } else {
      setFieldError("car", "");
    }

    if (!fields.type.value) {
      setFieldError("type", "Please select a rental type.");
      valid = false;
    } else {
      setFieldError("type", "");
    }

    if (!fields.pickup.value) {
      setFieldError("pickup", "Please select a pickup date.");
      valid = false;
    } else {
      setFieldError("pickup", "");
    }

    if (!fields.return.value) {
      setFieldError("return", "Please select a return date.");
      valid = false;
    } else if (fields.pickup.value && fields.return.value < fields.pickup.value) {
      setFieldError("return", "Return date cannot be before pickup date.");
      valid = false;
    } else {
      setFieldError("return", "");
    }

    return valid;
  }

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateBookingForm()) return;

    const name = fields.name.value.trim();
    const phone = fields.phone.value.trim();
    const car = fields.car.value;
    const type = fields.type.value;
    const pickup = formatDate(fields.pickup.value);
    const ret = formatDate(fields.return.value);
    const extra = fields.message.value.trim();

    let message =
      `Hello Black Horse Car Rental,\n\n` +
      `I want to book a car.\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Car: ${car}\n` +
      `Service: ${type}\n` +
      `Pickup Date: ${pickup}\n` +
      `Return Date: ${ret}\n`;

    if (extra) {
      message += `Message: ${extra}\n`;
    }

    message += `\nPlease share availability and price.\n\nThank you.`;

    openWhatsApp(message);

    bookingForm.reset();
    closeModal();
  });

  /* 8. FAQ accordion — only one open at a time */
  const faqItems = document.querySelectorAll(".faq__item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq__question").setAttribute("aria-expanded", "false");
        other.querySelector(".faq__answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* 9. Scroll reveal animations (IntersectionObserver) */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* 10. Animated numbers in "How It Works" */
  const howNums = document.querySelectorAll(".how__num");
  if ("IntersectionObserver" in window && howNums.length) {
    const numObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            numObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    howNums.forEach((el) => numObserver.observe(el));
  } else {
    howNums.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      el.textContent = String(target).padStart(2, "0");
    });
  }

  function animateNumber(el) {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duration = 700;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = String(value).padStart(2, "0");
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = String(target).padStart(2, "0");
      }
    }
    requestAnimationFrame(tick);
  }

  /* 11. Current year in footer */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 12. Set sensible min dates on all date inputs */
  const todayStr = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    input.setAttribute("min", todayStr);
  });

})();
