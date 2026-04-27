document.addEventListener("DOMContentLoaded", function () {
  if (window.Swiper) {
    new Swiper(".js__announcement-slider", {
      slidesPerView: 1,
      resistance: false,
      shortSwipes: true,
      loop: false,
      // autoHeight: true,
      autoplay: {
        delay: 10000,
      },
    });
  } else {
    console.warn("Swiper is not loaded!");
  }
  //Close Announcement Bar on Click
  document
    .getElementById("announcement-close")
    .addEventListener("click", function () {
      document.querySelector(".announcement-bar").style.display = "none";
      document.body.classList.remove("announcement-visible");
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("mainHeader");
  const nav = document.getElementById("navbarNavDropdown");
  const searchSection = document.getElementById("js-header-search-section");
  const searchBtn =
    document.getElementById("js__header-search-btn") ||
    document.querySelector(".header .toggle-icon") ||
    document.querySelector(".toggle-icon");
  const body = document.body;

  // 🧠 Check if page has hero section
  const hasHero = !!document.querySelector(
    ".hero-banner, .inner-hero-section, .error-page, .collection-hero-section",
  );

  // 🔹 Shared header state manager
  window.updateHeaderState = function () {
    const menuOpen = nav?.classList.contains("active");
    const searchOpen = searchBtn?.dataset.open === "true";
    const scrollY = window.scrollY;

    // 🧩 For pages with NO hero → always white
    if (!hasHero) {
      header?.classList.add("white");
      header?.classList.remove("transparent");
      body.classList.add("white-header");
      return; // stop here — no other logic applies
    }

    // For hero pages — toggle normally
    if (menuOpen || searchOpen) {
      header?.classList.remove("transparent");
      header?.classList.add("white");
      body.classList.add("white-header");
    } else {
      body.classList.remove("white-header");

      if (scrollY > 33) {
        header?.classList.add("white", "fixed");
        header?.classList.remove("transparent");
      }
    }
  };

  // 🔸 SEARCH TOGGLE LOGIC
  const searchInput = searchSection?.querySelector(".search") ?? null;

  function openSearchBar() {
    if (!searchSection || !searchBtn) return;
    searchSection.classList.add("visible");
    searchBtn.classList.add("active");
    searchBtn.dataset.open = "true";
    searchInput?.focus();
    updateHeaderState();
  }

  function closeSearchBar() {
    if (!searchSection || !searchBtn) return;
    searchSection.classList.remove("visible");
    searchBtn.classList.remove("active");
    searchBtn.dataset.open = "false";
    updateHeaderState();
  }

  searchSection?.addEventListener("click", (e) => e.stopPropagation());
  searchBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    searchBtn.dataset.open === "true" ? closeSearchBar() : openSearchBar();
  });
  document.addEventListener("click", () => {
    if (searchBtn?.dataset.open === "true") closeSearchBar();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchBtn?.dataset.open === "true")
      closeSearchBar();
  });

  // 🔸 Update header on scroll and resize
  window.addEventListener("scroll", updateHeaderState);
  window.addEventListener("resize", updateHeaderState);

  // Initialize header state on load
  updateHeaderState();
});

