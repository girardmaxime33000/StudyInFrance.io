(function () {
  "use strict";

  var body = document.body;

  // -------------------------------------------------------------------
  // Mobile navigation toggle
  // -------------------------------------------------------------------
  var navToggle = document.querySelector(".nav-toggle");

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // -------------------------------------------------------------------
  // FAQ accordion
  // -------------------------------------------------------------------
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function (open) {
        if (open !== item) {
          open.classList.remove("is-open");
          open.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !isOpen);
      question.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  // -------------------------------------------------------------------
  // Current year in footer
  // -------------------------------------------------------------------
  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------
  // Currency display toggle (EUR / INR).
  // Display only — every charge always runs in EUR via Stripe. Every
  // priced element carries data-eur and data-inr text; we just swap
  // which one is shown, and persist the choice per-viewer.
  // -------------------------------------------------------------------
  var currencyButtons = document.querySelectorAll("[data-currency-option]");
  var priceEls = document.querySelectorAll("[data-eur]");
  var CURRENCY_KEY = "sif-currency";

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* ignore — private browsing / blocked storage */
    }
  }

  function applyCurrency(currency) {
    priceEls.forEach(function (el) {
      var value = currency === "INR" ? el.getAttribute("data-inr") : el.getAttribute("data-eur");
      if (value) el.textContent = value;
    });
    currencyButtons.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-currency-option") === currency);
    });
    body.setAttribute("data-currency", currency);
    safeSet(CURRENCY_KEY, currency);
  }

  if (currencyButtons.length && priceEls.length) {
    currencyButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyCurrency(btn.getAttribute("data-currency-option"));
      });
    });
    applyCurrency(safeGet(CURRENCY_KEY) === "INR" ? "INR" : "EUR");
  }

  // -------------------------------------------------------------------
  // Eligibility checker (client-side only — a self-assessment starting
  // point, not an official visa or admission determination).
  //
  // This script only picks WHICH result block to reveal — the wording,
  // links, and CTA labels for every outcome live in the page's own
  // markup (one hidden [data-outcome="…"] block per outcome). That way
  // the same script works unchanged on the English and French pages,
  // and each page keeps its own correct relative links.
  // -------------------------------------------------------------------
  var checker = document.querySelector("[data-checker]");

  if (checker) {
    var steps = Array.prototype.slice.call(checker.querySelectorAll("[data-checker-step]"));
    var dots = Array.prototype.slice.call(checker.querySelectorAll("[data-checker-dot]"));
    var resultPanel = checker.querySelector("[data-checker-result]");
    var outcomeBlocks = resultPanel
      ? Array.prototype.slice.call(resultPanel.querySelectorAll("[data-outcome]"))
      : [];
    var restartBtn = checker.querySelector("[data-checker-restart]");
    var answers = {};
    var currentStep = 0;

    function showStep(index) {
      steps.forEach(function (step, i) {
        step.hidden = i !== index;
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
        dot.classList.toggle("is-done", i < index);
      });
      if (resultPanel) resultPanel.hidden = index < steps.length;
    }

    // Maps collected answers to one of the outcome keys used as
    // data-outcome values in the markup.
    function outcomeKey() {
      var stage = answers.stage;
      var guarantor = answers.guarantor;

      if (stage === "not-applied") return "not-applied";
      if (stage === "accepted-visa") return "accepted-visa";
      if (stage === "in-france") {
        return guarantor === "no" ? "in-france-no-guarantor" : "in-france-guarantor";
      }
      return "default"; // covers "application in progress" and any edge case
    }

    checker.addEventListener("click", function (event) {
      var optionBtn = event.target.closest("[data-checker-option]");
      if (optionBtn) {
        var step = optionBtn.closest("[data-checker-step]");
        answers[step.getAttribute("data-checker-step")] = optionBtn.getAttribute("data-checker-option");

        step.querySelectorAll("[data-checker-option]").forEach(function (btn) {
          btn.classList.toggle("is-selected", btn === optionBtn);
        });

        window.setTimeout(function () {
          currentStep += 1;
          if (currentStep >= steps.length && outcomeBlocks.length) {
            var key = outcomeKey();
            outcomeBlocks.forEach(function (block) {
              block.hidden = block.getAttribute("data-outcome") !== key;
            });
          }
          showStep(currentStep);
        }, 220);
        return;
      }

      if (event.target.closest("[data-checker-back]")) {
        currentStep = Math.max(0, currentStep - 1);
        showStep(currentStep);
      }
    });

    if (restartBtn) {
      restartBtn.addEventListener("click", function () {
        answers = {};
        currentStep = 0;
        checker.querySelectorAll("[data-checker-option].is-selected").forEach(function (btn) {
          btn.classList.remove("is-selected");
        });
        showStep(0);
      });
    }

    showStep(0);
  }
})();
