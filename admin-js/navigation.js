// navigation.js
/**
 * @typedef {Object} NavigationState
 * @property {string} currentPage - The currently active page ID
 * @property {HTMLElement} currentNavItem - The currently active navigation item
 * @property {HTMLElement} currentPageElement - The currently active page element
 */

/**
 * Navigation module for managing page navigation and sidebar state
 */
const Navigation = {
  /** @type {NavigationState} */
  state: {
    currentPage: "dashboard",
    currentNavItem: null,
    currentPageElement: null,
  },

  /**
   * Configuration options for the navigation
   */
  config: {
    navItemSelector: ".nav-item",
    pageSelector: ".page",
    activeClass: "active",
    defaultPage: "dashboard",
    formIds: ["productForm", "categoryForm", "orderDetailsModal"],
  },

  /**
   * Initialize the navigation module
   * @returns {void}
   */
  init: function () {
    try {
      // Cache DOM elements
      this.navItems = document.querySelectorAll(this.config.navItemSelector);
      this.pages = document.querySelectorAll(this.config.pageSelector);

      if (!this.navItems.length || !this.pages.length) {
        console.error("Navigation: Required elements not found");
        return;
      }

      // Initialize event listeners
      this.attachEventListeners();

      // Set initial state
      this.setInitialState();

      // Handle browser back/forward buttons
      window.addEventListener("popstate", this.handlePopState.bind(this));

      console.log("Navigation: Initialized successfully");
    } catch (error) {
      console.error("Navigation: Initialization failed", error);
    }
  },

  /**
   * Attach event listeners to navigation items
   * @returns {void}
   */
  attachEventListeners: function () {
    this.navItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        const pageId = item.getAttribute("data-page");
        if (pageId) {
          this.navigateToPage(pageId);
        }
      });

      // Add keyboard navigation
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const pageId = item.getAttribute("data-page");
          if (pageId) {
            this.navigateToPage(pageId);
          }
        }
      });
    });
  },

  /**
   * Set the initial navigation state
   * @returns {void}
   */
  setInitialState: function () {
    // Check for URL hash
    const hashPageId = window.location.hash.slice(1);
    const initialPage = this.isValidPage(hashPageId)
      ? hashPageId
      : this.config.defaultPage;

    const initialNavItem = document.querySelector(
      `[data-page="${initialPage}"]`
    );
    const initialPageElement = document.getElementById(initialPage);

    if (initialNavItem && initialPageElement) {
      this.updateState(initialPage, initialNavItem, initialPageElement);
      this.updateUI();
    } else {
      console.error(`Navigation: Initial page "${initialPage}" not found`);
    }
  },

  /**
   * Navigate to a specific page
   * @param {string} pageId - The ID of the page to navigate to
   * @returns {void}
   */
  navigateToPage: function (pageId) {
    if (!this.isValidPage(pageId)) {
      console.error(`Navigation: Invalid page ID "${pageId}"`);
      return;
    }

    const targetNavItem = document.querySelector(`[data-page="${pageId}"]`);
    const targetPage = document.getElementById(pageId);

    if (!targetNavItem || !targetPage) {
      console.error(`Navigation: Page elements for "${pageId}" not found`);
      return;
    }

    // Update browser history
    window.history.pushState({ pageId }, "", `#${pageId}`);

    // Update navigation state
    this.updateState(pageId, targetNavItem, targetPage);

    // Update UI
    this.updateUI();

    // Handle any cleanup
    this.handlePageTransition();
  },

  /**
   * Handle browser back/forward navigation
   * @param {PopStateEvent} event - The popstate event
   * @returns {void}
   */
  handlePopState: function (event) {
    const pageId =
      (event.state && event.state.pageId) || this.config.defaultPage;
    this.navigateToPage(pageId);
  },

  /**
   * Update the navigation state
   * @param {string} pageId - The new page ID
   * @param {HTMLElement} navItem - The new navigation item
   * @param {HTMLElement} pageElement - The new page element
   * @returns {void}
   */
  updateState: function (pageId, navItem, pageElement) {
    this.state = {
      currentPage: pageId,
      currentNavItem: navItem,
      currentPageElement: pageElement,
    };
  },

  /**
   * Update the UI to reflect the current state
   * @returns {void}
   */
  updateUI: function () {
    // Remove active class from all items
    this.navItems.forEach((item) => {
      item.classList.remove(this.config.activeClass);
      item.setAttribute("aria-selected", "false");
    });

    this.pages.forEach((page) => {
      page.classList.remove(this.config.activeClass);
      page.setAttribute("aria-hidden", "true");
    });

    // Add active class to current items
    if (this.state.currentNavItem && this.state.currentPageElement) {
      this.state.currentNavItem.classList.add(this.config.activeClass);
      this.state.currentNavItem.setAttribute("aria-selected", "true");
      this.state.currentPageElement.classList.add(this.config.activeClass);
      this.state.currentPageElement.setAttribute("aria-hidden", "false");

      // Focus management
      this.state.currentPageElement.querySelector("h2")?.focus();
    }
  },

  /**
   * Handle cleanup during page transitions
   * @returns {void}
   */
  handlePageTransition: function () {
    // Close any open forms/modals
    this.config.formIds.forEach((formId) => {
      const form = document.getElementById(formId);
      if (form) {
        form.style.display = "none";
      }
    });

    // Reset any form states if needed
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => form.reset());

    // Remove any error states
    const errorElements = document.querySelectorAll(".error");
    errorElements.forEach((element) => element.classList.remove("error"));
  },

  /**
   * Check if a page ID is valid
   * @param {string} pageId - The page ID to validate
   * @returns {boolean} Whether the page ID is valid
   */
  isValidPage: function (pageId) {
    return (
      pageId &&
      typeof pageId === "string" &&
      document.getElementById(pageId) !== null
    );
  },
};

/**
 * Form utility functions
 */
window.toggleProductForm = function () {
  const productForm = document.getElementById("productForm");
  if (productForm) {
    productForm.style.display =
      productForm.style.display === "flex" ? "none" : "flex";
  }
};

window.toggleCategoryForm = function () {
  const categoryForm = document.getElementById("categoryForm");
  if (categoryForm) {
    categoryForm.style.display =
      categoryForm.style.display === "flex" ? "none" : "flex";
  }
};

window.closeForm = function (formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.style.display = "none";
  }
};

// Initialize everything when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  Navigation.init();
});

export default Navigation;
