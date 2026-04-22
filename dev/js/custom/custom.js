jQuery(function () {
 
  var productSectionSlider = new Swiper(".js__product-section-slider", {
    slidesPerView: 4,
    spaceBetween: 10,
    // centeredSlides: true,
    // resistance: false,
    loop: true,
    resistance: false,
    shortSwipes: true,
    longSwipes: false,
    // scrollOverflowOptions: null,
    // loopedSlidesLimit: false,
    navigation: {
      nextEl: ".swiper-button-next-product-section",
      prevEl: ".swiper-button-prev-product-section",
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      376: {
        slidesPerView: 1,
      },
      481: {
        slidesPerView: 1,
      },
      769: {
        slidesPerView: 3,
      },
      1100: {
        slidesPerView: 4,
      },
    },
  });

  

   

  var addonProducts = new Swiper(".js_addon-products-slider-pdp", {
    slidesPerView: 1,

    resistance: false,
 autoHeight: true,
    loop: false,
    // autoplay: {
    //     delay: 10000,
    // },
    // Navigation arrows
    pagination: {
      el: ".swiper-pagination-addon-product-pdp",
      clickable: true,
    },
  });

  /* Hero Banner SLider */
  var heroSlider = new Swiper(".js__hero-banner-slider", {
    slidesPerView: 1,

    resistance: false,

    loop: false,
    // autoplay: {
    //     delay: 10000,
    // },
    // Navigation arrows
    pagination: {
      el: ".swiper-pagination-herobanner",
      clickable: true,
    },
  });

  var marquee = document.querySelectorAll(
    ".js_logo-slider .swiper-wrapper .swiper-slide"
  );

  if (marquee.length > 0) {
    var wrapper = document.querySelector(".js_logo-slider .swiper-wrapper");

    for (var i = 0; i < 500; i++) {
      marquee.forEach((slide) => {
        // Clone each slide
        var clone1 = slide.cloneNode(true);
        // Inject it into the wrapper
        wrapper.appendChild(clone1);
      });
    }
  }

  // logo Slider
  var logoSlider = new Swiper(".js_logo-slider", {
    // slidesPerView: "auto",
    spaceBetween: 0,
    watchSlidesProgress: true,
    clickable: true,
    resistance: false,
    shortSwipes: false,
    freeMode: true,
    loop: true,
    allowTouchMove: false,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    slidesPerView: 5.5,
    spaceBetween: 100,
    speed: 4000,
    breakpoints: {
      0: {
        slidesPerView: 2.5,
        spaceBetween: 30,
      },
      481: {
        slidesPerView: 3.5,
        spaceBetween: 50,
      },
      769: {
        slidesPerView: 4.5,
        spaceBetween: 50,
      },

      1201: {
        slidesPerView: 5.5,
        spaceBetween: 70,
      },
    },
  });

  //    embed slider
  var embedtSlider = new Swiper(".js_four-column-embed-slider", {
    slidesPerView: "auto",
    spaceBetween: 10,
    grabCursor: true,
    updateOnWindowResize: true,

    // centeredSlides: true,
    loop: true,
    threshold: 1,

    navigation: {
      nextEl: ".swiper-button-next-embed-slider",
      prevEl: ".swiper-button-prev-embed-slider ",
    },
  });

  var halfcontentSlider = new Swiper(".js_half-content-half-image-slider", {
    slidesPerView: 1,

    resistance: false,

    loop: true,
    spaceBetween: 30,
    // autoplay: {
    //     delay: 10000,
    // },
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next-content-slider",
      prevEl: ".swiper-button-prev-content-slider",
    },
  });

  var customProductSlider = new Swiper(".js__product-slider", {
    slidesPerView: "auto",
    spaceBetween: 20,
    grabCursor: false,

    loop: true,

    // loopedSlides: 100,
    updateOnWindowResize: true,
    direction: "horizontal",
    // effect: 'coverflow',
    // freeModeSticky: true,
    freeMode: true,
    freeModeMomentumBounce: false,
    // freeModeMomentumRatio: .1,
    // freeModeMomentumVelocityRatio: .8,
    // freeMode: true,

    // centeredSlides: true,
    threshold: 1,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      481: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      601: {
        slidesPerView: 3,
        spaceBetween: 10,
      },

      769: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      981: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
      1440: {
        slidesPerView: "auto",
        spaceBetween: 20,
      },
    },

    navigation: {
      nextEl: ".swiper-button-next-product-slider",
      prevEl: ".swiper-button-prev-product-slider ",
    },
  });

  var blogSlider = new Swiper(".js__blog-slider", {
    slidesPerView: "auto",
    spaceBetween: 20,
    threshold: 1,
    loop: true,

    breakpoints: {
      1920: {
        slidesPerView: "auto",
      },
    },
    navigation: {
      nextEl: ".swiper-button-next-blog-slider",
      prevEl: ".swiper-button-prev-blog-slider ",
    },
  });

  var productSlider = new Swiper(".js__small-product-slider", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    threshold: 1,
    breakpoints: {
      1025: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      981: {
        slidesPerView: 2,
        spaceBetween: 25,
      },

      480: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      0: {
        slidesPerView: 2,
        spaceBetween: 25,
      },
    },

    navigation: {
      nextEl: ".swiper-button-next-small-product-slider",
      prevEl: ".swiper-button-prev-small-product-slider ",
    },
  });

  /* Collection selected*/
  $(document).ready(function ($) {
    $(".js__collections-select").change(function () {
      window.location = $(this).val();
    });

    /*Dropdown selected*/
    $(".js__collection-content li").each(function (index) {
      var value = $(this).attr("data-url").toLowerCase();
      if (window.location.href.toLowerCase().indexOf(value) > -1) {
        $(this).addClass("active");
        $(".js__collections-select").val($(this).attr("data-url"));
      }
    });
    if (!("ontouchstart" in document.documentElement)) {
      document.documentElement.className += " no-touch";
    }
  });

  try {
    var pageTotal = parseInt($(".js__total-page").val());
    var currentPage = parseInt($(".js__current-page").val());
    var itemTotal = parseInt($(".js__items-count").val());
    var perPageItem = parseInt($(".js__perpage-item").val());
    var itemStart = 1;
    var itemEnd = 0;
    if (currentPage > 1) {
      itemStart = perPageItem * (currentPage - 1) + 1;
    }
    itemEnd = itemStart + perPageItem - 1;
    if (pageTotal == currentPage) {
      itemEnd = itemTotal;
    }
    $(".js__page-range").html(itemStart + " - " + itemEnd);
  } catch {}

  /* PDP
    Tab working */
  $(".tab-link").on("click", function (event) {
  event.preventDefault(); // stop page from jumping

  var dataId = $(this).attr("data-attr");
  var i, tabcontent, tablink;

  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablink = document.getElementsByClassName("tab-link");
  for (i = 0; i < tablink.length; i++) {
    tablink[i].className = tablink[i].className.replace(" active", "");
  }

  document.getElementById(dataId).style.display = "block";
  this.className += " active";
});


  $(".js__pdp-tab-select").change(function () {
    $("#tab-link-" + $(this).val()).click();
  });
  $(document).on("click", ".pdp-tab-link", function (e) {
    var dataId = $(this).attr("data-attr");
    var i, tabcontent, tablink;

    tabcontent = document.getElementsByClassName("pdp-tab-content");
    $(this)
      .parent("li")
      .parent("ul")
      .parent(".pdp-tab-small__wrapper__head")
      .parent(".pdp-tab-small__wrapper")
      .children(".pdp-tab-small__wrapper__content")
      .children(".pdp-tab-content")
      .hide();
    $(this)
      .parent("li")
      .parent("ul")
      .parent(".pdp-tab-small__wrapper__head")
      .parent(".pdp-tab-small__wrapper__head-outer")
      .parent(".pdp-tab-small__wrapper")
      .children(".pdp-tab-small__wrapper__content")
      .children(".pdp-tab-content")
      .hide();

    $(this)
      .parent("li")
      .parent("ul")
      .children("li")
      .children(".pdp-tab-link")
      .removeClass("active");
    tablink = document.getElementsByClassName("pdp-tab-link");

    document.getElementById(dataId).style.display = "block";
    event.currentTarget.className += " active";
    $(this).addClass("active");

    /*PDP select*/
    $(".js__pdp-tab-select").val(dataId);
  });
  /* GLOBAL
    Scroll to particular Div with # value */
  $('a[href^="#"]').on("click", function (event) {
    var target = $(this.getAttribute("href"));
    if (target.length) {
      event.preventDefault();

      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 150,
          },
          1000
        );
    }
  });

  /* accordion working about content in small screen*/
  $(".js__accordian")
    .children("li")
    .children("h2,h4,h5,h3,.feature-header")
    .click(function (e) {
      if ($(this).parent("li").children(".content").css("display") == "none") {
        $(this)
          .parent("li")
          .parent(".js__accordian")
          .children("li")
          .children(".content")
          .hide();
        $(this)
          .parent("li")
          .parent(".js__accordian")
          .children("li")
          .removeClass("active");
        $(this).parent("li").children(".content").slideDown();
        $(this).parent("li").addClass("active");
      } else {
        $(this).parent("li").children(".content").slideUp();
        $(this).parent("li").removeClass("active");
      }
    });

  $(document).on("click", ".pid-content-box", function () {
    if ($(this).find(".pid-content-expander").html() != "") {
      if (
        $(this)
          .parent(".pid-content-flex")
          .children(".pid-content-description")
          .css("display") == "none"
      ) {
        $(this)
          .parent(".pid-content-flex")
          .children(".pid-content-description")
          .slideDown();
        $(this).addClass("active");
      } else {
        $(this)
          .parent(".pid-content-flex")
          .children(".pid-content-description")
          .slideUp();
        $(this).removeClass("active");
      }
    }
  });
  /* Accordion working when we have multiple content*/

  $(".js__accordians").children("li").attr("aria-expanded", false);
  $(".js__accordians")
    .children("li")
    .children("h5,h6,h3,h4")
    .attr("role", "button");
  $(".js__accordians")
    .children("li")
    .children("h5,h6,h3,h4")
    .attr("tabindex", "0");
  $(".js__accordians")
    .children("li")
    .children("h5,h6,h3,h4")
    .click(function (e) {
      var type = $(this).parent("li").attr("data-attr");
      if ($("." + type).css("display") == "none") {
        $(this).attr("aria-expanded", true);
        $(this)
          .parent("li")
          .parent(".js__accordians")
          .children(".content")
          .hide();
        $(this)
          .parent("li")
          .parent(".js__accordians")
          .children("li")
          .removeClass("active");
        $("." + type).slideDown();
        $(this).parent("li").addClass("active");
        $(this).addClass("active");
      } else {
        $(this).attr("aria-expanded", false);
        $(this).parent("li").removeClass("active");
        $("." + type).slideUp();
        $(this).removeClass("active");
      }
    });

  $(".js__accordians")
    .children("li")
    .children("h5,h6,h3,h4")
    .keypress(function (e) {
      if (e.which == 13) {
        var type = $(this).parent("li").attr("data-attr");
        if ($("." + type).css("display") == "none") {
          $(this).attr("aria-expanded", true);
          $(this)
            .parent("li")
            .parent(".js__accordians")
            .children(".content")
            .hide();
          $(this)
            .parent("li")
            .parent(".js__accordians")
            .children("li")
            .removeClass("active");
          $("." + type).slideDown();
          $(this).parent("li").addClass("active");
          $(this).addClass("active");
        } else {
          $(this).attr("aria-expanded", false);
          $(this).parent("li").removeClass("active");
          $("." + type).slideUp();
          $(this).removeClass("active");
        }
      }
    });
});