// SUB MENU And BIG NAV
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("mainHeader");
  const mainHeader = document.querySelector(".main-header");
  const hasHero = !!document.querySelector(
    ".hero-banner, .inner-hero-section, .error-page, .collection-hero-section",
  );

  document.querySelectorAll(".has-sub-nav").forEach((item) => {
    let hideTimeout;
    const link = item.querySelector(".site-nav__link");
    const subNav = item.querySelector(".sub-nav");

    const showSubNav = () => {
      clearTimeout(hideTimeout);
      link?.classList.add("hover-submenu");
      if (subNav) {
        Object.assign(subNav.style, {
          visibility: "visible",
          opacity: "1",
          zIndex: "1",
        });
        subNav.classList.add("active");
      }

      // Update header classes
      header?.classList.remove("transparent");
      header?.classList.add("white", "open-sub-menu"); // also mark open state
      mainHeader?.classList.remove("active");

      // Close search if open
      document
        .querySelectorAll(".header-search-section.visible, .js__search.active")
        .forEach((el) => el.classList.remove("visible", "active"));
    };

    const hideSubNav = () => {
      hideTimeout = setTimeout(() => {
        link?.classList.remove("hover-submenu");
        if (subNav) {
          Object.assign(subNav.style, {
            visibility: "hidden",
            opacity: "0",
          });
          subNav.classList.remove("active");
        }

        const anyOpen = document.querySelector(".has-sub-nav .sub-nav.active");
        if (!anyOpen && header && !header.classList.contains("fixed")) {
          header.classList.remove("open-sub-menu");

          if (hasHero) {
            // only add transparent if hero exists
            header.classList.remove("white");
            header.classList.add("transparent");
          } else {
            // keep it white if no hero
            header.classList.add("white");
            header.classList.remove("transparent");
          }
        }
      }, 150);
    };

    item.addEventListener("mouseenter", showSubNav);
    item.addEventListener("mouseleave", hideSubNav);
    item.addEventListener("focusin", showSubNav); // accessibility
    item.addEventListener("focusout", hideSubNav);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth > 980) {
    const header = document.getElementById("mainHeader");
    const hasHero = !!document.querySelector(
      ".hero-banner, .inner-hero-section, .error-page, .collection-hero-section",
    );

    document.querySelectorAll(".has-big-nav").forEach(function (item) {
      const link = item.querySelector(".site-nav__link");
      const bigNav = item.querySelector(".big-nav");

      item.addEventListener("click", function (event) {
        event.stopPropagation();

        const isActive = bigNav.classList.contains("active");

        // ✅ Close SEARCH if it's open
        const searchBtn = document.getElementById("js__header-search-btn");
        const searchSection = document.getElementById(
          "js-header-search-section",
        );
        const isSearchOpen =
          searchBtn?.dataset.open === "true" ||
          searchSection?.classList.contains("visible");

        if (isSearchOpen) {
          if (typeof window.closeSearchBar === "function") {
            window.closeSearchBar();
          } else {
            // fallback in case closeSearchBar isn't global
            searchSection?.classList.remove("visible");
            searchBtn?.classList.remove("active");
            if (searchBtn) searchBtn.dataset.open = "false";
          }
        }

        // Close all menus
        document.querySelectorAll(".has-big-nav .big-nav").forEach((bn) => {
          bn.style.visibility = "hidden";
          bn.style.opacity = "0";
          bn.classList.remove("active");
        });
        document.querySelectorAll(".site-nav__link").forEach((lnk) => {
          lnk.classList.remove("hover-submenu");
        });

        if (isActive) {
          // Closing menu
          header.classList.remove("white", "open-sub-menu");

          if (hasHero && !header.classList.contains("fixed")) {
            header.classList.add("transparent");
          } else {
            header.classList.add("white");
          }
        } else {
          // Opening menu
          if (link) link.classList.add("hover-submenu");
          if (bigNav) {
            bigNav.style.visibility = "visible";
            bigNav.style.opacity = "1";
            bigNav.classList.add("active");
          }
          header.classList.add("white", "open-sub-menu");
          header.classList.remove("transparent");
        }
      });
    });

    // Close on outside click
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".has-big-nav")) {
        document.querySelectorAll(".has-big-nav .big-nav").forEach((bn) => {
          bn.style.visibility = "hidden";
          bn.style.opacity = "0";
          bn.classList.remove("active");
        });
        document.querySelectorAll(".site-nav__link").forEach((lnk) => {
          lnk.classList.remove("hover-submenu");
        });

        header.classList.remove("white", "open-sub-menu");
        if (hasHero && !header.classList.contains("fixed")) {
          header.classList.add("transparent");
        } else {
          header.classList.add("white");
        }
      }
    });
  }
});

$(document).ready(function () {
  $(".js__search").on("click", function () {
    // agar hamburger menu open hai, to close kar do
    if ($(".big-nav").hasClass("active")) {
      $(".site-nav__link").removeClass("hover-submenu");
      $(".big-nav").removeClass("active").css({
        visibility: "hidden",
        opacity: "0",
      });
    }
  });
});

// Open MObile Menu
document.addEventListener("DOMContentLoaded", () => {
  let navLink = false;
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("navbarNavDropdown");
  const header = document.getElementById("mainHeader");
  const hideEls = document.querySelectorAll(
    ".js__mobile-menu-open-hide, .js__mobile-announcement-text",
  );

  // 🔍 Check if page has hero/inner-banner/error-page
  const hasHero = !!document.querySelector(
    ".hero-banner, .inner-hero-section, .error-page, .collection-hero-section",
  );

  // 🧠 Handles header state on scroll & nav open/close
  const updateHeaderState = () => {
    const scrollY = window.scrollY;

    // 🧩 Pages without hero → always white, always white-header
    if (!hasHero) {
      header.classList.add("white");
      header.classList.remove("transparent");
      document.body.classList.add("white-header");
      return;
    }

    // 🧩 Pages with hero → normal behavior
    if (nav.classList.contains("active")) {
      // 🔹 When mobile menu is open
      header.classList.remove("transparent");
      header.classList.add("white");
      document.body.classList.add("white-header");
    } else {
      // 🔹 When menu is closed
      document.body.classList.remove("white-header");

      if (scrollY > 50) {
        header.classList.add("fixed", "white");
        header.classList.remove("transparent");
      } else {
        header.classList.remove("fixed", "white");
        header.classList.add("transparent");
      }
    }
  };

  // 🍔 Toggles mobile menu
  const toggleMenu = () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
    navLink = true;

    hideEls.forEach((el) =>
      nav.classList.contains("active")
        ? el.classList.add("active")
        : el.classList.remove("active"),
    );

    // Lock scroll when open (for mobile)
    if (nav.classList.contains("active")) {
      if (window.innerWidth < 981) {
        document.documentElement.style.overflow = "hidden";
        document.documentElement.classList.add("scroll-stop");
      } else {
        document.documentElement.style.overflowY = "scroll";
        document.documentElement.classList.remove("scroll-stop");
      }
    } else {
      document.documentElement.style.overflowY = "scroll";
      document.documentElement.classList.remove("scroll-stop");
      document
        .querySelectorAll("body .boost-pfs-search-suggestion-group")
        .forEach((el) => (el.style.display = "none"));
    }

    updateHeaderState();
  };

  hamburger.addEventListener("click", toggleMenu);
  hamburger.addEventListener("focus", () => {
    if (!navLink) toggleMenu();
  });

  window.addEventListener("resize", updateHeaderState);
  window.addEventListener("scroll", updateHeaderState);

  // Initialize header state on load
  updateHeaderState();
});

