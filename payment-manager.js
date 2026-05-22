/**
 * Prep Portal Payment Gateway Utility
 * Handles Paystack Subscriptions and Reusable UI Modal
 */

import { auth, db } from "./firebase-init.js"; // Ensure db is imported
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export const SUBSCRIPTION_PLANS = {
  GAMES: {
    planId: "PLN_GAMES_2026", // Replace with your actual Paystack Plan Code (e.g., PLN_xxxxxxxxxx)
    name: "Games & Activities Pro",
    price: "4.99",
    description:
      "Unlimited access to all Math games, visual activities, and AI-powered feedback.",
  },
  PREMIUM: {
    planId: "PLN_PREMIUM_2026", // Replace with your actual Paystack Plan Code (e.g., PLN_yyyyyyyyyy)
    name: "Monthly Pro",
    price: "9.99",
    description:
      "Full access to all 50+ papers, theory drills, and infinite AI tutor usage.",
  },
};

(function () {
  const PAYMENT_CONFIG = {
    publicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx", // Replace with your Public Key
    currency: "USD", // Or NGN
  };

  const PaymentPortal = {
    isOpen: false,
    currentPlan: null,

    init() {
      this.injectStyles();
      this.createModalMarkup();
      this.setupInterceptors();
    },

    injectStyles() {
      if (document.getElementById("payment-portal-styles")) return;
      const link = document.createElement("link");
      link.id = "payment-portal-styles";
      link.rel = "stylesheet";
      link.href = "/payment-manager.css";
      document.head.appendChild(link);
    },

    createModalMarkup() {
      const modalHtml = `
        <div id="payment-modal-overlay" class="pm-overlay">
          <div class="pm-modal">
            <div class="pm-header">
              <div class="pm-title-wrap">
                <span class="pm-eyebrow">UPGRADE PLAN</span>
                <h2 class="pm-title">Premium Access</h2>
              </div>
              <button id="pm-close" class="pm-close-btn">×</button>
            </div>
            <div class="pm-body">
              <div class="pm-plan-card">
                <div class="pm-plan-info">
                  <h3 id="pm-plan-name">Monthly Pro</h3>
                  <p id="pm-plan-desc">Full access to all 50+ papers and AI tutor.</p>
                  <div class="pm-price">
                    <span class="pm-currency">$</span>
                    <strong id="pm-amount">9.99</strong>
                    <span class="pm-period">/month</span>
                  </div>
                </div>
                <ul class="pm-features">
                  <li>✓ 1000+ Practice Questions</li>
                  <li>✓ Infinite AI PrepBot Usage</li>
                  <li>✓ Personalized Study Track</li>
                </ul>
              </div>
              <button id="pm-subscribe-btn" class="pm-main-btn">
                <span>Confirm Subscription</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <p class="pm-footer-text">Secure encryption by Paystack. Cancel anytime.</p>
            </div>
          </div>
        </div>
      `;
      const container = document.createElement("div");
      container.id = "payment-portal-root";
      container.innerHTML = modalHtml;
      document.body.appendChild(container);

      document.getElementById("pm-close").onclick = () => this.close();
      document.getElementById("payment-modal-overlay").onclick = (e) => {
        if (e.target.id === "payment-modal-overlay") this.close();
      };
      document.getElementById("pm-subscribe-btn").onclick = () =>
        this.initiatePaystack();
    },

    async open(planData) {
      this.currentPlan = planData;
      document.getElementById("pm-plan-name").textContent = planData.name;
      document.getElementById("pm-amount").textContent = planData.price;
      document.getElementById("pm-plan-desc").textContent =
        planData.description;

      const overlay = document.getElementById("payment-modal-overlay");
      overlay.classList.add("active");
      this.isOpen = true;

      await this.loadPaystackSDK();
    },

    close() {
      const overlay = document.getElementById("payment-modal-overlay");
      overlay.classList.remove("active");
      this.isOpen = false;
    },

    loadPaystackSDK() {
      return new Promise((resolve) => {
        if (window.PaystackPop) return resolve();
        const script = document.createElement("script");
        script.src = "https://js.paystack.co/v1/inline.js";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    },

    initiatePaystack() {
      const user = auth.currentUser;
      if (!user) {
        alert("Please sign in to subscribe.");
        window.openAuthModal?.("login");
        return;
      }

      const handler = PaystackPop.setup({
        key: PAYMENT_CONFIG.publicKey,
        email: user.email,
        amount: parseFloat(this.currentPlan.price) * 100,
        currency: PAYMENT_CONFIG.currency,
        plan: this.currentPlan.planId, // The Paystack Plan Code
        callback: async (response) => {
          try {
            await setDoc(
              // Use setDoc with merge: true to update or create
              doc(db, "users", user.uid),
              {
                isPremium: true,
                planId: this.currentPlan.planId,
                planName: this.currentPlan.name,
                lastPaymentRef: response.reference,
                updatedAt: new Date().toISOString(),
              },
              { merge: true },
            );

            alert("Subscription active! Enjoy your Pro features.");
            this.close();
          } catch (e) {
            console.error("Firestore Update Error:", e);
          }
        },
        onClose: () => {
          console.log("Window closed.");
        },
      });
      handler.openIframe();
    },

    setupInterceptors() {
      // Listen for clicks on links leading to games or activities
      document.addEventListener("click", async (e) => {
        // Make the event listener async
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href") || "";

        // Trigger if navigating to prep-math games or activities
        if (
          href.includes("/prep-math/games/") ||
          href.includes("/prep-math/activity/")
        ) {
          e.preventDefault();

          const user = auth.currentUser;
          if (!user) {
            alert("Please sign in to access premium content.");
            window.openAuthModal?.("login"); // Assuming openAuthModal is globally available
            return;
          }

          // Check user's subscription status from Firestore
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data().isPremium) {
              // User is premium, allow navigation
              window.location.href = href;
              return;
            }
            // If not premium, open the subscription modal for GAMES plan
            this.open(SUBSCRIPTION_PLANS.GAMES);
          } catch (error) {
            console.error("Error checking subscription status:", error);
            alert("Could not verify subscription status. Please try again.");
          }
        }
      });
    },
  };
  window.PaymentPortal = PaymentPortal;
  window.PaymentPortal.init();
})();
