import NAV_CONFIG from "./nav-config.js";
import { auth } from "../../firebase-init.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const LOGO_PATH = "/logo/logo-light.svg";

/* =============================================
   ICON RENDERER
============================================= */
function renderIcon(icon) {
  if (!icon) return null;

  if (icon.trim().startsWith("<svg")) {
    const wrapper = document.createElement("span");
    wrapper.className = "nav-icon";
    wrapper.innerHTML = icon;
    return wrapper;
  }

  const img = document.createElement("img");
  img.src = icon;
  img.alt = "";
  img.className = "nav-icon";
  return img;
}

/* =============================================
   ROBUST PATH MATCHING HELPER
============================================= */
function matchPath(currentPath, href) {
  if (!href || href === "#") return false;

  // Normalize by removing trailing slashes for clean comparison
  const normPath = currentPath.replace(/\/$/, "");
  const normHref = href.replace(/\/$/, "");

  if (normPath === normHref) return true;

  // Match subpaths cleanly (e.g. /courses/math starts with /courses/)
  if (normHref !== "" && normHref !== "/") {
    return normPath.startsWith(normHref + "/");
  }

  return false;
}

/* =============================================
   RECURSIVE TREE RENDERER
============================================= */
function buildTree(items, level = 1) {
  const container = document.createElement("div");
  container.className = `nav-level nav-level-${level}`;

  items.forEach((item, index) => {
    const block = document.createElement("div");
    block.className = "nav-block";

    // Distribute playful theme colors based on index
    const colorClasses = [
      "theme-yellow",
      "theme-blue",
      "theme-green",
      "theme-red",
    ];
    block.classList.add(colorClasses[index % colorClasses.length]);

    /* =========================
       HEADER (NON-CLICKABLE GROUP)
    ========================= */
    if (item.children && item.children.length > 0) {
      const header = document.createElement("div");
      header.className = "nav-header";

      const icon = renderIcon(item.icon);
      if (icon) header.appendChild(icon);

      const title = document.createElement("span");
      title.textContent = item.text;
      header.appendChild(title);

      block.appendChild(header);
      block.appendChild(buildTree(item.children, level + 1));
    }

    /* =========================
       LEAF NODE (CLICKABLE ITEMS)
    ========================= */
    if (!item.children || item.children.length === 0) {
      const link = document.createElement("a");
      link.href = item.href || "#";
      link.className = "nav-leaf";
      link.setAttribute("data-nav-href", item.href || "#");

      const icon = renderIcon(item.icon);
      if (icon) {
        link.appendChild(icon);
      }

      const textWrap = document.createElement("div");
      textWrap.className = "nav-leaf-text";

      const text = document.createElement("span");
      text.className = "nav-leaf-title";
      text.textContent = item.text;
      textWrap.appendChild(text);

      if (item.description) {
        const desc = document.createElement("small");
        desc.textContent = item.description;
        textWrap.appendChild(desc);
      }

      link.appendChild(textWrap);

      const arrow = document.createElement("span");
      arrow.className = "nav-leaf-arrow";
      arrow.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      link.appendChild(arrow);

      block.appendChild(link);
    }

    container.appendChild(block);
  });

  return container;
}

/* =============================================
   🔥 ACTIVE NAV DETECTION (SCOPED)
============================================= */
function setActiveNav(siteNav) {
  const currentPath = window.location.pathname;

  // Find all elements containing nav references inside this specific siteNav
  const allLinks = siteNav.querySelectorAll("[data-nav-href]");

  allLinks.forEach((link) => {
    const href = link.getAttribute("data-nav-href");
    if (matchPath(currentPath, href)) {
      link.classList.add("active");

      const block = link.closest(".nav-block");
      if (block) block.classList.add("active");

      // Set the active class on the parent top-level list item
      const topLevelLi = link.closest(".nav-links > li");
      if (topLevelLi) topLevelLi.classList.add("active");
    }
  });
}