/** Dropdown **/
jQuery(function ($) {
  $(".js__cate-accordian .togglebtn h3").on("click", function () {
    if ($(".js__cate-accordian").children(".rem").css("display") == "none") {
      $(".rem").slideDown(300);

      $(this).parent(".togglebtn").toggleClass("active");
    } else {
      $(".rem").slideUp(300);

      $(".togglebtn").removeClass("active");
    }
  });
  $(".js__dropdown_result").on("click", function () {
    if ($(".js__dropdown").css("display") == "none") {
      $(".js__dropdown").slideDown(300);
    } else {
      $(".js__dropdown").slideUp(300);
    }
    $(this).toggleClass("active");
  });
  var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
  $(".js__dropdown li a").each(function () {
    if (this.href === path) {
      $(this).addClass("active");

      if ($(this).html() != "view all") {
        $(".js__dropdown_result").html($(this).html());
      }
      $(".js__dropdown").slideUp(300);
      $(".js__dropdown_result").removeClass("active");
    }
  });
  $(".js__active-class li a").each(function () {
    if (this.href === path) {
      $(".js__active-class li a").removeClass("active");
      $(this).addClass("active");
    }
  });
});
/* Mini cart - Checkout Button visiblity fix for IOS Mobile */
var lastScroll = 0;
jQuery(document).ready(function ($) {
  $(".cart-sidebar__middle").addClass("safari-mobile");

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > lastScroll) {
      $(".cart-sidebar__middle").removeClass("safari-mobile");
    } else if (scroll < lastScroll) {
      $(".cart-sidebar__middle").addClass("safari-mobile");
    }
    lastScroll = scroll;
  });
});

