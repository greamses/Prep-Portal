import { auth, db } from "./firebase-init.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { SUBSCRIPTION_PLANS } from "./payment-manager.js";

const dashboard = document.querySelector(".user-dashboard");
const isDashboardPage = window.location.pathname.endsWith("/dashboard.html");
const fields = {
  name: document.querySelector("[data-dashboard-name]"),
  subtitle: document.querySelector("[data-dashboard-subtitle]"),
  avatar: document.querySelector("[data-dashboard-avatar]"),
  plan: document.querySelector("[data-dashboard-plan]"),
  status: document.querySelector("[data-dashboard-status]"),
  focus: document.querySelector("[data-dashboard-focus]"),
  streak: document.querySelector("[data-dashboard-streak]"),
  progress: document.querySelector("[data-dashboard-progress]"),
  accuracy: document.querySelector("[data-dashboard-accuracy]"),
  accuracyBar: document.querySelector("[data-dashboard-accuracy-bar]"),
  upgradeButtons: document.querySelectorAll("[data-dashboard-upgrade]"),
  logout: document.querySelector("[data-dashboard-logout]"),
};

let unsubscribeUser = null;

function setText(node, value) {
  if (node) node.textContent = value;
}

function percent(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function firstName(user) {
  const source = user?.displayName || user?.email?.split("@")[0] || "student";
  return source.split(" ")[0];
}

function applyDashboardData(user, data = {}) {
  const role = data.role || "student";
  const name = firstName(user);
  const isPremium = Boolean(data.isPremium);

  setText(fields.name, name);
  setText(fields.avatar, name.charAt(0).toUpperCase());
  setText(fields.plan, data.planName || (isPremium ? "Pro Plan" : "Free Plan"));
  setText(
    fields.status,
    user
      ? `Signed In (${role.charAt(0).toUpperCase() + role.slice(1)})`
      : "Guest Mode",
  );

  // Toggle visibility of role-specific containers in your HTML
  document.querySelectorAll("[data-dashboard-section]").forEach((section) => {
    section.style.display =
      section.dataset.dashboardSection === role ? "block" : "none";
  });

  if (fields.subtitle) {
    if (!user) {
      fields.subtitle.textContent =
        "Sign in to personalize your plan, save progress, and unlock premium activities.";
    } else {
      const subtitles = {
        student:
          "Your workspace is ready. Keep your practice focused and consistent.",
        teacher:
          "Manage your classrooms and monitor student performance metrics.",
        parent: "Track your child's academic progress and practice streaks.",
        admin:
          "System Administration: Monitor users, subscriptions, and platform health.",
      };
      fields.subtitle.textContent = subtitles[role] || subtitles.student;
    }
  }

  // Role-Specific Data Application
  if (role === "student") {
    const progress = percent(data.weeklyProgress, 72);
    const accuracy = percent(data.accuracy, 84);
    const streak = Number.isFinite(Number(data.streakDays))
      ? Math.max(0, Number(data.streakDays))
      : 3;

    setText(fields.focus, data.currentFocus || "Mathematics Practice");
    setText(fields.streak, `${streak} day streak`);
    setText(fields.progress, `${progress}%`);
    setText(fields.accuracy, `${accuracy}%`);

    if (dashboard) dashboard.style.setProperty("--progress", progress);
    const ring = document.querySelector(".dashboard-ring");
    if (ring) ring.style.setProperty("--progress", progress);
    if (fields.accuracyBar) fields.accuracyBar.style.width = `${accuracy}%`;
  } else if (role === "teacher") {
    setText(fields.focus, data.activeClass || "Classroom: Grade 10 Math");
    setText(fields.streak, `${data.totalStudents || 0} Students Enrolled`);
  } else if (role === "parent") {
    setText(fields.focus, `Viewing: ${data.childName || "Link a student"}`);
    setText(
      fields.streak,
      `Student Goal: ${data.childGoal || "Daily Practice"}`,
    );
  } else if (role === "admin") {
    setText(fields.focus, "System Management");
    setText(fields.streak, `${data.totalUsers || 0} Platform Users`);
  }

  if (dashboard) {
    dashboard.classList.toggle("is-premium", isPremium);
  }

  // Hide upgrade buttons for non-students or existing premium users
  fields.upgradeButtons.forEach((btn) => {
    btn.style.display =
      role === "student" && !isPremium ? "inline-flex" : "none";
  });
}

function handleUser(user) {
  if (unsubscribeUser) {
    unsubscribeUser();
    unsubscribeUser = null;
  }

  if (!user) {
    if (isDashboardPage) {
      window.location.replace("/");
      return;
    }

    applyDashboardData(null);
    return;
  }

  applyDashboardData(user);
  unsubscribeUser = onSnapshot(
    doc(db, "users", user.uid),
    (snapshot) =>
      applyDashboardData(user, snapshot.exists() ? snapshot.data() : {}),
    () => applyDashboardData(user),
  );
}

function initDashboard() {
  if (!dashboard) return;

  auth.onAuthStateChanged(handleUser);

  fields.upgradeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!auth.currentUser) {
        window.openAuthModal?.("login");
        return;
      }

      window.PaymentPortal?.open(SUBSCRIPTION_PLANS.PREMIUM);
    });
  });

  fields.logout?.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Could not log out. Please try again.");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboard);
} else {
  initDashboard();
}