/* =============================================
   MEGA MENU BUILDER
============================================= */
function buildMegaMenu() {
  const ul = document.createElement("ul");
  ul.className = "nav-links";

  NAV_CONFIG.forEach((item) => {
    const li = document.createElement("li");
    const hasChildren = item.children && item.children.length > 0;

    /* =========================
       MAIN LABEL (DIV for dropdowns, A for single links)
    ========================= */
    const label = document.createElement(hasChildren ? "div" : "a");
    label.className = "nav-main-label";

    if (!hasChildren) {
      label.href = item.href || "#";
      label.setAttribute("data-nav-href", item.href || "#");
    }

    const icon = renderIcon(item.icon);
    if (icon) label.appendChild(icon);

    const text = document.createElement("span");
    text.textContent = item.text;
    label.appendChild(text);

    // Apply toggle logic ONLY if it's a dropdown container
    if (hasChildren) {
      label.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = li.classList.contains("open");
        Array.from(ul.children).forEach((child) =>
          child.classList.remove("open"),
        );
        if (!isOpen) {
          li.classList.add("open");
        }
      });
    }

    li.appendChild(label);

    /* =========================
       MEGA PANEL
    ========================= */
    if (hasChildren) {
      const panel = document.createElement("div");
      panel.className = "mega-panel";

      const inner = document.createElement("div");
      inner.className = "mega-panel-content";

      const tree = document.createElement("div");
      tree.className = "mega-tree";
      tree.appendChild(buildTree(item.children, 1));
      inner.appendChild(tree);

      if (item.image) {
        const imageWrap = document.createElement("div");
        imageWrap.className = "mega-image";

        if (item.image.trim().startsWith("<svg")) {
          imageWrap.innerHTML = item.image;
        } else {
          const img = document.createElement("img");
          img.src = item.image;
          img.alt = item.text;
          imageWrap.appendChild(img);
        }

        inner.appendChild(imageWrap);
      }

      panel.appendChild(inner);
      li.appendChild(panel);
    }

    ul.appendChild(li);
  });

  document.addEventListener("click", () => {
    ul.querySelectorAll("li.open").forEach((li) => li.classList.remove("open"));
  });

  return ul;
}

/* =============================================
   USER MENU
============================================= */
function buildUserMenu() {
  const menuDiv = document.createElement("div");
  menuDiv.className = "user-menu";
  menuDiv.id = "user-menu";

  const profileDiv = document.createElement("div");
  profileDiv.className = "user-profile";

  const avatar = document.createElement("div");
  avatar.className = "user-avatar";
  avatar.id = "user-avatar";
  avatar.textContent = "U";

  const nameSpan = document.createElement("span");
  nameSpan.className = "user-name";
  nameSpan.id = "user-name";

  profileDiv.appendChild(avatar);
  profileDiv.appendChild(nameSpan);

  menuDiv.appendChild(profileDiv);

  return menuDiv;
}

/* =============================================
   BUILD NAV
============================================= */
function buildNav(siteNav) {
  const brandWrap = document.createElement("div");
  brandWrap.className = "nav-brand-wrap";

  const logo = document.createElement("a");
  logo.href = "/";
  logo.className = "nav-logo";

  const img = document.createElement("img");
  img.src = LOGO_PATH;
  img.alt = "logo";

  const textWrap = document.createElement("div");
  textWrap.className = "nav-logo-text";
  textWrap.innerHTML = `<span class="brand-top">Prep</span><span class="brand-bottom">portal</span>`;

  logo.appendChild(img);
  logo.appendChild(textWrap);
  brandWrap.appendChild(logo);

  siteNav.appendChild(brandWrap);
  siteNav.appendChild(buildMegaMenu());

  const rightWrap = document.createElement("div");
  rightWrap.className = "nav-right-wrap";
  rightWrap.appendChild(buildUserMenu());

  const toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.id = "nav-toggle";

  for (let i = 0; i < 3; i++) {
    toggle.appendChild(document.createElement("span"));
  }

  rightWrap.appendChild(toggle);
  siteNav.appendChild(rightWrap);

  // Set active state specifically on this navigation instance
  setActiveNav(siteNav);
}

/* =============================================
   EVENTS
============================================= */
function attachEvents() {
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    toggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });
}

function updateAuthUI(user) {
  if (user && user.displayName) {
    const avatar = document.getElementById("user-avatar");
    if (avatar) avatar.textContent = user.displayName.charAt(0).toUpperCase();
  }
}

/* =============================================
   INIT
============================================= */
function init() {
  const navs = document.querySelectorAll('.site-nav[data-nav="main"]');
  if (!navs.length) return;

  navs.forEach(buildNav);
  attachEvents();

  if (typeof auth !== "undefined" && auth.onAuthStateChanged) {
    auth.onAuthStateChanged(updateAuthUI);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