/** Dropdown **/
jQuery(function ($) {
  /*Blog dropdown*/
  $(".js__blog-select").change(function () {
    window.location = $(this).val();
  });
  /*Dropdown selected*/
  $(".js__blog-select option").each(function (index) {
    var value = $(this).val().toLowerCase();
    if (window.location.href.toLowerCase().indexOf(value) > -1) {
      $(".js__blog-select").val($(this).val());
    }
  });
});

jQuery(function ($) {
  $(".js--open-rates-popup").on("click", function () {
    $(".js__rates-popup").show();
  });

  $(".js__modal-close").on("click", function () {
    $(".modal").hide();
  });
  $(document).keydown(function (event) {
    if (event.keyCode == 27) {
      $(".modal").hide();
    }
  });
});

/*First tab link and first tab content active */
jQuery(document).ready(function ($) {
  $(".tab-link").first().addClass("active");
  $(".pdp-tab-link").first().addClass("active");
  $(".shopify-section .tab-content").first().show();
  $(".pdp-tab-section .tab-content").first().show();
  $(".pdp-tab-small .tab-content").first().show();
  $(".pdp-tab-content").first().show();
  $(document).on("click", ".js__tab-small", function (e) {
    e.preventDefault();
    if (
      $(this)
        .parent(".tab-content")
        .children(".accordion-con")
        .css("display") == "none"
    ) {
      // $(".accordion-con").slideUp();
      // $(".accordion-con").removeClass("active");
      // $(".accordion-link").removeClass("active");
      // $(".tab-content").removeClass("active");

      $(".tab-link").removeClass("active");

      $(this).parent(".tab-content").children(".accordion-con").slideDown();
      $(this)
        .parent(".tab-content")
        .children(".accordion-con")
        .addClass("active");
      // $(this).parent(".tab-content").addClass("active");
      $(this)
        .parent(".tab-content")
        .children(".accordion-link")
        .addClass("active");
      var dataId = $(this).parent(".tab-content").attr("data-attr");
      document.getElementById(dataId).className += " active";
      $("html,body").animate(
        {
          scrollTop: $(this).offset().top - 120,
        },
        500
      );
    } else {
      // $(".accordion-con").slideUp();
      // $(".accordion-con").removeClass("active");
      // $(".tab-content").removeClass("active");
      $(this)
        .parent(".tab-content")
        .children(".accordion-link")
        .removeClass("active");
      // $(this).parent(".tab-content").removeClass("active");
      $(this)
        .parent(".tab-content")
        .children(".accordion-con")
        .removeClass("active");
    }
  });
  $(document).on("click", ".js___accordion", function (e) {
    e.preventDefault();
    if (
      $(this)
        .parent(".tab-content")
        .children(".accordion-con")
        .css("display") == "none"
    ) {
      $(".accordion-con").slideUp();
      $(".accordion-con").removeClass("active");
      $(".accordion-link").removeClass("active");
      // $(".tab-content").removeClass("active");
      $(".tab-link").removeClass("active");

      $(this).parent(".tab-content").children(".accordion-con").slideDown();
      $(this)
        .parent(".tab-content")
        .children(".accordion-con")
        .addClass("active");
      // $(this).parent(".tab-content").addClass("active");
      $(this)
        .parent(".tab-content")
        .children(".accordion-link")
        .addClass("active");
      var dataId = $(this).parent(".tab-content").attr("data-attr");
      document.getElementById(dataId).className += " active";
      $("html,body").animate(
        {
          scrollTop: $(this).offset().top - 120,
        },
        500
      );
    } else {
      $(".accordion-con").slideUp();
      $(".accordion-con").removeClass("active");
      // $(".tab-content").removeClass("active");
      $(this)
        .parent(".tab-content")
        .children(".accordion-link")
        .removeClass("active");
      // $(this).parent(".tab-content").removeClass("active");
      $(this)
        .parent(".tab-content")
        .children(".accordion-con")
        .removeClass("active");
    }
  });
});

