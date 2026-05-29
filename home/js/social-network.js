// index.js
import { initSocialNetwork } from "./src/core/network.js";

// Initialize the network when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initSocialNetwork({
    containerId: "network-container",
    tooltipId: "network-tooltip",
  });
});