$(document).ready(function () {
  $(".js__search").on("click", function () {
    // agar hamburger menu open hai, to close kar do
    if ($("#hamburger").hasClass("active")) {
      $("#hamburger").removeClass("active");
      $("#navbarNavDropdown").removeClass("active");
      $("html").removeClass("scroll-stop");
      $("html").css("overflow-y", "scroll");
    }
  });
});

// Dynamic Mobile Nav Bar top according to the height of the header and the announcement
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navbarNavDropdown");
  const header = document.getElementById("mainHeader");
  const announcement = document.querySelector(".announcement-bar");

  function isVisible(el) {
    return el && el.offsetParent !== null && el.offsetHeight > 0;
  }

  function setNavTop() {
    if (!nav || !header) return;

    const baseHeaderHeight = 60;
    let totalHeight = baseHeaderHeight;

    if (!header.classList.contains("fixed")) {
      // Only add announcement height when header is not fixed
      if (window.innerWidth < 981 && isVisible(announcement)) {
        totalHeight += announcement.offsetHeight;
      }
    }

    nav.style.top = `${totalHeight}px`;
  }

  // Run on load
  setNavTop();

  // Run on resize
  window.addEventListener("resize", setNavTop);
});

/** CART SIDEBAR
 * Close on Outside Click
 * **/
$(document).mouseup(function (e) {
  var popup = $("#CartSidebar");
  var overlay = $("#cart_overlay");
  if (!popup.is(e.target) && popup.has(e.target).length == 0) {
    popup.removeClass("active");
    overlay.removeClass("active");
  }
});
/* OPEN BIG NAV SECTION ON mobile */
(function ($) {
  $(function () {
    var navLink = false;

    $(".js__big-nav-link")
      .mousedown(function () {
        $(this).toggleClass("active");

        // slide toggle the nav instead of class toggle
        $(".js__big-nav").stop(true, true).slideToggle(300);

        navLink = true;
      })
      .focus(function () {
        "use strict";
        if (!navLink) {
          $(this).toggleClass("active");

          $(".js__big-nav").stop(true, true).slideToggle(300);
        }
      });
  });
})(jQuery);

/* OPEN SUB NAV SECTION ON MOBILE */
(function ($) {
  $(function () {
    var navLink = false;
    $(".js__sub-nav-link")
      .mousedown(function (e) {
        $(this).toggleClass("active");
        $(".js__sub-nav").toggleClass("active");
        navLink = true;
      })
      .focus(function (e) {
        "use strict";
        if (navLink) {
        } else {
          $(this).toggleClass("active");
          $(".js__sub-nav").toggleClass("active");
        }
      });
  });
})(jQuery);

// Close MOBILE SUB NAV ON CLICK BACK
(function ($) {
  $(function () {
    var navLink = false;
    $(".js__sub-nav-close")
      .mousedown(function (e) {
        $(this).toggleClass("active");
        $(".js__sub-nav").toggleClass("active");
        navLink = true;
      })
      .focus(function (e) {
        "use strict";
        if (navLink) {
        } else {
          $(this).toggleClass("active");
          $(".js__sub-nav").toggleClass("active");
        }
      });
  });
})(jQuery);

// Adding fixed class
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("mainHeader");
  const heroBanner = document.querySelector(
    ".hero-banner, .inner-hero-section, .error-page, .collection-hero-section",
  );
  const announcement = document.querySelector(".announcement-bar");
  const hamburger = document.getElementById("hamburger");

  const sticky = header ? header.offsetTop : 0;

  function isSearchOpen() {
    return !!document.querySelector(
      ".js__search.active, .header-search-section.visible, .header-search-section.active",
    );
  }

  function checkScroll() {
    if (!header) return;
    if (window.pageYOffset > sticky) {
      header.classList.add("fixed");
      document.body.classList.add("header-fixed");
      header.classList.remove("transparent");
    } else {
      header.classList.remove("fixed");
      document.body.classList.remove("header-fixed");
      // if (!isSearchOpen()) {
      //   header.classList.add("transparent");
      // } else {
      //   header.classList.remove("transparent");
      //   header.classList.add("white");
      // }
    }
  }

  // Run once and on scroll
  checkScroll();
  window.addEventListener("scroll", checkScroll);

  // Hamburger behavior
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      if (
        window.scrollY === 0 &&
        announcement &&
        announcement.offsetParent !== null
      ) {
        header.classList.remove("fixed");
        document.body.classList.remove("header-fixed");
      } else {
        header.classList.add("fixed");
        document.body.classList.add("header-fixed");
      }
    });
  }
});

// Safe header manager — robust and defensive