/*Select Dropdown change wit Tab */
jQuery(function () {
  var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
  $(".dropdown-select option").each(function () {
    if (this.value.toLowerCase() == path.toLowerCase()) {
      this.setAttribute("selected", true);
    }
  });

  $(".dropdown-select").change(function () {
    var dropdown = $(".dropdown-select").val();
    $(".js__faq-search-section").addClass("hide");
    $(".js__faq-tab").removeClass("hide");
    $("#txt-faq-search").val("");
    $(".js__no-data-found").addClass("hide");
    //first hide all tabs again when a new option is selected
    $(".tab-content").hide();
    //then show the tab content of whatever option value was selected
    $("#" + "tab-" + dropdown).show();
    if (dropdown == "all") {
      $(".js__tab-content").each(function () {
        if (
          $(this).find(".js__accordian").html().trim() ==
          "<li>Sorry Data Is Not Added Yet</li>"
        ) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    }
  });
  $(".js__tab-content").each(function () {
    if ($(this).find(".js__accordian").html().trim() == "") {
      $(this)
        .find(".js__accordian")
        .html("<li>Sorry Data Is Not Added Yet</li>");
    }
  });
});
/*Blog content checking if p tag has image then adding class*/

jQuery(function ($) {
  $(".article-content p").each(function () {
    const $p = $(this);

    // Check if paragraph has img or iframe
    if ($p.find("img, iframe").length) {
      $p.addClass("full-width");

      // Wrap text nodes
      $p.contents().each(function () {
        if (this.nodeType === 3 && this.nodeValue.trim().length > 0) {
          $(this).replaceWith(
            '<span class="text-content">' + this.nodeValue + "</span>"
          );
        }
      });
    } else {
      // Wrap text-only paragraphs
      if (!$p.find("span.text-content").length) {
        $p.contents()
          .filter(function () {
            return this.nodeType === 3 && this.nodeValue.trim().length > 0;
          })
          .wrap('<span class="text-content"></span>');
      }
    }

    // 👇 check for video after everything
    if ($p.find(".video-wrapper").length) {
      $p.addClass("has-video");
    }
  });
});

// jQuery(document).ready(function ($) {
//     // Get the element
//     for (var i = 0; i < 250; i++) {
//       var marqueeFooter = document.querySelector('.js__marquee-right .repeat');
//       // Create a copy of it
//       var cloneFooter = marqueeFooter.cloneNode(true);
//       // Inject it into the DOM
//       marqueeFooter.before(cloneFooter);
//     }
//   });

/* quick view modal pop up */

  /*Quantity Plus Minus*/
    $(document).on("click", ".js__popup-quantity .js-plus-minus-qty", function(e) {

        var type = $(this).attr("data-type");
        var productQuantity = $(this).parent(".js__popup-quantity").find(".qty-val").val();
        if (type == "minus") {
            if (productQuantity > 1) {
                productQuantity--;
            }
        } else {
            productQuantity++;
        }
        $(this).parent(".js__popup-quantity").find(".qty-val").val(productQuantity);
    });

 /* Product card click - open quick view pop up */
    $(document).on("click", ".js__quick-view-click", function(e) {

        e.preventDefault();
        e.stopImmediatePropagation();
        var id = $(this).attr("data-id");
        //Executed after SWYM has loaded all necessary resources.
      
      var productTItle=$(this).attr("title")
      $(".js__popup-product-name-" + id).html(productTItle)
       
       

        $(".js__popup-variant-select-" + id + " li:first-child").click();
        // show modal pop up
        $("#modal-" + id).show();
       
       


    });

     /* Quick View - Variant Radio Button Clicks */
    $(document).on("click", ".js__popup-variant-select li", function(e) {
        $(this).parent("ul").children("li").removeClass("active");
        
        var option = $(this).attr("data-value");
        var optionDisplayText = $(this).text() || $(this).html(); // Get the displayed text as well
        var optionPosition = parseInt($(this).attr("data-option")) || 1; // Get which option position (1, 2, or 3)
        $(this).addClass("active");
        var pID = $(this).attr("data-id");
        
        // Validate required attributes
        if (!pID) {
            return;
        }
        
        var $productSelect = $("#product-select-" + pID);
        if ($productSelect.length === 0) {
            return;
        }
        
        // Normalize the option value for comparison - handles quotes, whitespace, and HTML entities
        var normalizeString = function(str) {
            if (!str) return "";
            var text = str.toString();
            // Decode HTML entities
            var tempDiv = $('<div>').html(text);
            text = tempDiv.text() || text;
            // Normalize all types of quotes to a single quote character
            text = text.replace(/[""''`]/g, '"');
            // Normalize whitespace
            text = text.replace(/\s+/g, ' ');
            return text.trim();
        };
        
        // Check if data-value seems incomplete (shorter than displayed text by significant amount)
        // This handles cases where data-value is malformed due to unescaped quotes in HTML
        var normalizedDisplayText = normalizeString(optionDisplayText);
        var normalizedOption = option ? normalizeString(option) : "";
        
        // If data-value is missing or significantly shorter than displayed text, prioritize displayed text
        // Also check if they're very different (data-value might be truncated due to quote issues)
        var useDisplayText = false;
        if (!normalizedOption || normalizedDisplayText.length > normalizedOption.length * 1.5) {
            useDisplayText = true;
        }
        
        // Build array of options to try - prioritize displayed text if data-value seems broken
        var optionsToTry = [];
        if (useDisplayText && normalizedDisplayText) {
            optionsToTry.push(normalizedDisplayText);
        }
        if (normalizedOption && normalizedOption !== normalizedDisplayText) {
            optionsToTry.push(normalizedOption);
        }
        if (!useDisplayText && normalizedDisplayText) {
            optionsToTry.push(normalizedDisplayText);
        }
        var matchFound = false;
        $productSelect.find("option").each(function(index) {
            if (matchFound) {
                return false; // Break loop
            }
            
            // Use text() instead of html() to get plain text content without HTML encoding issues
            var optionName = $(this).text() || $(this).html();
            var vID = $(this).attr("value");
            var variantSoldout = $(this).attr("data-soldout");
            var price = $(this).attr("data-price");
            
            // Validate optionName before processing
            if (!optionName || !vID) {
                return true; // Continue to next iteration
            }
            
            // Normalize the option name for comparison
            var normalizedOptionName = normalizeString(optionName);
            
            // Try multiple matching strategies:
            var isMatch = false;
            
            // 1. Exact match (for single option products)
            for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
                var currentOption = optionsToTry[optIdx];
                if (normalizedOptionName === currentOption) {
                    isMatch = true;
                    break;
                }
            }
            
            // 2. If not exact match, try splitting by common separators (/, -, |)
            // This handles multi-option products where variant.title = "Option1 / Option2 / Option3"
            if (!isMatch) {
                var separators = [' / ', ' - ', ' | ', ' /', '/ ', ' -', '- ', ' |', '| ', '/', '-', '|'];
                var variantParts = [normalizedOptionName];
                
                // Split by separators
                for (var i = 0; i < separators.length; i++) {
                    if (normalizedOptionName.indexOf(separators[i]) !== -1) {
                        variantParts = normalizedOptionName.split(separators[i]).map(function(part) {
                            return normalizeString(part);
                        });
                        break;
                    }
                }
                
                // Check all parts of the variant title for a match with any of our option values
                for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
                    var currentOption = optionsToTry[optIdx];
                    for (var j = 0; j < variantParts.length; j++) {
                        if (variantParts[j] === currentOption) {
                            isMatch = true;
                            break;
                        }
                    }
                    if (isMatch) break;
                }
            }
            
            // 3. Check if variant title starts with any of our option values (for when it's the first option)
            if (!isMatch) {
                for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
                    var currentOption = optionsToTry[optIdx];
                    if (normalizedOptionName.indexOf(currentOption) === 0) {
                        isMatch = true;
                        break;
                    }
                }
            }
            
            // 4. Fallback: Check if option value is contained anywhere in variant title
            // This handles edge cases where format might be different or has extra characters
            if (!isMatch) {
                for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
                    var currentOption = optionsToTry[optIdx];
                    if (currentOption.length >= 3 && normalizedOptionName.indexOf(currentOption) !== -1) {
                        isMatch = true;
                        break;
                    }
                }
            }
            
            // 5. Final fallback: Compare normalized versions removing all special characters except alphanumeric and spaces
            // This is the most lenient check for edge cases with special formatting
            if (!isMatch) {
                var cleanOptionName = normalizedOptionName.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
                for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
                    var currentOption = optionsToTry[optIdx];
                    if (currentOption.length >= 3) {
                        var cleanOption = currentOption.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().trim();
                        if (cleanOption && cleanOptionName.indexOf(cleanOption) !== -1) {
                            isMatch = true;
                            break;
                        }
                    }
                }
            }
            
            if (isMatch) {
                matchFound = true;
                var $priceContainer = $(".js__price-popup-price-" + pID);
                if ($priceContainer.length) {
                    var displayPrice = price || optionName;
                    if (displayPrice) {
                        var decodedPrice = $("<div>").html(displayPrice).text();
                        var $priceTextEl = $priceContainer.find(".js__price-popup-price-text");
                        if (!$priceTextEl.length) {
                            $priceTextEl = $priceContainer.find("span").first();
                        }
                        if ($priceTextEl.length) {
                            $priceTextEl.text(decodedPrice);
                        } else {
                            $priceContainer.text(decodedPrice);
                        }

                        var numericPrice = decodedPrice.replace(/[^0-9.,]/g, "").replace(/,/g, "");
                        var numericPriceValue = parseFloat(numericPrice);
                        if (!isNaN(numericPriceValue)) {
                            $priceContainer.attr("content", numericPriceValue.toFixed(2));
                        }
                    }
                    $priceContainer.css("display", "").show();
                }
                $productSelect.val(vID);
                
                if (variantSoldout == "true") {
                    $(".js__modal-popup-qty-" + pID).hide();
                    $(".js__modal-popup-addtocart-" + pID).attr("disabled", "disabled");
                    //update the text for the add to cart button to sold out
                    $(".js__modal-popup-addtocart-" + pID).html("Soldout");
                } else {
                    $(".js__modal-popup-qty-" + pID).show();
                    //update the text for the button to add to cart, if not sold out
                    $(".js__modal-popup-addtocart-" + pID).html("Add to Cart");
                    // if not sold out, then remove the attr disabled
                    $(".js__modal-popup-addtocart-" + pID).removeAttr("disabled");
                }
                
                // update the variant ID for the data-variant-id
                $(".js__modal-popup-addtocart-" + pID).attr("data-variant-id", vID);
                /* Not sure what are they being used for */
                // $(".discount_variant-" + pID + " span").hide();
                //$(".js__popup-variant-price-" + vID).show();
                //$(".js__rc_block__type__onetime-" + pID).find(".rc_price__onetime").html(price);
                //$(".modal-popup-price-subcription-" + pID).html($(".js__popup-variant-price-" + vID).html());
                
                return false; // Break loop
            }
        });

        /* Not being used any more */
        //$(".js__rc_radio_options-" + pID + " .rc_block__type-modal-popup.rc_block__type--active").click();
    });

     $(document).on("click", ".js__modal-popup-addtocart", function(e) {
        console.log("click")
        var pID = $(this).attr("data-id");
        console.log("pID"+pID)
        var selectedVariantID = $(this).attr("data-variant-id");
        console.log("pID"+selectedVariantID)
        var quantity = parseInt($(".js-quantity-selector-" + pID).val());
        var recharge = $(".js__rc_radio_options-" + pID).html()

        let items = [];
        if (recharge == undefined) {
            /* For the main item */
            items.push({
                id: selectedVariantID,
                quantity: quantity,
            });
        } else {
            if ($(".js__rc_radio_options-" + pID + " .rc_block__type-modal-popup.rc_block__type--active").hasClass("rc_block__type__onetime")) {

                items.push({
                    id: selectedVariantID,
                    quantity: quantity,
                });
            } else {
                var shippingIntervalFrequency = $(".js__shipping_interval_frequency-" + pID).val();
                var shippingIntervalUnitType = $(".js__shipping_interval_unit_type-" + pID).html();
                items.push({
                    id: selectedVariantID,
                    quantity: quantity,
                    "properties[shipping_interval_frequency]": shippingIntervalFrequency,
                    "properties[shipping_interval_unit_type]": shippingIntervalUnitType
                });

            }

        }



        CartJS.addItems(items, {
            success: function(response, textStatus, jqXHR) {
               
                console.log("success")
                $(".modal-quick-view").hide();
                if (getglobalLib("Mini_Cart") == "yes") {
                    /* Show message */
                    setTimeout(openMiniCart, 500);
                } else {
                    window.location = "/cart";
                }
            },
            // Define an error callback to display an error message.
            error: function(jqXHR, textStatus, errorThrown) {
                showCartErrorMessage();
                console.log("error")
            },
        });
    })

$(document).on("click", ".js__quick-view-popup-close", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".modal-quick-view").hide();
    });


jQuery(document).ready(function ($) {
  $(".hero-banner-slider .content").addClass("animate");
});

$(document).ready(function ($) {
  $(".js__btn-faq-search").on("click", function () {
    var search = $("#txt-faq-search").val().toLowerCase();
    if (search != "") {
      $(".js__no-data-found").removeClass("hide");
      $(".tab-link").removeClass("active");
      $(".dropdown-select").val("all");
      //Go through each list item and hide if not match search
      $(".js__faq-search-section").removeClass("hide");
      $(".js__faq-search-section").find(".tab-content").show();
      $(".js__faq-tab").addClass("hide");
      $(".js__faq-search li").each(function () {
        if ($(this).children("h3").html().toLowerCase().indexOf(search) != -1) {
          $(this).show();
          $(".js__no-data-found").addClass("hide");
        } else {
          $(this).hide();
        }
      });
    }
  });
});
jQuery(document).ready(function ($) {
  $(document).on("click", ".js__card-add-to-cart", function (e) {
    console.log("add to cart clicked");
    var selectedVariantID = $(this).attr("data-variant-id");
    var quantity = 1;

    let items = [];

    /* For the main item */
    items.push({
      id: selectedVariantID,
      quantity: quantity,
    });

    CartJS.addItems(items, {
      success: function (response, textStatus, jqXHR) {
          console.log("success adding to cart");
        $(".modal-quick-view").hide();
        $(".js__card-add-to-cart-"+selectedVariantID).addClass("added");
        $(".js__card-add-to-cart-"+selectedVariantID).html("Added");
        if (getglobalLib("Mini_Cart") == "yes") {
          /* Show message */
          setTimeout(openMiniCart, 500);
        } else {
          window.location = "/cart";
        }
      },
      // Define an error callback to display an error message.
      error: function (jqXHR, textStatus, errorThrown) {
        showCartErrorMessage();
          console.log("error adding to cart");
      },
    });
  });
});
jQuery(document).ready(function ($) {
  $(".js__read-mode-toggle").on("click", function () {
    if ($(this).hasClass("active")) {
      $(this)
        .parent(".mobile-block")
        .parent(".js__description-outer")
        .find(".desktopdescription")
        .removeClass("active");

      $(this).removeClass("active");
      $(this).html("Read More");
    } else {
      $(this)
        .parent(".mobile-block")
        .parent(".js__description-outer")
        .find(".desktopdescription")
        .addClass("active");
      $(this).addClass("active");
      $(this).html("Read Less");
    }
  });
});

// Footer DropDown Of Link
jQuery(document).ready(function ($) {
  $(".footer-links .accordion-toggle").on("click", function (e) {
    if ($(window).width() <= 768) {
      e.preventDefault();
      e.stopPropagation();

      const $toggle = $(this);
      const $content = $toggle.next(".accordion-content");

      if ($toggle.hasClass("active")) {
        // 🔽 Already open → close it
        $toggle.removeClass("active");
        $content.slideUp(300);
      } else {
        // 🔼 Open this one and close others
        $(".footer-links .accordion-toggle").removeClass("active");
        $(".footer-links .accordion-content").slideUp(300);

        $toggle.addClass("active");
        $content.slideDown(300);
      }
    }
  });

  // Reset state when resizing back to desktop
  $(window).on("resize", function () {
    if ($(window).width() > 768) {
      $(".footer-links .accordion-content").show();
      $(".footer-links .accordion-toggle").removeClass("active");
    }
  });
});
$(document).ready(function () {
  function hideBlogExtraSections() {
    // Run only on blog pages
    if (window.location.pathname.includes("/blogs/")) {
      const params = new URLSearchParams(window.location.search);
      const currentPage = params.get("page");

      // Hide featured and popular sections if not first page
      if (currentPage && currentPage !== "1") {
        $(".featured-blog-section, .three-column-blog-slider").hide();
      }
    }
  }

  // Wait until those sections actually load (important for JSON templates)
  const checkSections = setInterval(function () {
    if ($(".featured-blog-section").length || $(".three-column-blog-slider").length) {
      hideBlogExtraSections();
      clearInterval(checkSections);
    }
  }, 300);

  // Also run immediately in case they’re already present
  hideBlogExtraSections();
});
jQuery(document).ready(function ($) {
  const $popup = $(".article-video-popup");

  // 🔹 Open popup
  $(".video-wrapper").on("click", function () {
    var id=$(this).attr("data-id");
    $("#modal-video-popup-"+id).fadeIn(200).css("display", "flex");
  });

  // 🔹 Close popup on close button OR clicking outside
 /* $(".close-popup, .article-video-popup").on("click", function (e) {
    if ($(e.target).is(".article-video-popup, .close-popup")) {
      $popup.fadeOut(200);
    }
  });*/
    $(document).on("click", ".article-video-popup", function (e) {
    if (
      !(
        $(e.target).closest(".video-popup-inner").length > 0 ||
        $(e.target).closest(".close-popup").length > 0
      )
    ) {
      $(this).hide();
    }
  });

   $(".close-popup").on("click", function () {
    $(".article-video-popup").hide();
  });
  $(document).keydown(function (event) {
    if (event.keyCode == 27) {
      $(".article-video-popup").hide();
    }
  });
});
