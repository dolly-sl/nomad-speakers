(function(window, document, jQuery, undefined) {
    "use strict";

    window.console = window.console || {
        info: function(stuff) {}
    };

    // If there's no jQuery, fancyBox can't work
    // =========================================

    if (!jQuery) {
        return;
    }

    // Check if fancyBox is already initialized
    // ========================================

    if (jQuery.fn.fancybox) {
        console.info("fancyBox already initialized");

        return;
    }

    // Private default settings
    // ========================

    var defaults = {
        // Enable infinite gallery navigation
        loop: true,

        // Horizontal space between slides
        gutter: 50,

        // Enable keyboard navigation
        keyboard: true,

        // Should display navigation arrows at the screen edges
        arrows: true,

        // Should display counter at the top left corner
        infobar: true,

        // Should display close button (using `btnTpl.smallBtn` template) over the content
        // Can be true, false, "auto"
        // If "auto" - will be automatically enabled for "html", "inline" or "ajax" items
        smallBtn: "auto",

        // Should display toolbar (buttons at the top)
        // Can be true, false, "auto"
        // If "auto" - will be automatically hidden if "smallBtn" is enabled
        toolbar: "auto",

        // What buttons should appear in the top right corner.
        // Buttons will be created using templates from `btnTpl` option
        // and they will be placed into toolbar (class="fancybox-toolbar"` element)
        buttons: [
            "zoom",
            //"share",
            //"slideShow",
            //"fullScreen",
            //"download",
            "thumbs",
            "close"
        ],

        // Detect "idle" time in seconds
        idleTime: 3,

        // Disable right-click and use simple image protection for images
        protect: false,

        // Shortcut to make content "modal" - disable keyboard navigtion, hide buttons, etc
        modal: false,

        image: {
            // Wait for images to load before displaying
            //   true  - wait for image to load and then display;
            //   false - display thumbnail and load the full-sized image over top,
            //           requires predefined image dimensions (`data-width` and `data-height` attributes)
            preload: false
        },

        ajax: {
            // Object containing settings for ajax request
            settings: {
                // This helps to indicate that request comes from the modal
                // Feel free to change naming
                data: {
                    fancybox: true
                }
            }
        },

        iframe: {
            // Iframe template
            tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',

            // Preload iframe before displaying it
            // This allows to calculate iframe content width and height
            // (note: Due to "Same Origin Policy", you can't get cross domain data).
            preload: true,

            // Custom CSS styling for iframe wrapping element
            // You can use this to set custom iframe dimensions
            css: {},

            // Iframe tag attributes
            attr: {
                scrolling: "auto"
            }
        },

        // Default content type if cannot be detected automatically
        defaultType: "image",

        // Open/close animation type
        // Possible values:
        //   false            - disable
        //   "zoom"           - zoom images from/to thumbnail
        //   "fade"
        //   "zoom-in-out"
        //
        animationEffect: "zoom",

        // Duration in ms for open/close animation
        animationDuration: 366,

        // Should image change opacity while zooming
        // If opacity is "auto", then opacity will be changed if image and thumbnail have different aspect ratios
        zoomOpacity: "auto",

        // Transition effect between slides
        //
        // Possible values:
        //   false            - disable
        //   "fade'
        //   "slide'
        //   "circular'
        //   "tube'
        //   "zoom-in-out'
        //   "rotate'
        //
        transitionEffect: "fade",

        // Duration in ms for transition animation
        transitionDuration: 366,

        // Custom CSS class for slide element
        slideClass: "",

        // Custom CSS class for layout
        baseClass: "",

        // Base template for layout
        baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1">' +
            '<div class="fancybox-bg"></div>' +
            '<div class="fancybox-inner">' +
            '<div class="fancybox-infobar">' +
            "<span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span>" +
            "</div>" +
            '<div class="fancybox-toolbar">{{buttons}}</div>' +
            '<div class="fancybox-navigation">{{arrows}}</div>' +
            '<div class="fancybox-stage"></div>' +
            '<div class="fancybox-caption"></div>' +
            "</div>" +
            "</div>",

        // Loading indicator template
        spinnerTpl: '<div class="fancybox-loading"></div>',

        // Error message template
        errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',

        btnTpl: {
            download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M13,16 L20,23 L27,16 M20,7 L20,23 M10,24 L10,28 L30,28 L30,24" />' +
                "</svg>" +
                "</a>",

            zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M18,17 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M24,22 L31,29" />' +
                "</svg>" +
                "</button>",

            close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M10,10 L30,30 M30,10 L10,30" />' +
                "</svg>" +
                "</button>",

            // This small close button will be appended to your html/inline/ajax content by default,
            // if "smallBtn" option is not set to false
            smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"><svg viewBox="0 0 32 32"><path d="M10,10 L22,22 M22,10 L10,22"></path></svg></button>',

            // Arrows
            arrowLeft: '<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}" href="javascript:;">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M18,12 L10,20 L18,28 M10,20 L30,20"></path>' +
                "</svg>" +
                "</a>",

            arrowRight: '<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}" href="javascript:;">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M10,20 L30,20 M22,12 L30,20 L22,28"></path>' +
                "</svg>" +
                "</a>"
        },

        // Container is injected into this element
        parentEl: "body",

        // Focus handling
        // ==============

        // Try to focus on the first focusable element after opening
        autoFocus: false,

        // Put focus back to active element after closing
        backFocus: true,

        // Do not let user to focus on element outside modal content
        trapFocus: true,

        // Module specific options
        // =======================

        fullScreen: {
            autoStart: false
        },

        // Set `touch: false` to disable dragging/swiping
        touch: {
            vertical: true, // Allow to drag content vertically
            momentum: true // Continue movement after releasing mouse/touch when panning
        },

        // Hash value when initializing manually,
        // set `false` to disable hash change
        hash: null,

        // Customize or add new media types
        // Example:
        /*
            media : {
                youtube : {
                    params : {
                        autoplay : 0
                    }
                }
            }
            */
        media: {},

        slideShow: {
            autoStart: false,
            speed: 4000
        },

        thumbs: {
            autoStart: false, // Display thumbnails on opening
            hideOnClose: true, // Hide thumbnail grid when closing animation starts
            parentEl: ".fancybox-container", // Container is injected into this element
            axis: "y" // Vertical (y) or horizontal (x) scrolling
        },

        // Use mousewheel to navigate gallery
        // If 'auto' - enabled for images only
        wheel: "auto",

        // Callbacks
        //==========

        // See Documentation/API/Events for more information
        // Example:
        /*
            afterShow: function( instance, current ) {
                console.info( 'Clicked element:' );
                console.info( current.opts.jQueryorig );
            }
        */

        onInit: jQuery.noop, // When instance has been initialized

        beforeLoad: jQuery.noop, // Before the content of a slide is being loaded
        afterLoad: jQuery.noop, // When the content of a slide is done loading

        beforeShow: jQuery.noop, // Before open animation starts
        afterShow: jQuery.noop, // When content is done loading and animating

        beforeClose: jQuery.noop, // Before the instance attempts to close. Return false to cancel the close.
        afterClose: jQuery.noop, // After instance has been closed

        onActivate: jQuery.noop, // When instance is brought to front
        onDeactivate: jQuery.noop, // When other instance has been activated

        // Interaction
        // ===========

        // Use options below to customize taken action when user clicks or double clicks on the fancyBox area,
        // each option can be string or method that returns value.
        //
        // Possible values:
        //   "close"           - close instance
        //   "next"            - move to next gallery item
        //   "nextOrClose"     - move to next gallery item or close if gallery has only one item
        //   "toggleControls"  - show/hide controls
        //   "zoom"            - zoom image (if loaded)
        //   false             - do nothing

        // Clicked on the content
        clickContent: function(current, event) {
            return current.type === "image" ? "zoom" : false;
        },

        // Clicked on the slide
        clickSlide: "close",

        // Clicked on the background (backdrop) element;
        // if you have not changed the layout, then most likely you need to use `clickSlide` option
        clickOutside: "close",

        // Same as previous two, but for double click
        dblclickContent: false,
        dblclickSlide: false,
        dblclickOutside: false,

        // Custom options when mobile device is detected
        // =============================================

        mobile: {
            idleTime: false,
            clickContent: function(current, event) {
                return current.type === "image" ? "toggleControls" : false;
            },
            clickSlide: function(current, event) {
                return current.type === "image" ? "toggleControls" : "close";
            },
            dblclickContent: function(current, event) {
                return current.type === "image" ? "zoom" : false;
            },
            dblclickSlide: function(current, event) {
                return current.type === "image" ? "zoom" : false;
            }
        },

        // Internationalization
        // ====================

        lang: "en",
        i18n: {
            en: {
                CLOSE: "Close",
                NEXT: "Next",
                PREV: "Previous",
                ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                PLAY_START: "Start slideshow",
                PLAY_STOP: "Pause slideshow",
                FULL_SCREEN: "Full screen",
                THUMBS: "Thumbnails",
                DOWNLOAD: "Download",
                SHARE: "Share",
                ZOOM: "Zoom"
            },
            de: {
                CLOSE: "Schliessen",
                NEXT: "Weiter",
                PREV: "ZurÃ¼ck",
                ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es spÃ¤ter nochmal.",
                PLAY_START: "Diaschau starten",
                PLAY_STOP: "Diaschau beenden",
                FULL_SCREEN: "Vollbild",
                THUMBS: "Vorschaubilder",
                DOWNLOAD: "Herunterladen",
                SHARE: "Teilen",
                ZOOM: "MaÃŸstab"
            }
        }
    };

    // Few useful variables and methods
    // ================================

    var jQueryW = jQuery(window);
    var jQueryD = jQuery(document);

    var called = 0;

    // Check if an object is a jQuery object and not a native JavaScript object
    // ========================================================================
    var isQuery = function(obj) {
        return obj && obj.hasOwnProperty && obj instanceof jQuery;
    };

    // Handle multiple browsers for "requestAnimationFrame" and "cancelAnimationFrame"
    // ===============================================================================
    var requestAFrame = (function() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            // if all else fails, use setTimeout
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    })();

    // Detect the supported transition-end event property name
    // =======================================================
    var transitionEnd = (function() {
        var el = document.createElement("fakeelement"),
            t;

        var transitions = {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }

        return "transitionend";
    })();

    // Force redraw on an element.
    // This helps in cases where the browser doesn't redraw an updated element properly
    // ================================================================================
    var forceRedraw = function(jQueryel) {
        return jQueryel && jQueryel.length && jQueryel[0].offsetHeight;
    };

    // Exclude array (`buttons`) options from deep merging
    // ===================================================
    var mergeOpts = function(opts1, opts2) {
        var rez = jQuery.extend(true, {}, opts1, opts2);

        jQuery.each(opts2, function(key, value) {
            if (jQuery.isArray(value)) {
                rez[key] = value;
            }
        });

        return rez;
    };

    // Class definition
    // ================

    var FancyBox = function(content, opts, index) {
        var self = this;

        self.opts = mergeOpts({ index: index }, jQuery.fancybox.defaults);

        if (jQuery.isPlainObject(opts)) {
            self.opts = mergeOpts(self.opts, opts);
        }

        if (jQuery.fancybox.isMobile) {
            self.opts = mergeOpts(self.opts, self.opts.mobile);
        }

        self.id = self.opts.id || ++called;

        self.currIndex = parseInt(self.opts.index, 10) || 0;
        self.prevIndex = null;

        self.prevPos = null;
        self.currPos = 0;

        self.firstRun = true;

        // All group items
        self.group = [];

        // Existing slides (for current, next and previous gallery items)
        self.slides = {};

        // Create group elements
        self.addContent(content);

        if (!self.group.length) {
            return;
        }

        // Save last active element
        self.jQuerylastFocus = jQuery(document.activeElement).trigger("blur");

        self.init();
    };

    jQuery.extend(FancyBox.prototype, {
        // Create DOM structure
        // ====================

        init: function() {
            var self = this,
                firstItem = self.group[self.currIndex],
                firstItemOpts = firstItem.opts,
                scrollbarWidth = jQuery.fancybox.scrollbarWidth,
                jQueryscrollDiv,
                jQuerycontainer,
                buttonStr;

            // Hide scrollbars
            // ===============

            if (!jQuery.fancybox.getInstance() && firstItemOpts.hideScrollbar !== false) {
                jQuery("body").addClass("fancybox-active");

                if (!jQuery.fancybox.isMobile && document.body.scrollHeight > window.innerHeight) {
                    if (scrollbarWidth === undefined) {
                        jQueryscrollDiv = jQuery('<div style="width:100px;height:100px;overflow:scroll;" />').appendTo("body");

                        scrollbarWidth = jQuery.fancybox.scrollbarWidth = jQueryscrollDiv[0].offsetWidth - jQueryscrollDiv[0].clientWidth;

                        jQueryscrollDiv.remove();
                    }

                    jQuery("head").append(
                        '<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: ' +
                        scrollbarWidth +
                        "px; }</style>"
                    );

                    jQuery("body").addClass("compensate-for-scrollbar");
                }
            }

            // Build html markup and set references
            // ====================================

            // Build html code for buttons and insert into main template
            buttonStr = "";

            jQuery.each(firstItemOpts.buttons, function(index, value) {
                buttonStr += firstItemOpts.btnTpl[value] || "";
            });

            // Create markup from base template, it will be initially hidden to
            // avoid unnecessary work like painting while initializing is not complete
            jQuerycontainer = jQuery(
                    self.translate(
                        self,
                        firstItemOpts.baseTpl
                        .replace("{{buttons}}", buttonStr)
                        .replace("{{arrows}}", firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight)
                    )
                )
                .attr("id", "fancybox-container-" + self.id)
                .addClass("fancybox-is-hidden")
                .addClass(firstItemOpts.baseClass)
                .data("FancyBox", self)
                .appendTo(firstItemOpts.parentEl);

            // Create object holding references to jQuery wrapped nodes
            self.jQueryrefs = {
                container: jQuerycontainer
            };

            ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function(item) {
                self.jQueryrefs[item] = jQuerycontainer.find(".fancybox-" + item);
            });

            self.trigger("onInit");

            // Enable events, deactive previous instances
            self.activate();

            // Build slides, load and reveal content
            self.jumpTo(self.currIndex);
        },

        // Simple i18n support - replaces object keys found in template
        // with corresponding values
        // ============================================================

        translate: function(obj, str) {
            var arr = obj.opts.i18n[obj.opts.lang];

            return str.replace(/\{\{(\w+)\}\}/g, function(match, n) {
                var value = arr[n];

                if (value === undefined) {
                    return match;
                }

                return value;
            });
        },

        // Populate current group with fresh content
        // Check if each object has valid type and content
        // ===============================================

        addContent: function(content) {
            var self = this,
                items = jQuery.makeArray(content),
                thumbs;

            jQuery.each(items, function(i, item) {
                var obj = {},
                    opts = {},
                    jQueryitem,
                    type,
                    found,
                    src,
                    srcParts;

                // Step 1 - Make sure we have an object
                // ====================================

                if (jQuery.isPlainObject(item)) {
                    // We probably have manual usage here, something like
                    // jQuery.fancybox.open( [ { src : "image.jpg", type : "image" } ] )

                    obj = item;
                    opts = item.opts || item;
                } else if (jQuery.type(item) === "object" && jQuery(item).length) {
                    // Here we probably have jQuery collection returned by some selector
                    jQueryitem = jQuery(item);

                    // Support attributes like `data-options='{"touch" : false}'` and `data-touch='false'`
                    opts = jQueryitem.data() || {};
                    opts = jQuery.extend(true, {}, opts, opts.options);

                    // Here we store clicked element
                    opts.jQueryorig = jQueryitem;

                    obj.src = self.opts.src || opts.src || jQueryitem.attr("href");

                    // Assume that simple syntax is used, for example:
                    //   `jQuery.fancybox.open( jQuery("#test"), {} );`
                    if (!obj.type && !obj.src) {
                        obj.type = "inline";
                        obj.src = item;
                    }
                } else {
                    // Assume we have a simple html code, for example:
                    //   jQuery.fancybox.open( '<div><h1>Hi!</h1></div>' );
                    obj = {
                        type: "html",
                        src: item + ""
                    };
                }

                // Each gallery object has full collection of options
                obj.opts = jQuery.extend(true, {}, self.opts, opts);

                // Do not merge buttons array
                if (jQuery.isArray(opts.buttons)) {
                    obj.opts.buttons = opts.buttons;
                }

                // Step 2 - Make sure we have content type, if not - try to guess
                // ==============================================================

                type = obj.type || obj.opts.type;
                src = obj.src || "";

                if (!type && src) {
                    if ((found = src.match(/\.(mp4|mov|ogv)((\?|#).*)?jQuery/i))) {
                        type = "video";

                        if (!obj.opts.videoFormat) {
                            obj.opts.videoFormat = "video/" + (found[1] === "ogv" ? "ogg" : found[1]);
                        }
                    } else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?jQuery)/i)) {
                        type = "image";
                    } else if (src.match(/\.(pdf)((\?|#).*)?jQuery/i)) {
                        type = "iframe";
                    } else if (src.charAt(0) === "#") {
                        type = "inline";
                    }
                }

                if (type) {
                    obj.type = type;
                } else {
                    self.trigger("objectNeedsType", obj);
                }

                if (!obj.contentType) {
                    obj.contentType = jQuery.inArray(obj.type, ["html", "inline", "ajax"]) > -1 ? "html" : obj.type;
                }

                // Step 3 - Some adjustments
                // =========================

                obj.index = self.group.length;

                if (obj.opts.smallBtn == "auto") {
                    obj.opts.smallBtn = jQuery.inArray(obj.type, ["html", "inline", "ajax"]) > -1;
                }

                if (obj.opts.toolbar === "auto") {
                    obj.opts.toolbar = !obj.opts.smallBtn;
                }

                // Find thumbnail image
                if (obj.opts.jQuerytrigger && obj.index === self.opts.index) {
                    obj.opts.jQuerythumb = obj.opts.jQuerytrigger.find("img:first");
                }

                if ((!obj.opts.jQuerythumb || !obj.opts.jQuerythumb.length) && obj.opts.jQueryorig) {
                    obj.opts.jQuerythumb = obj.opts.jQueryorig.find("img:first");
                }

                // "caption" is a "special" option, it can be used to customize caption per gallery item ..
                if (jQuery.type(obj.opts.caption) === "function") {
                    obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);
                }

                if (jQuery.type(self.opts.caption) === "function") {
                    obj.opts.caption = self.opts.caption.apply(item, [self, obj]);
                }

                // Make sure we have caption as a string or jQuery object
                if (!(obj.opts.caption instanceof jQuery)) {
                    obj.opts.caption = obj.opts.caption === undefined ? "" : obj.opts.caption + "";
                }

                // Check if url contains "filter" used to filter the content
                // Example: "ajax.html #something"
                if (obj.type === "ajax") {
                    srcParts = src.split(/\s+/, 2);

                    if (srcParts.length > 1) {
                        obj.src = srcParts.shift();

                        obj.opts.filter = srcParts.shift();
                    }
                }

                // Hide all buttons and disable interactivity for modal items
                if (obj.opts.modal) {
                    obj.opts = jQuery.extend(true, obj.opts, {
                        // Remove buttons
                        infobar: 0,
                        toolbar: 0,

                        smallBtn: 0,

                        // Disable keyboard navigation
                        keyboard: 0,

                        // Disable some modules
                        slideShow: 0,
                        fullScreen: 0,
                        thumbs: 0,
                        touch: 0,

                        // Disable click event handlers
                        clickContent: false,
                        clickSlide: false,
                        clickOutside: false,
                        dblclickContent: false,
                        dblclickSlide: false,
                        dblclickOutside: false
                    });
                }

                // Step 4 - Add processed object to group
                // ======================================

                self.group.push(obj);
            });

            // Update controls if gallery is already opened
            if (Object.keys(self.slides).length) {
                self.updateControls();

                // Update thumbnails, if needed
                thumbs = self.Thumbs;

                if (thumbs && thumbs.isActive) {
                    thumbs.create();

                    thumbs.focus();
                }
            }
        },

        // Attach an event handler functions for:
        //   - navigation buttons
        //   - browser scrolling, resizing;
        //   - focusing
        //   - keyboard
        //   - detect idle
        // ======================================

        addEvents: function() {
            var self = this;

            self.removeEvents();

            // Make navigation elements clickable
            self.jQueryrefs.container
                .on("click.fb-close", "[data-fancybox-close]", function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    self.close(e);
                })
                .on("touchstart.fb-prev click.fb-prev", "[data-fancybox-prev]", function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    self.previous();
                })
                .on("touchstart.fb-next click.fb-next", "[data-fancybox-next]", function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    self.next();
                })
                .on("click.fb", "[data-fancybox-zoom]", function(e) {
                    // Click handler for zoom button
                    self[self.isScaledDown() ? "scaleToActual" : "scaleToFit"]();
                });

            // Handle page scrolling and browser resizing
            jQueryW.on("orientationchange.fb resize.fb", function(e) {
                if (e && e.originalEvent && e.originalEvent.type === "resize") {
                    requestAFrame(function() {
                        self.update();
                    });
                } else {
                    self.jQueryrefs.stage.hide();

                    setTimeout(function() {
                        self.jQueryrefs.stage.show();

                        self.update();
                    }, jQuery.fancybox.isMobile ? 600 : 250);
                }
            });

            // Trap keyboard focus inside of the modal, so the user does not accidentally tab outside of the modal
            // (a.k.a. "escaping the modal")
            jQueryD.on("focusin.fb", function(e) {
                var instance = jQuery.fancybox ? jQuery.fancybox.getInstance() : null;

                if (
                    instance.isClosing ||
                    !instance.current ||
                    !instance.current.opts.trapFocus ||
                    jQuery(e.target).hasClass("fancybox-container") ||
                    jQuery(e.target).is(document)
                ) {
                    return;
                }

                if (instance && jQuery(e.target).css("position") !== "fixed" && !instance.jQueryrefs.container.has(e.target).length) {
                    e.stopPropagation();

                    instance.focus();
                }
            });

            // Enable keyboard navigation
            jQueryD.on("keydown.fb", function(e) {
                var current = self.current,
                    keycode = e.keyCode || e.which;

                if (!current || !current.opts.keyboard) {
                    return;
                }

                if (e.ctrlKey || e.altKey || e.shiftKey || jQuery(e.target).is("input") || jQuery(e.target).is("textarea")) {
                    return;
                }

                // Backspace and Esc keys
                if (keycode === 8 || keycode === 27) {
                    e.preventDefault();

                    self.close(e);

                    return;
                }

                // Left arrow and Up arrow
                if (keycode === 37 || keycode === 38) {
                    e.preventDefault();

                    self.previous();

                    return;
                }

                // Righ arrow and Down arrow
                if (keycode === 39 || keycode === 40) {
                    e.preventDefault();

                    self.next();

                    return;
                }

                self.trigger("afterKeydown", e, keycode);
            });

            // Hide controls after some inactivity period
            if (self.group[self.currIndex].opts.idleTime) {
                self.idleSecondsCounter = 0;

                jQueryD.on(
                    "mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",
                    function(e) {
                        self.idleSecondsCounter = 0;

                        if (self.isIdle) {
                            self.showControls();
                        }

                        self.isIdle = false;
                    }
                );

                self.idleInterval = window.setInterval(function() {
                    self.idleSecondsCounter++;

                    if (self.idleSecondsCounter >= self.group[self.currIndex].opts.idleTime && !self.isDragging) {
                        self.isIdle = true;
                        self.idleSecondsCounter = 0;

                        self.hideControls();
                    }
                }, 1000);
            }
        },

        // Remove events added by the core
        // ===============================

        removeEvents: function() {
            var self = this;

            jQueryW.off("orientationchange.fb resize.fb");
            jQueryD.off("focusin.fb keydown.fb .fb-idle");

            this.jQueryrefs.container.off(".fb-close .fb-prev .fb-next");

            if (self.idleInterval) {
                window.clearInterval(self.idleInterval);

                self.idleInterval = null;
            }
        },

        // Change to previous gallery item
        // ===============================

        previous: function(duration) {
            return this.jumpTo(this.currPos - 1, duration);
        },

        // Change to next gallery item
        // ===========================

        next: function(duration) {
            return this.jumpTo(this.currPos + 1, duration);
        },

        // Switch to selected gallery item
        // ===============================

        jumpTo: function(pos, duration) {
            var self = this,
                groupLen = self.group.length,
                firstRun,
                loop,
                current,
                previous,
                canvasWidth,
                currentPos,
                transitionProps;

            if (self.isDragging || self.isClosing || (self.isAnimating && self.firstRun)) {
                return;
            }

            pos = parseInt(pos, 10);

            // Should loop?
            loop = self.current ? self.current.opts.loop : self.opts.loop;

            if (!loop && (pos < 0 || pos >= groupLen)) {
                return false;
            }

            firstRun = self.firstRun = !Object.keys(self.slides).length;

            if (groupLen < 2 && !firstRun && !!self.isDragging) {
                return;
            }

            previous = self.current;

            self.prevIndex = self.currIndex;
            self.prevPos = self.currPos;

            // Create slides
            current = self.createSlide(pos);

            if (groupLen > 1) {
                if (loop || current.index > 0) {
                    self.createSlide(pos - 1);
                }

                if (loop || current.index < groupLen - 1) {
                    self.createSlide(pos + 1);
                }
            }

            self.current = current;
            self.currIndex = current.index;
            self.currPos = current.pos;

            self.trigger("beforeShow", firstRun);

            self.updateControls();

            currentPos = jQuery.fancybox.getTranslate(current.jQueryslide);

            current.isMoved = (currentPos.left !== 0 || currentPos.top !== 0) && !current.jQueryslide.hasClass("fancybox-animated");

            // Validate duration length
            current.forcedDuration = undefined;

            if (jQuery.isNumeric(duration)) {
                current.forcedDuration = duration;
            } else {
                duration = current.opts[firstRun ? "animationDuration" : "transitionDuration"];
            }

            duration = parseInt(duration, 10);

            // Fresh start - reveal container, current slide and start loading content
            if (firstRun) {
                if (current.opts.animationEffect && duration) {
                    self.jQueryrefs.container.css("transition-duration", duration + "ms");
                }

                self.jQueryrefs.container.removeClass("fancybox-is-hidden");

                forceRedraw(self.jQueryrefs.container);

                self.jQueryrefs.container.addClass("fancybox-is-open");

                forceRedraw(self.jQueryrefs.container);

                // Make current slide visible
                current.jQueryslide.addClass("fancybox-slide--previous");

                // Attempt to load content into slide;
                // at this point image would start loading, but inline/html content would load immediately
                self.loadSlide(current);

                current.jQueryslide.removeClass("fancybox-slide--previous").addClass("fancybox-slide--current");

                self.preload("image");

                return;
            }

            // Clean up
            jQuery.each(self.slides, function(index, slide) {
                jQuery.fancybox.stop(slide.jQueryslide);
            });

            // Make current that slide is visible even if content is still loading
            current.jQueryslide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current");

            // If slides have been dragged, animate them to correct position
            if (current.isMoved) {
                canvasWidth = Math.round(current.jQueryslide.width());

                jQuery.each(self.slides, function(index, slide) {
                    var pos = slide.pos - current.pos;

                    jQuery.fancybox.animate(
                        slide.jQueryslide, {
                            top: 0,
                            left: pos * canvasWidth + pos * slide.opts.gutter
                        },
                        duration,
                        function() {
                            slide.jQueryslide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous");

                            if (slide.pos === self.currPos) {
                                current.isMoved = false;

                                self.complete();
                            }
                        }
                    );
                });
            } else {
                self.jQueryrefs.stage.children().removeAttr("style");
            }

            // Start transition that reveals current content
            // or wait when it will be loaded

            if (current.isLoaded) {
                self.revealContent(current);
            } else {
                self.loadSlide(current);
            }

            self.preload("image");

            if (previous.pos === current.pos) {
                return;
            }

            // Handle previous slide
            // =====================

            transitionProps = "fancybox-slide--" + (previous.pos > current.pos ? "next" : "previous");

            previous.jQueryslide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous");

            previous.isComplete = false;

            if (!duration || (!current.isMoved && !current.opts.transitionEffect)) {
                return;
            }

            if (current.isMoved) {
                previous.jQueryslide.addClass(transitionProps);
            } else {
                transitionProps = "fancybox-animated " + transitionProps + " fancybox-fx-" + current.opts.transitionEffect;

                jQuery.fancybox.animate(previous.jQueryslide, transitionProps, duration, function() {
                    previous.jQueryslide.removeClass(transitionProps).removeAttr("style");
                });
            }
        },

        // Create new "slide" element
        // These are gallery items  that are actually added to DOM
        // =======================================================

        createSlide: function(pos) {
            var self = this,
                jQueryslide,
                index;

            index = pos % self.group.length;
            index = index < 0 ? self.group.length + index : index;

            if (!self.slides[pos] && self.group[index]) {
                jQueryslide = jQuery('<div class="fancybox-slide"></div>').appendTo(self.jQueryrefs.stage);

                self.slides[pos] = jQuery.extend(true, {}, self.group[index], {
                    pos: pos,
                    jQueryslide: jQueryslide,
                    isLoaded: false
                });

                self.updateSlide(self.slides[pos]);
            }

            return self.slides[pos];
        },

        // Scale image to the actual size of the image;
        // x and y values should be relative to the slide
        // ==============================================

        scaleToActual: function(x, y, duration) {
            var self = this,
                current = self.current,
                jQuerycontent = current.jQuerycontent,
                canvasWidth = jQuery.fancybox.getTranslate(current.jQueryslide).width,
                canvasHeight = jQuery.fancybox.getTranslate(current.jQueryslide).height,
                newImgWidth = current.width,
                newImgHeight = current.height,
                imgPos,
                posX,
                posY,
                scaleX,
                scaleY;

            if (self.isAnimating || !jQuerycontent || !(current.type == "image" && current.isLoaded && !current.hasError)) {
                return;
            }

            jQuery.fancybox.stop(jQuerycontent);

            self.isAnimating = true;

            x = x === undefined ? canvasWidth * 0.5 : x;
            y = y === undefined ? canvasHeight * 0.5 : y;

            imgPos = jQuery.fancybox.getTranslate(jQuerycontent);

            imgPos.top -= jQuery.fancybox.getTranslate(current.jQueryslide).top;
            imgPos.left -= jQuery.fancybox.getTranslate(current.jQueryslide).left;

            scaleX = newImgWidth / imgPos.width;
            scaleY = newImgHeight / imgPos.height;

            // Get center position for original image
            posX = canvasWidth * 0.5 - newImgWidth * 0.5;
            posY = canvasHeight * 0.5 - newImgHeight * 0.5;

            // Make sure image does not move away from edges
            if (newImgWidth > canvasWidth) {
                posX = imgPos.left * scaleX - (x * scaleX - x);

                if (posX > 0) {
                    posX = 0;
                }

                if (posX < canvasWidth - newImgWidth) {
                    posX = canvasWidth - newImgWidth;
                }
            }

            if (newImgHeight > canvasHeight) {
                posY = imgPos.top * scaleY - (y * scaleY - y);

                if (posY > 0) {
                    posY = 0;
                }

                if (posY < canvasHeight - newImgHeight) {
                    posY = canvasHeight - newImgHeight;
                }
            }

            self.updateCursor(newImgWidth, newImgHeight);

            jQuery.fancybox.animate(
                jQuerycontent, {
                    top: posY,
                    left: posX,
                    scaleX: scaleX,
                    scaleY: scaleY
                },
                duration || 330,
                function() {
                    self.isAnimating = false;
                }
            );

            // Stop slideshow
            if (self.SlideShow && self.SlideShow.isActive) {
                self.SlideShow.stop();
            }
        },

        // Scale image to fit inside parent element
        // ========================================

        scaleToFit: function(duration) {
            var self = this,
                current = self.current,
                jQuerycontent = current.jQuerycontent,
                end;

            if (self.isAnimating || !jQuerycontent || !(current.type == "image" && current.isLoaded && !current.hasError)) {
                return;
            }

            jQuery.fancybox.stop(jQuerycontent);

            self.isAnimating = true;

            end = self.getFitPos(current);

            self.updateCursor(end.width, end.height);

            jQuery.fancybox.animate(
                jQuerycontent, {
                    top: end.top,
                    left: end.left,
                    scaleX: end.width / jQuerycontent.width(),
                    scaleY: end.height / jQuerycontent.height()
                },
                duration || 330,
                function() {
                    self.isAnimating = false;
                }
            );
        },

        // Calculate image size to fit inside viewport
        // ===========================================

        getFitPos: function(slide) {
            var self = this,
                jQuerycontent = slide.jQuerycontent,
                width = slide.width || slide.opts.width,
                height = slide.height || slide.opts.height,
                maxWidth,
                maxHeight,
                minRatio,
                margin,
                aspectRatio,
                rez = {};

            if (!slide.isLoaded || !jQuerycontent || !jQuerycontent.length) {
                return false;
            }

            margin = {
                top: parseInt(slide.jQueryslide.css("paddingTop"), 10),
                right: parseInt(slide.jQueryslide.css("paddingRight"), 10),
                bottom: parseInt(slide.jQueryslide.css("paddingBottom"), 10),
                left: parseInt(slide.jQueryslide.css("paddingLeft"), 10)
            };

            // We can not use jQueryslide width here, because it can have different diemensions while in transiton
            maxWidth = parseInt(self.jQueryrefs.stage.width(), 10) - (margin.left + margin.right);
            maxHeight = parseInt(self.jQueryrefs.stage.height(), 10) - (margin.top + margin.bottom);

            if (!width || !height) {
                width = maxWidth;
                height = maxHeight;
            }

            minRatio = Math.min(1, maxWidth / width, maxHeight / height);

            // Use floor rounding to make sure it really fits
            width = Math.floor(minRatio * width);
            height = Math.floor(minRatio * height);

            if (slide.type === "image") {
                rez.top = Math.floor((maxHeight - height) * 0.5) + margin.top;
                rez.left = Math.floor((maxWidth - width) * 0.5) + margin.left;
            } else if (slide.contentType === "video") {
                // Force aspect ratio for the video
                // "I say the whole world must learn of our peaceful waysâ€¦ by force!"
                aspectRatio = slide.opts.width && slide.opts.height ? width / height : slide.opts.ratio || 16 / 9;

                if (height > width / aspectRatio) {
                    height = width / aspectRatio;
                } else if (width > height * aspectRatio) {
                    width = height * aspectRatio;
                }
            }

            rez.width = width;
            rez.height = height;

            return rez;
        },

        // Update content size and position for all slides
        // ==============================================

        update: function() {
            var self = this;

            jQuery.each(self.slides, function(key, slide) {
                self.updateSlide(slide);
            });
        },

        // Update slide content position and size
        // ======================================

        updateSlide: function(slide, duration) {
            var self = this,
                jQuerycontent = slide && slide.jQuerycontent,
                width = slide.width || slide.opts.width,
                height = slide.height || slide.opts.height;

            if (jQuerycontent && (width || height || slide.contentType === "video") && !slide.hasError) {
                jQuery.fancybox.stop(jQuerycontent);

                jQuery.fancybox.setTranslate(jQuerycontent, self.getFitPos(slide));

                if (slide.pos === self.currPos) {
                    self.isAnimating = false;

                    self.updateCursor();
                }
            }

            slide.jQueryslide.trigger("refresh");

            self.jQueryrefs.toolbar.toggleClass("compensate-for-scrollbar", slide.jQueryslide.get(0).scrollHeight > slide.jQueryslide.get(0).clientHeight);

            self.trigger("onUpdate", slide);
        },

        // Horizontally center slide
        // =========================

        centerSlide: function(slide, duration) {
            var self = this,
                canvasWidth,
                pos;

            if (self.current) {
                canvasWidth = Math.round(slide.jQueryslide.width());
                pos = slide.pos - self.current.pos;

                jQuery.fancybox.animate(
                    slide.jQueryslide, {
                        top: 0,
                        left: pos * canvasWidth + pos * slide.opts.gutter,
                        opacity: 1
                    },
                    duration === undefined ? 0 : duration,
                    null,
                    false
                );
            }
        },

        // Update cursor style depending if content can be zoomed
        // ======================================================

        updateCursor: function(nextWidth, nextHeight) {
            var self = this,
                current = self.current,
                jQuerycontainer = self.jQueryrefs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut"),
                isZoomable;

            if (!current || self.isClosing) {
                return;
            }

            isZoomable = self.isZoomable();

            jQuerycontainer.toggleClass("fancybox-is-zoomable", isZoomable);

            jQuery("[data-fancybox-zoom]").prop("disabled", !isZoomable);

            // Set cursor to zoom in/out if click event is 'zoom'
            if (
                isZoomable &&
                (current.opts.clickContent === "zoom" || (jQuery.isFunction(current.opts.clickContent) && current.opts.clickContent(current) === "zoom"))
            ) {
                if (self.isScaledDown(nextWidth, nextHeight)) {
                    // If image is scaled down, then, obviously, it can be zoomed to full size
                    jQuerycontainer.addClass("fancybox-can-zoomIn");
                } else {
                    if (current.opts.touch) {
                        // If image size ir largen than available available and touch module is not disable,
                        // then user can do panning
                        jQuerycontainer.addClass("fancybox-can-drag");
                    } else {
                        jQuerycontainer.addClass("fancybox-can-zoomOut");
                    }
                }
            } else if (current.opts.touch && current.contentType !== "video") {
                jQuerycontainer.addClass("fancybox-can-drag");
            }
        },

        // Check if current slide is zoomable
        // ==================================

        isZoomable: function() {
            var self = this,
                current = self.current,
                fitPos;

            // Assume that slide is zoomable if:
            //   - image is still loading
            //   - actual size of the image is smaller than available area
            if (current && !self.isClosing && current.type === "image" && !current.hasError) {
                if (!current.isLoaded) {
                    return true;
                }

                fitPos = self.getFitPos(current);

                if (current.width > fitPos.width || current.height > fitPos.height) {
                    return true;
                }
            }

            return false;
        },

        // Check if current image dimensions are smaller than actual
        // =========================================================

        isScaledDown: function(nextWidth, nextHeight) {
            var self = this,
                rez = false,
                current = self.current,
                jQuerycontent = current.jQuerycontent;

            if (nextWidth !== undefined && nextHeight !== undefined) {
                rez = nextWidth < current.width && nextHeight < current.height;
            } else if (jQuerycontent) {
                rez = jQuery.fancybox.getTranslate(jQuerycontent);
                rez = rez.width < current.width && rez.height < current.height;
            }

            return rez;
        },

        // Check if image dimensions exceed parent element
        // ===============================================

        canPan: function() {
            var self = this,
                rez = false,
                current = self.current,
                jQuerycontent;

            if (current.type === "image" && (jQuerycontent = current.jQuerycontent) && !current.hasError) {
                rez = self.getFitPos(current);
                rez = Math.abs(jQuerycontent.width() - rez.width) > 1 || Math.abs(jQuerycontent.height() - rez.height) > 1;
            }

            return rez;
        },

        // Load content into the slide
        // ===========================

        loadSlide: function(slide) {
            var self = this,
                type,
                jQueryslide,
                ajaxLoad;

            if (slide.isLoading || slide.isLoaded) {
                return;
            }

            slide.isLoading = true;

            self.trigger("beforeLoad", slide);

            type = slide.type;
            jQueryslide = slide.jQueryslide;

            jQueryslide
                .off("refresh")
                .trigger("onReset")
                .addClass(slide.opts.slideClass);

            // Create content depending on the type
            switch (type) {
                case "image":
                    self.setImage(slide);

                    break;

                case "iframe":
                    self.setIframe(slide);

                    break;

                case "html":
                    self.setContent(slide, slide.src || slide.content);

                    break;

                case "video":
                    self.setContent(
                        slide,
                        '<video class="fancybox-video" controls controlsList="nodownload">' +
                        '<source src="' +
                        slide.src +
                        '" type="' +
                        slide.opts.videoFormat +
                        '">' +
                        "Your browser doesn't support HTML5 video" +
                        "</video"
                    );

                    break;

                case "inline":
                    if (jQuery(slide.src).length) {
                        self.setContent(slide, jQuery(slide.src));
                    } else {
                        self.setError(slide);
                    }

                    break;

                case "ajax":
                    self.showLoading(slide);

                    ajaxLoad = jQuery.ajax(
                        jQuery.extend({}, slide.opts.ajax.settings, {
                            url: slide.src,
                            success: function(data, textStatus) {
                                if (textStatus === "success") {
                                    self.setContent(slide, data);
                                }
                            },
                            error: function(jqXHR, textStatus) {
                                if (jqXHR && textStatus !== "abort") {
                                    self.setError(slide);
                                }
                            }
                        })
                    );

                    jQueryslide.one("onReset", function() {
                        ajaxLoad.abort();
                    });

                    break;

                default:
                    self.setError(slide);

                    break;
            }

            return true;
        },

        // Use thumbnail image, if possible
        // ================================

        setImage: function(slide) {
            var self = this,
                srcset = slide.opts.srcset || slide.opts.image.srcset,
                thumbSrc,
                found,
                temp,
                pxRatio,
                windowWidth;

            // Check if need to show loading icon
            slide.timouts = setTimeout(function() {
                var jQueryimg = slide.jQueryimage;

                if (slide.isLoading && (!jQueryimg || !jQueryimg[0].complete) && !slide.hasError) {
                    self.showLoading(slide);
                }
            }, 350);

            // If we have "srcset", then we need to find first matching "src" value.
            // This is necessary, because when you set an src attribute, the browser will preload the image
            // before any javascript or even CSS is applied.
            if (srcset) {
                pxRatio = window.devicePixelRatio || 1;
                windowWidth = window.innerWidth * pxRatio;

                temp = srcset.split(",").map(function(el) {
                    var ret = {};

                    el
                        .trim()
                        .split(/\s+/)
                        .forEach(function(el, i) {
                            var value = parseInt(el.substring(0, el.length - 1), 10);

                            if (i === 0) {
                                return (ret.url = el);
                            }

                            if (value) {
                                ret.value = value;
                                ret.postfix = el[el.length - 1];
                            }
                        });

                    return ret;
                });

                // Sort by value
                temp.sort(function(a, b) {
                    return a.value - b.value;
                });

                // Ok, now we have an array of all srcset values
                for (var j = 0; j < temp.length; j++) {
                    var el = temp[j];

                    if ((el.postfix === "w" && el.value >= windowWidth) || (el.postfix === "x" && el.value >= pxRatio)) {
                        found = el;
                        break;
                    }
                }

                // If not found, take the last one
                if (!found && temp.length) {
                    found = temp[temp.length - 1];
                }

                if (found) {
                    slide.src = found.url;

                    // If we have default width/height values, we can calculate height for matching source
                    if (slide.width && slide.height && found.postfix == "w") {
                        slide.height = slide.width / slide.height * found.value;
                        slide.width = found.value;
                    }

                    slide.opts.srcset = srcset;
                }
            }

            // This will be wrapper containing both ghost and actual image
            slide.jQuerycontent = jQuery('<div class="fancybox-content"></div>')
                .addClass("fancybox-is-hidden")
                .appendTo(slide.jQueryslide.addClass("fancybox-slide--image"));

            // If we have a thumbnail, we can display it while actual image is loading
            // Users will not stare at black screen and actual image will appear gradually
            thumbSrc = slide.opts.thumb || (slide.opts.jQuerythumb && slide.opts.jQuerythumb.length ? slide.opts.jQuerythumb.attr("src") : false);

            if (slide.opts.preload !== false && slide.opts.width && slide.opts.height && thumbSrc) {
                slide.width = slide.opts.width;
                slide.height = slide.opts.height;

                slide.jQueryghost = jQuery("<img />")
                    .one("error", function() {
                        jQuery(this).remove();

                        slide.jQueryghost = null;
                    })
                    .one("load", function() {
                        self.afterLoad(slide);
                    })
                    .addClass("fancybox-image")
                    .appendTo(slide.jQuerycontent)
                    .attr("src", thumbSrc);
            }

            // Start loading actual image
            self.setBigImage(slide);
        },

        // Create full-size image
        // ======================

        setBigImage: function(slide) {
            var self = this,
                jQueryimg = jQuery("<img />");

            slide.jQueryimage = jQueryimg
                .one("error", function() {
                    self.setError(slide);
                })
                .one("load", function() {
                    var sizes;

                    if (!slide.jQueryghost) {
                        self.resolveImageSlideSize(slide, this.naturalWidth, this.naturalHeight);

                        self.afterLoad(slide);
                    }

                    // Clear timeout that checks if loading icon needs to be displayed
                    if (slide.timouts) {
                        clearTimeout(slide.timouts);
                        slide.timouts = null;
                    }

                    if (self.isClosing) {
                        return;
                    }

                    if (slide.opts.srcset) {
                        sizes = slide.opts.sizes;

                        if (!sizes || sizes === "auto") {
                            sizes =
                                (slide.width / slide.height > 1 && jQueryW.width() / jQueryW.height() > 1 ? "100" : Math.round(slide.width / slide.height * 100)) +
                                "vw";
                        }

                        jQueryimg.attr("sizes", sizes).attr("srcset", slide.opts.srcset);
                    }

                    // Hide temporary image after some delay
                    if (slide.jQueryghost) {
                        setTimeout(function() {
                            if (slide.jQueryghost && !self.isClosing) {
                                slide.jQueryghost.hide();
                            }
                        }, Math.min(300, Math.max(1000, slide.height / 1600)));
                    }

                    self.hideLoading(slide);
                })
                .addClass("fancybox-image")
                .attr("src", slide.src)
                .appendTo(slide.jQuerycontent);

            if ((jQueryimg[0].complete || jQueryimg[0].readyState == "complete") && jQueryimg[0].naturalWidth && jQueryimg[0].naturalHeight) {
                jQueryimg.trigger("load");
            } else if (jQueryimg[0].error) {
                jQueryimg.trigger("error");
            }
        },

        // Computes the slide size from image size and maxWidth/maxHeight
        // ==============================================================

        resolveImageSlideSize: function(slide, imgWidth, imgHeight) {
            var maxWidth = parseInt(slide.opts.width, 10),
                maxHeight = parseInt(slide.opts.height, 10);

            // Sets the default values from the image
            slide.width = imgWidth;
            slide.height = imgHeight;

            if (maxWidth > 0) {
                slide.width = maxWidth;
                slide.height = Math.floor(maxWidth * imgHeight / imgWidth);
            }

            if (maxHeight > 0) {
                slide.width = Math.floor(maxHeight * imgWidth / imgHeight);
                slide.height = maxHeight;
            }
        },

        // Create iframe wrapper, iframe and bindings
        // ==========================================

        setIframe: function(slide) {
            var self = this,
                opts = slide.opts.iframe,
                jQueryslide = slide.jQueryslide,
                jQueryiframe;

            slide.jQuerycontent = jQuery('<div class="fancybox-content' + (opts.preload ? " fancybox-is-hidden" : "") + '"></div>')
                .css(opts.css)
                .appendTo(jQueryslide);

            jQueryslide.addClass("fancybox-slide--" + slide.contentType);

            slide.jQueryiframe = jQueryiframe = jQuery(opts.tpl.replace(/\{rnd\}/g, new Date().getTime()))
                .attr(opts.attr)
                .appendTo(slide.jQuerycontent);

            if (opts.preload) {
                self.showLoading(slide);

                // Unfortunately, it is not always possible to determine if iframe is successfully loaded
                // (due to browser security policy)

                jQueryiframe.on("load.fb error.fb", function(e) {
                    this.isReady = 1;

                    slide.jQueryslide.trigger("refresh");

                    self.afterLoad(slide);
                });

                // Recalculate iframe content size
                // ===============================

                jQueryslide.on("refresh.fb", function() {
                    var jQuerycontent = slide.jQuerycontent,
                        frameWidth = opts.css.width,
                        frameHeight = opts.css.height,
                        jQuerycontents,
                        jQuerybody;

                    if (jQueryiframe[0].isReady !== 1) {
                        return;
                    }

                    try {
                        jQuerycontents = jQueryiframe.contents();
                        jQuerybody = jQuerycontents.find("body");
                    } catch (ignore) {}

                    // Calculate contnet dimensions if it is accessible
                    if (jQuerybody && jQuerybody.length && jQuerybody.children().length) {
                        jQuerycontent.css({
                            width: "",
                            height: ""
                        });

                        if (frameWidth === undefined) {
                            frameWidth = Math.ceil(Math.max(jQuerybody[0].clientWidth, jQuerybody.outerWidth(true)));
                        }

                        if (frameWidth) {
                            jQuerycontent.width(frameWidth);
                        }

                        if (frameHeight === undefined) {
                            frameHeight = Math.ceil(Math.max(jQuerybody[0].clientHeight, jQuerybody.outerHeight(true)));
                        }

                        if (frameHeight) {
                            jQuerycontent.height(frameHeight);
                        }
                    }

                    jQuerycontent.removeClass("fancybox-is-hidden");
                });
            } else {
                this.afterLoad(slide);
            }

            jQueryiframe.attr("src", slide.src);

            // Remove iframe if closing or changing gallery item
            jQueryslide.one("onReset", function() {
                // This helps IE not to throw errors when closing
                try {
                    jQuery(this)
                        .find("iframe")
                        .hide()
                        .unbind()
                        .attr("src", "//about:blank");
                } catch (ignore) {}

                jQuery(this)
                    .off("refresh.fb")
                    .empty();

                slide.isLoaded = false;
            });
        },

        // Wrap and append content to the slide
        // ======================================

        setContent: function(slide, content) {
            var self = this;

            if (self.isClosing) {
                return;
            }

            self.hideLoading(slide);

            if (slide.jQuerycontent) {
                jQuery.fancybox.stop(slide.jQuerycontent);
            }

            slide.jQueryslide.empty();

            // If content is a jQuery object, then it will be moved to the slide.
            // The placeholder is created so we will know where to put it back.
            if (isQuery(content) && content.parent().length) {
                // Make sure content is not already moved to fancyBox
                content
                    .parent()
                    .parent(".fancybox-slide--inline")
                    .trigger("onReset");

                // Create temporary element marking original place of the content
                slide.jQueryplaceholder = jQuery("<div>")
                    .hide()
                    .insertAfter(content);

                // Make sure content is visible
                content.css("display", "inline-block");
            } else if (!slide.hasError) {
                // If content is just a plain text, try to convert it to html
                if (jQuery.type(content) === "string") {
                    content = jQuery("<div>")
                        .append(jQuery.trim(content))
                        .contents();

                    // If we have text node, then add wrapping element to make vertical alignment work
                    if (content[0].nodeType === 3) {
                        content = jQuery("<div>").html(content);
                    }
                }

                // If "filter" option is provided, then filter content
                if (slide.opts.filter) {
                    content = jQuery("<div>")
                        .html(content)
                        .find(slide.opts.filter);
                }
            }

            slide.jQueryslide.one("onReset", function() {
                // Pause all html5 video/audio
                jQuery(this)
                    .find("video,audio")
                    .trigger("pause");

                // Put content back
                if (slide.jQueryplaceholder) {
                    slide.jQueryplaceholder.after(content.hide()).remove();

                    slide.jQueryplaceholder = null;
                }

                // Remove custom close button
                if (slide.jQuerysmallBtn) {
                    slide.jQuerysmallBtn.remove();

                    slide.jQuerysmallBtn = null;
                }

                // Remove content and mark slide as not loaded
                if (!slide.hasError) {
                    jQuery(this).empty();

                    slide.isLoaded = false;
                }
            });

            jQuery(content).appendTo(slide.jQueryslide);

            if (jQuery(content).is("video,audio")) {
                jQuery(content).addClass("fancybox-video");

                jQuery(content).wrap("<div></div>");

                slide.contentType = "video";

                slide.opts.width = slide.opts.width || jQuery(content).attr("width");
                slide.opts.height = slide.opts.height || jQuery(content).attr("height");
            }

            slide.jQuerycontent = slide.jQueryslide
                .children()
                .filter("div,form,main,video,audio")
                .first()
                .addClass("fancybox-content");

            slide.jQueryslide.addClass("fancybox-slide--" + slide.contentType);

            this.afterLoad(slide);
        },

        // Display error message
        // =====================

        setError: function(slide) {
            slide.hasError = true;

            slide.jQueryslide
                .trigger("onReset")
                .removeClass("fancybox-slide--" + slide.contentType)
                .addClass("fancybox-slide--error");

            slide.contentType = "html";

            this.setContent(slide, this.translate(slide, slide.opts.errorTpl));

            if (slide.pos === this.currPos) {
                this.isAnimating = false;
            }
        },

        // Show loading icon inside the slide
        // ==================================

        showLoading: function(slide) {
            var self = this;

            slide = slide || self.current;

            if (slide && !slide.jQueryspinner) {
                slide.jQueryspinner = jQuery(self.translate(self, self.opts.spinnerTpl)).appendTo(slide.jQueryslide);
            }
        },

        // Remove loading icon from the slide
        // ==================================

        hideLoading: function(slide) {
            var self = this;

            slide = slide || self.current;

            if (slide && slide.jQueryspinner) {
                slide.jQueryspinner.remove();

                delete slide.jQueryspinner;
            }
        },

        // Adjustments after slide content has been loaded
        // ===============================================

        afterLoad: function(slide) {
            var self = this;

            if (self.isClosing) {
                return;
            }

            slide.isLoading = false;
            slide.isLoaded = true;

            self.trigger("afterLoad", slide);

            self.hideLoading(slide);

            if (slide.pos === self.currPos) {
                self.updateCursor();
            }

            if (slide.opts.smallBtn && (!slide.jQuerysmallBtn || !slide.jQuerysmallBtn.length)) {
                slide.jQuerysmallBtn = jQuery(self.translate(slide, slide.opts.btnTpl.smallBtn)).prependTo(slide.jQuerycontent);
            }

            if (slide.opts.protect && slide.jQuerycontent && !slide.hasError) {
                // Disable right click
                slide.jQuerycontent.on("contextmenu.fb", function(e) {
                    if (e.button == 2) {
                        e.preventDefault();
                    }

                    return true;
                });

                // Add fake element on top of the image
                // This makes a bit harder for user to select image
                if (slide.type === "image") {
                    jQuery('<div class="fancybox-spaceball"></div>').appendTo(slide.jQuerycontent);
                }
            }

            self.revealContent(slide);
        },

        // Make content visible
        // This method is called right after content has been loaded or
        // user navigates gallery and transition should start
        // ============================================================

        revealContent: function(slide) {
            var self = this,
                jQueryslide = slide.jQueryslide,
                end = false,
                start = false,
                effect,
                effectClassName,
                duration,
                opacity;

            effect = slide.opts[self.firstRun ? "animationEffect" : "transitionEffect"];
            duration = slide.opts[self.firstRun ? "animationDuration" : "transitionDuration"];

            duration = parseInt(slide.forcedDuration === undefined ? duration : slide.forcedDuration, 10);

            // Do not animate if revealing the same slide
            if (slide.pos === self.currPos) {
                if (slide.isComplete) {
                    effect = false;
                } else {
                    self.isAnimating = true;
                }
            }

            if (slide.isMoved || slide.pos !== self.currPos || !duration) {
                effect = false;
            }

            // Check if can zoom
            if (effect === "zoom") {
                if (slide.pos === self.currPos && duration && slide.type === "image" && !slide.hasError && (start = self.getThumbPos(slide))) {
                    end = self.getFitPos(slide);
                } else {
                    effect = "fade";
                }
            }

            // Zoom animation
            // ==============
            if (effect === "zoom") {
                end.scaleX = end.width / start.width;
                end.scaleY = end.height / start.height;

                // Check if we need to animate opacity
                opacity = slide.opts.zoomOpacity;

                if (opacity == "auto") {
                    opacity = Math.abs(slide.width / slide.height - start.width / start.height) > 0.1;
                }

                if (opacity) {
                    start.opacity = 0.1;
                    end.opacity = 1;
                }

                // Draw image at start position
                jQuery.fancybox.setTranslate(slide.jQuerycontent.removeClass("fancybox-is-hidden"), start);

                forceRedraw(slide.jQuerycontent);

                // Start animation
                jQuery.fancybox.animate(slide.jQuerycontent, end, duration, function() {
                    self.isAnimating = false;

                    self.complete();
                });

                return;
            }

            self.updateSlide(slide);

            // Simply show content
            // ===================

            if (!effect) {
                forceRedraw(jQueryslide);

                slide.jQuerycontent.removeClass("fancybox-is-hidden");

                if (slide.pos === self.currPos) {
                    self.complete();
                }

                return;
            }

            jQuery.fancybox.stop(jQueryslide);

            effectClassName = "fancybox-animated fancybox-slide--" + (slide.pos >= self.prevPos ? "next" : "previous") + " fancybox-fx-" + effect;

            jQueryslide
                .removeAttr("style")
                .removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous")
                .addClass(effectClassName);

            slide.jQuerycontent.removeClass("fancybox-is-hidden");

            // Force reflow for CSS3 transitions
            forceRedraw(jQueryslide);

            jQuery.fancybox.animate(
                jQueryslide,
                "fancybox-slide--current",
                duration,
                function(e) {
                    jQueryslide.removeClass(effectClassName).removeAttr("style");

                    if (slide.pos === self.currPos) {
                        self.complete();
                    }
                },
                true
            );
        },

        // Check if we can and have to zoom from thumbnail
        //================================================

        getThumbPos: function(slide) {
            var self = this,
                rez = false,
                jQuerythumb = slide.opts.jQuerythumb,
                thumbPos = jQuerythumb && jQuerythumb.length && jQuerythumb[0].ownerDocument === document ? jQuerythumb.offset() : 0,
                slidePos;

            // Check if element is inside the viewport by at least 1 pixel
            var isElementVisible = function(jQueryel) {
                var element = jQueryel[0],
                    elementRect = element.getBoundingClientRect(),
                    parentRects = [],
                    visibleInAllParents;

                while (element.parentElement !== null) {
                    if (jQuery(element.parentElement).css("overflow") === "hidden" || jQuery(element.parentElement).css("overflow") === "auto") {
                        parentRects.push(element.parentElement.getBoundingClientRect());
                    }

                    element = element.parentElement;
                }

                visibleInAllParents = parentRects.every(function(parentRect) {
                    var visiblePixelX = Math.min(elementRect.right, parentRect.right) - Math.max(elementRect.left, parentRect.left);
                    var visiblePixelY = Math.min(elementRect.bottom, parentRect.bottom) - Math.max(elementRect.top, parentRect.top);

                    return visiblePixelX > 0 && visiblePixelY > 0;
                });

                return (
                    visibleInAllParents &&
                    elementRect.bottom > 0 &&
                    elementRect.right > 0 &&
                    elementRect.left < jQuery(window).width() &&
                    elementRect.top < jQuery(window).height()
                );
            };

            if (thumbPos && isElementVisible(jQuerythumb)) {
                slidePos = self.jQueryrefs.stage.offset();

                rez = {
                    top: thumbPos.top - slidePos.top + parseFloat(jQuerythumb.css("border-top-width") || 0),
                    left: thumbPos.left - slidePos.left + parseFloat(jQuerythumb.css("border-left-width") || 0),
                    width: jQuerythumb.width(),
                    height: jQuerythumb.height(),
                    scaleX: 1,
                    scaleY: 1
                };
            }

            return rez;
        },

        // Final adjustments after current gallery item is moved to position
        // and it`s content is loaded
        // ==================================================================

        complete: function() {
            var self = this,
                current = self.current,
                slides = {};

            if (current.isMoved || !current.isLoaded) {
                return;
            }

            if (!current.isComplete) {
                current.isComplete = true;

                current.jQueryslide.siblings().trigger("onReset");

                self.preload("inline");

                // Trigger any CSS3 transiton inside the slide
                forceRedraw(current.jQueryslide);

                current.jQueryslide.addClass("fancybox-slide--complete");

                // Remove unnecessary slides
                jQuery.each(self.slides, function(key, slide) {
                    if (slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1) {
                        slides[slide.pos] = slide;
                    } else if (slide) {
                        jQuery.fancybox.stop(slide.jQueryslide);

                        slide.jQueryslide.off().remove();
                    }
                });

                self.slides = slides;
            }

            self.isAnimating = false;

            self.updateCursor();

            self.trigger("afterShow");

            // Play first html5 video/audio
            current.jQueryslide
                .find("video,audio")
                .filter(":visible:first")
                .trigger("play");

            // Try to focus on the first focusable element
            if (
                jQuery(document.activeElement).is("[disabled]") ||
                (current.opts.autoFocus && !(current.type == "image" || current.type === "iframe"))
            ) {
                self.focus();
            }
        },

        // Preload next and previous slides
        // ================================

        preload: function(type) {
            var self = this,
                next = self.slides[self.currPos + 1],
                prev = self.slides[self.currPos - 1];

            if (next && next.type === type) {
                self.loadSlide(next);
            }

            if (prev && prev.type === type) {
                self.loadSlide(prev);
            }
        },

        // Try to find and focus on the first focusable element
        // ====================================================

        focus: function() {
            var current = this.current,
                jQueryel;

            if (this.isClosing) {
                return;
            }

            if (current && current.isComplete && current.jQuerycontent) {
                // Look for first input with autofocus attribute
                jQueryel = current.jQuerycontent.find("input[autofocus]:enabled:visible:first");

                if (!jQueryel.length) {
                    jQueryel = current.jQuerycontent.find("button,:input,[tabindex],a").filter(":enabled:visible:first");
                }

                jQueryel = jQueryel && jQueryel.length ? jQueryel : current.jQuerycontent;

                jQueryel.trigger("focus");
            }
        },

        // Activates current instance - brings container to the front and enables keyboard,
        // notifies other instances about deactivating
        // =================================================================================

        activate: function() {
            var self = this;

            // Deactivate all instances
            jQuery(".fancybox-container").each(function() {
                var instance = jQuery(this).data("FancyBox");

                // Skip self and closing instances
                if (instance && instance.id !== self.id && !instance.isClosing) {
                    instance.trigger("onDeactivate");

                    instance.removeEvents();

                    instance.isVisible = false;
                }
            });

            self.isVisible = true;

            if (self.current || self.isIdle) {
                self.update();

                self.updateControls();
            }

            self.trigger("onActivate");

            self.addEvents();
        },

        // Start closing procedure
        // This will start "zoom-out" animation if needed and clean everything up afterwards
        // =================================================================================

        close: function(e, d) {
            var self = this,
                current = self.current,
                effect,
                duration,
                jQuerycontent,
                domRect,
                opacity,
                start,
                end;

            var done = function() {
                self.cleanUp(e);
            };

            if (self.isClosing) {
                return false;
            }

            self.isClosing = true;

            // If beforeClose callback prevents closing, make sure content is centered
            if (self.trigger("beforeClose", e) === false) {
                self.isClosing = false;

                requestAFrame(function() {
                    self.update();
                });

                return false;
            }

            // Remove all events
            // If there are multiple instances, they will be set again by "activate" method
            self.removeEvents();

            if (current.timouts) {
                clearTimeout(current.timouts);
            }

            jQuerycontent = current.jQuerycontent;
            effect = current.opts.animationEffect;
            duration = jQuery.isNumeric(d) ? d : effect ? current.opts.animationDuration : 0;

            // Remove other slides
            current.jQueryslide
                .off(transitionEnd)
                .removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated");

            current.jQueryslide
                .siblings()
                .trigger("onReset")
                .remove();

            // Trigger animations
            if (duration) {
                self.jQueryrefs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing");
            }

            // Clean up
            self.hideLoading(current);

            self.hideControls();

            self.updateCursor();

            // Check if possible to zoom-out
            if (
                effect === "zoom" &&
                !(e !== true && jQuerycontent && duration && current.type === "image" && !current.hasError && (end = self.getThumbPos(current)))
            ) {
                effect = "fade";
            }

            if (effect === "zoom") {
                jQuery.fancybox.stop(jQuerycontent);

                domRect = jQuery.fancybox.getTranslate(jQuerycontent);

                start = {
                    top: domRect.top,
                    left: domRect.left,
                    scaleX: domRect.width / end.width,
                    scaleY: domRect.height / end.height,
                    width: end.width,
                    height: end.height
                };

                // Check if we need to animate opacity
                opacity = current.opts.zoomOpacity;

                if (opacity == "auto") {
                    opacity = Math.abs(current.width / current.height - end.width / end.height) > 0.1;
                }

                if (opacity) {
                    end.opacity = 0;
                }

                jQuery.fancybox.setTranslate(jQuerycontent, start);

                forceRedraw(jQuerycontent);

                jQuery.fancybox.animate(jQuerycontent, end, duration, done);

                return true;
            }

            if (effect && duration) {
                // If skip animation
                if (e === true) {
                    setTimeout(done, duration);
                } else {
                    jQuery.fancybox.animate(
                        current.jQueryslide.removeClass("fancybox-slide--current"),
                        "fancybox-animated fancybox-slide--previous fancybox-fx-" + effect,
                        duration,
                        done
                    );
                }
            } else {
                done();
            }

            return true;
        },

        // Final adjustments after removing the instance
        // =============================================

        cleanUp: function(e) {
            var self = this,
                jQuerybody = jQuery("body"),
                instance,
                scrollTop;

            self.current.jQueryslide.trigger("onReset");

            self.jQueryrefs.container.empty().remove();

            self.trigger("afterClose", e);

            // Place back focus
            if (self.jQuerylastFocus && !!self.current.opts.backFocus) {
                self.jQuerylastFocus.trigger("focus");
            }

            self.current = null;

            // Check if there are other instances
            instance = jQuery.fancybox.getInstance();

            if (instance) {
                instance.activate();
            } else {
                jQuerybody.removeClass("fancybox-active compensate-for-scrollbar");

                jQuery("#fancybox-style-noscroll").remove();
            }
        },

        // Call callback and trigger an event
        // ==================================

        trigger: function(name, slide) {
            var args = Array.prototype.slice.call(arguments, 1),
                self = this,
                obj = slide && slide.opts ? slide : self.current,
                rez;

            if (obj) {
                args.unshift(obj);
            } else {
                obj = self;
            }

            args.unshift(self);

            if (jQuery.isFunction(obj.opts[name])) {
                rez = obj.opts[name].apply(obj, args);
            }

            if (rez === false) {
                return rez;
            }

            if (name === "afterClose" || !self.jQueryrefs) {
                jQueryD.trigger(name + ".fb", args);
            } else {
                self.jQueryrefs.container.trigger(name + ".fb", args);
            }
        },

        // Update infobar values, navigation button states and reveal caption
        // ==================================================================

        updateControls: function(force) {
            var self = this,
                current = self.current,
                index = current.index,
                caption = current.opts.caption,
                jQuerycontainer = self.jQueryrefs.container,
                jQuerycaption = self.jQueryrefs.caption;

            // Recalculate content dimensions
            current.jQueryslide.trigger("refresh");

            self.jQuerycaption = caption && caption.length ? jQuerycaption.html(caption) : null;

            if (!self.isHiddenControls && !self.isIdle) {
                self.showControls();
            }

            // Update info and navigation elements
            jQuerycontainer.find("[data-fancybox-count]").html(self.group.length);
            jQuerycontainer.find("[data-fancybox-index]").html(index + 1);

            jQuerycontainer.find("[data-fancybox-prev]").toggleClass("disabled", !current.opts.loop && index <= 0);
            jQuerycontainer.find("[data-fancybox-next]").toggleClass("disabled", !current.opts.loop && index >= self.group.length - 1);

            if (current.type === "image") {
                // Re-enable buttons; update download button source
                jQuerycontainer
                    .find("[data-fancybox-zoom]")
                    .show()
                    .end()
                    .find("[data-fancybox-download]")
                    .attr("href", current.opts.image.src || current.src)
                    .show();
            } else if (current.opts.toolbar) {
                jQuerycontainer.find("[data-fancybox-download],[data-fancybox-zoom]").hide();
            }
        },

        // Hide toolbar and caption
        // ========================

        hideControls: function() {
            this.isHiddenControls = true;

            this.jQueryrefs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav");
        },

        showControls: function() {
            var self = this,
                opts = self.current ? self.current.opts : self.opts,
                jQuerycontainer = self.jQueryrefs.container;

            self.isHiddenControls = false;
            self.idleSecondsCounter = 0;

            jQuerycontainer
                .toggleClass("fancybox-show-toolbar", !!(opts.toolbar && opts.buttons))
                .toggleClass("fancybox-show-infobar", !!(opts.infobar && self.group.length > 1))
                .toggleClass("fancybox-show-nav", !!(opts.arrows && self.group.length > 1))
                .toggleClass("fancybox-is-modal", !!opts.modal);

            if (self.jQuerycaption) {
                jQuerycontainer.addClass("fancybox-show-caption ");
            } else {
                jQuerycontainer.removeClass("fancybox-show-caption");
            }
        },

        // Toggle toolbar and caption
        // ==========================

        toggleControls: function() {
            if (this.isHiddenControls) {
                this.showControls();
            } else {
                this.hideControls();
            }
        }
    });

    jQuery.fancybox = {
        version: "3.3.5",
        defaults: defaults,

        // Get current instance and execute a command.
        //
        // Examples of usage:
        //
        //   jQueryinstance = jQuery.fancybox.getInstance();
        //   jQuery.fancybox.getInstance().jumpTo( 1 );
        //   jQuery.fancybox.getInstance( 'jumpTo', 1 );
        //   jQuery.fancybox.getInstance( function() {
        //       console.info( this.currIndex );
        //   });
        // ======================================================

        getInstance: function(command) {
            var instance = jQuery('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),
                args = Array.prototype.slice.call(arguments, 1);

            if (instance instanceof FancyBox) {
                if (jQuery.type(command) === "string") {
                    instance[command].apply(instance, args);
                } else if (jQuery.type(command) === "function") {
                    command.apply(instance, args);
                }

                return instance;
            }

            return false;
        },

        // Create new instance
        // ===================

        open: function(items, opts, index) {
            return new FancyBox(items, opts, index);
        },

        // Close current or all instances
        // ==============================

        close: function(all) {
            var instance = this.getInstance();

            if (instance) {
                instance.close();

                // Try to find and close next instance

                if (all === true) {
                    this.close();
                }
            }
        },

        // Close all instances and unbind all events
        // =========================================

        destroy: function() {
            this.close(true);

            jQueryD.add("body").off("click.fb-start", "**");
        },

        // Try to detect mobile devices
        // ============================

        isMobile: document.createTouch !== undefined && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

        // Detect if 'translate3d' support is available
        // ============================================

        use3d: (function() {
            var div = document.createElement("div");

            return (
                window.getComputedStyle &&
                window.getComputedStyle(div) &&
                window.getComputedStyle(div).getPropertyValue("transform") &&
                !(document.documentMode && document.documentMode < 11)
            );
        })(),

        // Helper function to get current visual state of an element
        // returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
        // =====================================================================

        getTranslate: function(jQueryel) {
            var domRect;

            if (!jQueryel || !jQueryel.length) {
                return false;
            }

            domRect = jQueryel[0].getBoundingClientRect();

            return {
                top: domRect.top || 0,
                left: domRect.left || 0,
                width: domRect.width,
                height: domRect.height,
                opacity: parseFloat(jQueryel.css("opacity"))
            };
        },

        // Shortcut for setting "translate3d" properties for element
        // Can set be used to set opacity, too
        // ========================================================

        setTranslate: function(jQueryel, props) {
            var str = "",
                css = {};

            if (!jQueryel || !props) {
                return;
            }

            if (props.left !== undefined || props.top !== undefined) {
                str =
                    (props.left === undefined ? jQueryel.position().left : props.left) +
                    "px, " +
                    (props.top === undefined ? jQueryel.position().top : props.top) +
                    "px";

                if (this.use3d) {
                    str = "translate3d(" + str + ", 0px)";
                } else {
                    str = "translate(" + str + ")";
                }
            }

            if (props.scaleX !== undefined && props.scaleY !== undefined) {
                str = (str.length ? str + " " : "") + "scale(" + props.scaleX + ", " + props.scaleY + ")";
            }

            if (str.length) {
                css.transform = str;
            }

            if (props.opacity !== undefined) {
                css.opacity = props.opacity;
            }

            if (props.width !== undefined) {
                css.width = props.width;
            }

            if (props.height !== undefined) {
                css.height = props.height;
            }

            return jQueryel.css(css);
        },

        // Simple CSS transition handler
        // =============================

        animate: function(jQueryel, to, duration, callback, leaveAnimationName) {
            var final = false;

            if (jQuery.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            if (!jQuery.isPlainObject(to)) {
                jQueryel.removeAttr("style");
            }

            jQuery.fancybox.stop(jQueryel);

            jQueryel.on(transitionEnd, function(e) {
                // Skip events from child elements and z-index change
                if (e && e.originalEvent && (!jQueryel.is(e.originalEvent.target) || e.originalEvent.propertyName == "z-index")) {
                    return;
                }

                jQuery.fancybox.stop(jQueryel);

                if (final) {
                    jQuery.fancybox.setTranslate(jQueryel, final);
                }

                if (jQuery.isPlainObject(to)) {
                    if (leaveAnimationName === false) {
                        jQueryel.removeAttr("style");
                    }
                } else if (leaveAnimationName !== true) {
                    jQueryel.removeClass(to);
                }

                if (jQuery.isFunction(callback)) {
                    callback(e);
                }
            });

            if (jQuery.isNumeric(duration)) {
                jQueryel.css("transition-duration", duration + "ms");
            }

            // Start animation by changing CSS properties or class name
            if (jQuery.isPlainObject(to)) {
                if (to.scaleX !== undefined && to.scaleY !== undefined) {
                    final = jQuery.extend({}, to, {
                        width: jQueryel.width() * to.scaleX,
                        height: jQueryel.height() * to.scaleY,
                        scaleX: 1,
                        scaleY: 1
                    });

                    delete to.width;
                    delete to.height;

                    if (jQueryel.parent().hasClass("fancybox-slide--image")) {
                        jQueryel.parent().addClass("fancybox-is-scaling");
                    }
                }

                jQuery.fancybox.setTranslate(jQueryel, to);
            } else {
                jQueryel.addClass(to);
            }

            // Make sure that `transitionend` callback gets fired
            jQueryel.data(
                "timer",
                setTimeout(function() {
                    jQueryel.trigger("transitionend");
                }, duration + 16)
            );
        },

        stop: function(jQueryel) {
            if (jQueryel && jQueryel.length) {
                clearTimeout(jQueryel.data("timer"));

                jQueryel.off("transitionend").css("transition-duration", "");

                jQueryel.parent().removeClass("fancybox-is-scaling");
            }
        }
    };

    // Default click handler for "fancyboxed" links
    // ============================================

    function _run(e, opts) {
        var items = [],
            index = 0,
            jQuerytarget,
            value;

        // Avoid opening multiple times
        if (e && e.isDefaultPrevented()) {
            return;
        }

        e.preventDefault();

        opts = e && e.data ? e.data.options : opts || {};

        jQuerytarget = opts.jQuerytarget || jQuery(e.currentTarget);
        value = jQuerytarget.attr("data-fancybox") || "";

        // Get all related items and find index for clicked one
        if (value) {
            items = opts.selector ? jQuery(opts.selector) : e.data ? e.data.items : [];
            items = items.length ? items.filter('[data-fancybox="' + value + '"]') : jQuery('[data-fancybox="' + value + '"]');

            index = items.index(jQuerytarget);

            // Sometimes current item can not be found (for example, if some script clones items)
            if (index < 0) {
                index = 0;
            }
        } else {
            items = [jQuerytarget];
        }

        jQuery.fancybox.open(items, opts, index);
    }

    // Create a jQuery plugin
    // ======================

    jQuery.fn.fancybox = function(options) {
        var selector;

        options = options || {};
        selector = options.selector || false;

        if (selector) {
            // Use body element instead of document so it executes first
            jQuery("body")
                .off("click.fb-start", selector)
                .on("click.fb-start", selector, { options: options }, _run);
        } else {
            this.off("click.fb-start").on(
                "click.fb-start", {
                    items: this,
                    options: options
                },
                _run
            );
        }

        return this;
    };

    // Self initializing plugin for all elements having `data-fancybox` attribute
    // ==========================================================================

    jQueryD.on("click.fb-start", "[data-fancybox]", _run);

    // Enable "trigger elements"
    // =========================

    jQueryD.on("click.fb-start", "[data-trigger]", function(e) {
        _run(e, {
            jQuerytarget: jQuery('[data-fancybox="' + jQuery(e.currentTarget).attr("data-trigger") + '"]').eq(jQuery(e.currentTarget).attr("data-index") || 0),
            jQuerytrigger: jQuery(this)
        });
    });
})(window, document, window.jQuery || jQuery);

// ==========================================================================
//
// Media
// Adds additional media type support
//
// ==========================================================================
(function(jQuery) {
    "use strict";

    // Formats matching url to final form

    var format = function(url, rez, params) {
        if (!url) {
            return;
        }

        params = params || "";

        if (jQuery.type(params) === "object") {
            params = jQuery.param(params, true);
        }

        jQuery.each(rez, function(key, value) {
            url = url.replace("jQuery" + key, value || "");
        });

        if (params.length) {
            url += (url.indexOf("?") > 0 ? "&" : "?") + params;
        }

        return url;
    };

    // Object containing properties for each media type

    var defaults = {
        youtube: {
            matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
            params: {
                autoplay: 1,
                autohide: 1,
                fs: 1,
                rel: 0,
                hd: 1,
                wmode: "transparent",
                enablejsapi: 1,
                html5: 1
            },
            paramPlace: 8,
            type: "iframe",
            url: "//www.youtube.com/embed/jQuery4",
            thumb: "//img.youtube.com/vi/jQuery4/hqdefault.jpg"
        },

        vimeo: {
            matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
            params: {
                autoplay: 1,
                hd: 1,
                show_title: 1,
                show_byline: 1,
                show_portrait: 0,
                fullscreen: 1,
                api: 1
            },
            paramPlace: 3,
            type: "iframe",
            url: "//player.vimeo.com/video/jQuery2"
        },

        instagram: {
            matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
            type: "image",
            url: "//jQuery1/p/jQuery2/media/?size=l"
        },

        // Examples:
        // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
        // https://www.google.com/maps/@37.7852006,-122.4146355,14.65z
        // https://www.google.com/maps/@52.2111123,2.9237542,6.61z?hl=en
        // https://www.google.com/maps/place/Googleplex/@37.4220041,-122.0833494,17z/data=!4m5!3m4!1s0x0:0x6c296c66619367e0!8m2!3d37.4219998!4d-122.0840572
        gmap_place: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
            type: "iframe",
            url: function(rez) {
                return (
                    "//maps.google." +
                    rez[2] +
                    "/?ll=" +
                    (rez[9] ? rez[9] + "&z=" + Math.floor(rez[10]) + (rez[12] ? rez[12].replace(/^\//, "&") : "") : rez[12] + "").replace(/\?/, "&") +
                    "&output=" +
                    (rez[12] && rez[12].indexOf("layer=c") > 0 ? "svembed" : "embed")
                );
            }
        },

        // Examples:
        // https://www.google.com/maps/search/Empire+State+Building/
        // https://www.google.com/maps/search/?api=1&query=centurylink+field
        // https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393
        gmap_search: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
            type: "iframe",
            url: function(rez) {
                return "//maps.google." + rez[2] + "/maps?q=" + rez[5].replace("query=", "q=").replace("api=1", "") + "&output=embed";
            }
        }
    };

    jQuery(document).on("objectNeedsType.fb", function(e, instance, item) {
        var url = item.src || "",
            type = false,
            media,
            thumb,
            rez,
            params,
            urlParams,
            paramObj,
            provider;

        media = jQuery.extend(true, {}, defaults, item.opts.media);

        // Look for any matching media type
        jQuery.each(media, function(providerName, providerOpts) {
            rez = url.match(providerOpts.matcher);

            if (!rez) {
                return;
            }

            type = providerOpts.type;
            provider = providerName;
            paramObj = {};

            if (providerOpts.paramPlace && rez[providerOpts.paramPlace]) {
                urlParams = rez[providerOpts.paramPlace];

                if (urlParams[0] == "?") {
                    urlParams = urlParams.substring(1);
                }

                urlParams = urlParams.split("&");

                for (var m = 0; m < urlParams.length; ++m) {
                    var p = urlParams[m].split("=", 2);

                    if (p.length == 2) {
                        paramObj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                    }
                }
            }

            params = jQuery.extend(true, {}, providerOpts.params, item.opts[providerName], paramObj);

            url =
                jQuery.type(providerOpts.url) === "function" ? providerOpts.url.call(this, rez, params, item) : format(providerOpts.url, rez, params);

            thumb =
                jQuery.type(providerOpts.thumb) === "function" ? providerOpts.thumb.call(this, rez, params, item) : format(providerOpts.thumb, rez);

            if (providerName === "youtube") {
                url = url.replace(/&t=((\d+)m)?(\d+)s/, function(match, p1, m, s) {
                    return "&start=" + ((m ? parseInt(m, 10) * 60 : 0) + parseInt(s, 10));
                });
            } else if (providerName === "vimeo") {
                url = url.replace("&%23", "#");
            }

            return false;
        });

        // If it is found, then change content type and update the url

        if (type) {
            if (!item.opts.thumb && !(item.opts.jQuerythumb && item.opts.jQuerythumb.length)) {
                item.opts.thumb = thumb;
            }

            if (type === "iframe") {
                item.opts = jQuery.extend(true, item.opts, {
                    iframe: {
                        preload: false,
                        attr: {
                            scrolling: "no"
                        }
                    }
                });
            }

            jQuery.extend(item, {
                type: type,
                src: url,
                origSrc: item.src,
                contentSource: provider,
                contentType: type === "image" ? "image" : provider == "gmap_place" || provider == "gmap_search" ? "map" : "video"
            });
        } else if (url) {
            item.type = item.opts.defaultType;
        }
    });
})(window.jQuery || jQuery);

// ==========================================================================
//
// Guestures
// Adds touch guestures, handles click and tap events
//
// ==========================================================================
(function(window, document, jQuery) {
    "use strict";

    var requestAFrame = (function() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            // if all else fails, use setTimeout
            function(callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    })();

    var cancelAFrame = (function() {
        return (
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            function(id) {
                window.clearTimeout(id);
            }
        );
    })();

    var getPointerXY = function(e) {
        var result = [];

        e = e.originalEvent || e || window.e;
        e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];

        for (var key in e) {
            if (e[key].pageX) {
                result.push({
                    x: e[key].pageX,
                    y: e[key].pageY
                });
            } else if (e[key].clientX) {
                result.push({
                    x: e[key].clientX,
                    y: e[key].clientY
                });
            }
        }

        return result;
    };

    var distance = function(point2, point1, what) {
        if (!point1 || !point2) {
            return 0;
        }

        if (what === "x") {
            return point2.x - point1.x;
        } else if (what === "y") {
            return point2.y - point1.y;
        }

        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    };

    var isClickable = function(jQueryel) {
        if (
            jQueryel.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio') ||
            jQuery.isFunction(jQueryel.get(0).onclick) ||
            jQueryel.data("selectable")
        ) {
            return true;
        }

        // Check for attributes like data-fancybox-next or data-fancybox-close
        for (var i = 0, atts = jQueryel[0].attributes, n = atts.length; i < n; i++) {
            if (atts[i].nodeName.substr(0, 14) === "data-fancybox-") {
                return true;
            }
        }

        return false;
    };

    var hasScrollbars = function(el) {
        var overflowY = window.getComputedStyle(el)["overflow-y"],
            overflowX = window.getComputedStyle(el)["overflow-x"],
            vertical = (overflowY === "scroll" || overflowY === "auto") && el.scrollHeight > el.clientHeight,
            horizontal = (overflowX === "scroll" || overflowX === "auto") && el.scrollWidth > el.clientWidth;

        return vertical || horizontal;
    };

    var isScrollable = function(jQueryel) {
        var rez = false;

        while (true) {
            rez = hasScrollbars(jQueryel.get(0));

            if (rez) {
                break;
            }

            jQueryel = jQueryel.parent();

            if (!jQueryel.length || jQueryel.hasClass("fancybox-stage") || jQueryel.is("body")) {
                break;
            }
        }

        return rez;
    };

    var Guestures = function(instance) {
        var self = this;

        self.instance = instance;

        self.jQuerybg = instance.jQueryrefs.bg;
        self.jQuerystage = instance.jQueryrefs.stage;
        self.jQuerycontainer = instance.jQueryrefs.container;

        self.destroy();

        self.jQuerycontainer.on("touchstart.fb.touch mousedown.fb.touch", jQuery.proxy(self, "ontouchstart"));
    };

    Guestures.prototype.destroy = function() {
        this.jQuerycontainer.off(".fb.touch");
    };

    Guestures.prototype.ontouchstart = function(e) {
        var self = this,
            jQuerytarget = jQuery(e.target),
            instance = self.instance,
            current = instance.current,
            jQuerycontent = current.jQuerycontent,
            isTouchDevice = e.type == "touchstart";

        // Do not respond to both (touch and mouse) events
        if (isTouchDevice) {
            self.jQuerycontainer.off("mousedown.fb.touch");
        }

        // Ignore right click
        if (e.originalEvent && e.originalEvent.button == 2) {
            return;
        }

        // Ignore taping on links, buttons, input elements
        if (!jQuerytarget.length || isClickable(jQuerytarget) || isClickable(jQuerytarget.parent())) {
            return;
        }

        // Ignore clicks on the scrollbar
        if (!jQuerytarget.is("img") && e.originalEvent.clientX > jQuerytarget[0].clientWidth + jQuerytarget.offset().left) {
            return;
        }

        // Ignore clicks while zooming or closing
        if (!current || instance.isAnimating || instance.isClosing) {
            e.stopPropagation();
            e.preventDefault();

            return;
        }

        self.realPoints = self.startPoints = getPointerXY(e);

        if (!self.startPoints.length) {
            return;
        }

        e.stopPropagation();

        self.startEvent = e;

        self.canTap = true;
        self.jQuerytarget = jQuerytarget;
        self.jQuerycontent = jQuerycontent;
        self.opts = current.opts.touch;

        self.isPanning = false;
        self.isSwiping = false;
        self.isZooming = false;
        self.isScrolling = false;

        self.startTime = new Date().getTime();
        self.distanceX = self.distanceY = self.distance = 0;

        self.canvasWidth = Math.round(current.jQueryslide[0].clientWidth);
        self.canvasHeight = Math.round(current.jQueryslide[0].clientHeight);

        self.contentLastPos = null;
        self.contentStartPos = jQuery.fancybox.getTranslate(self.jQuerycontent) || { top: 0, left: 0 };
        self.sliderStartPos = self.sliderLastPos || jQuery.fancybox.getTranslate(current.jQueryslide);

        // Since position will be absolute, but we need to make it relative to the stage
        self.stagePos = jQuery.fancybox.getTranslate(instance.jQueryrefs.stage);

        self.sliderStartPos.top -= self.stagePos.top;
        self.sliderStartPos.left -= self.stagePos.left;

        self.contentStartPos.top -= self.stagePos.top;
        self.contentStartPos.left -= self.stagePos.left;

        jQuery(document)
            .off(".fb.touch")
            .on(isTouchDevice ? "touchend.fb.touch touchcancel.fb.touch" : "mouseup.fb.touch mouseleave.fb.touch", jQuery.proxy(self, "ontouchend"))
            .on(isTouchDevice ? "touchmove.fb.touch" : "mousemove.fb.touch", jQuery.proxy(self, "ontouchmove"));

        if (jQuery.fancybox.isMobile) {
            document.addEventListener("scroll", self.onscroll, true);
        }

        if (!(self.opts || instance.canPan()) || !(jQuerytarget.is(self.jQuerystage) || self.jQuerystage.find(jQuerytarget).length)) {
            if (jQuerytarget.is(".fancybox-image")) {
                e.preventDefault();
            }

            return;
        }

        if (!(jQuery.fancybox.isMobile && (isScrollable(jQuerytarget) || isScrollable(jQuerytarget.parent())))) {
            e.preventDefault();
        }

        if (self.startPoints.length === 1 || current.hasError) {
            if (self.instance.canPan()) {
                jQuery.fancybox.stop(self.jQuerycontent);

                self.jQuerycontent.css("transition-duration", "");

                self.isPanning = true;
            } else {
                self.isSwiping = true;
            }

            self.jQuerycontainer.addClass("fancybox-controls--isGrabbing");
        }

        if (self.startPoints.length === 2 && current.type === "image" && (current.isLoaded || current.jQueryghost)) {
            self.canTap = false;
            self.isSwiping = false;
            self.isPanning = false;

            self.isZooming = true;

            jQuery.fancybox.stop(self.jQuerycontent);

            self.jQuerycontent.css("transition-duration", "");

            self.centerPointStartX = (self.startPoints[0].x + self.startPoints[1].x) * 0.5 - jQuery(window).scrollLeft();
            self.centerPointStartY = (self.startPoints[0].y + self.startPoints[1].y) * 0.5 - jQuery(window).scrollTop();

            self.percentageOfImageAtPinchPointX = (self.centerPointStartX - self.contentStartPos.left) / self.contentStartPos.width;
            self.percentageOfImageAtPinchPointY = (self.centerPointStartY - self.contentStartPos.top) / self.contentStartPos.height;

            self.startDistanceBetweenFingers = distance(self.startPoints[0], self.startPoints[1]);
        }
    };

    Guestures.prototype.onscroll = function(e) {
        var self = this;

        self.isScrolling = true;

        document.removeEventListener("scroll", self.onscroll, true);
    };

    Guestures.prototype.ontouchmove = function(e) {
        var self = this,
            jQuerytarget = jQuery(e.target);

        // Make sure user has not released over iframe or disabled element
        if (e.originalEvent.buttons !== undefined && e.originalEvent.buttons === 0) {
            self.ontouchend(e);
            return;
        }

        if (self.isScrolling || !(jQuerytarget.is(self.jQuerystage) || self.jQuerystage.find(jQuerytarget).length)) {
            self.canTap = false;

            return;
        }

        self.newPoints = getPointerXY(e);

        if (!(self.opts || self.instance.canPan()) || !self.newPoints.length || !self.newPoints.length) {
            return;
        }

        if (!(self.isSwiping && self.isSwiping === true)) {
            e.preventDefault();
        }

        self.distanceX = distance(self.newPoints[0], self.startPoints[0], "x");
        self.distanceY = distance(self.newPoints[0], self.startPoints[0], "y");

        self.distance = distance(self.newPoints[0], self.startPoints[0]);

        // Skip false ontouchmove events (Chrome)
        if (self.distance > 0) {
            if (self.isSwiping) {
                self.onSwipe(e);
            } else if (self.isPanning) {
                self.onPan();
            } else if (self.isZooming) {
                self.onZoom();
            }
        }
    };

    Guestures.prototype.onSwipe = function(e) {
        var self = this,
            swiping = self.isSwiping,
            left = self.sliderStartPos.left || 0,
            angle;

        // If direction is not yet determined
        if (swiping === true) {
            // We need at least 10px distance to correctly calculate an angle
            if (Math.abs(self.distance) > 10) {
                self.canTap = false;

                if (self.instance.group.length < 2 && self.opts.vertical) {
                    self.isSwiping = "y";
                } else if (self.instance.isDragging || self.opts.vertical === false || (self.opts.vertical === "auto" && jQuery(window).width() > 800)) {
                    self.isSwiping = "x";
                } else {
                    angle = Math.abs(Math.atan2(self.distanceY, self.distanceX) * 180 / Math.PI);

                    self.isSwiping = angle > 45 && angle < 135 ? "y" : "x";
                }

                self.canTap = false;

                if (self.isSwiping === "y" && jQuery.fancybox.isMobile && (isScrollable(self.jQuerytarget) || isScrollable(self.jQuerytarget.parent()))) {
                    self.isScrolling = true;

                    return;
                }

                self.instance.isDragging = self.isSwiping;

                // Reset points to avoid jumping, because we dropped first swipes to calculate the angle
                self.startPoints = self.newPoints;

                jQuery.each(self.instance.slides, function(index, slide) {
                    jQuery.fancybox.stop(slide.jQueryslide);

                    slide.jQueryslide.css("transition-duration", "");

                    slide.inTransition = false;

                    if (slide.pos === self.instance.current.pos) {
                        self.sliderStartPos.left = jQuery.fancybox.getTranslate(slide.jQueryslide).left - jQuery.fancybox.getTranslate(self.instance.jQueryrefs.stage).left;
                    }
                });

                // Stop slideshow
                if (self.instance.SlideShow && self.instance.SlideShow.isActive) {
                    self.instance.SlideShow.stop();
                }
            }

            return;
        }

        // Sticky edges
        if (swiping == "x") {
            if (
                self.distanceX > 0 &&
                (self.instance.group.length < 2 || (self.instance.current.index === 0 && !self.instance.current.opts.loop))
            ) {
                left = left + Math.pow(self.distanceX, 0.8);
            } else if (
                self.distanceX < 0 &&
                (self.instance.group.length < 2 ||
                    (self.instance.current.index === self.instance.group.length - 1 && !self.instance.current.opts.loop))
            ) {
                left = left - Math.pow(-self.distanceX, 0.8);
            } else {
                left = left + self.distanceX;
            }
        }

        self.sliderLastPos = {
            top: swiping == "x" ? 0 : self.sliderStartPos.top + self.distanceY,
            left: left
        };

        if (self.requestId) {
            cancelAFrame(self.requestId);

            self.requestId = null;
        }

        self.requestId = requestAFrame(function() {
            if (self.sliderLastPos) {
                jQuery.each(self.instance.slides, function(index, slide) {
                    var pos = slide.pos - self.instance.currPos;

                    jQuery.fancybox.setTranslate(slide.jQueryslide, {
                        top: self.sliderLastPos.top,
                        left: self.sliderLastPos.left + pos * self.canvasWidth + pos * slide.opts.gutter
                    });
                });

                self.jQuerycontainer.addClass("fancybox-is-sliding");
            }
        });
    };

    Guestures.prototype.onPan = function() {
        var self = this;

        // Prevent accidental movement (sometimes, when tapping casually, finger can move a bit)
        if (distance(self.newPoints[0], self.realPoints[0]) < (jQuery.fancybox.isMobile ? 10 : 5)) {
            self.startPoints = self.newPoints;
            return;
        }

        self.canTap = false;

        self.contentLastPos = self.limitMovement();

        if (self.requestId) {
            cancelAFrame(self.requestId);

            self.requestId = null;
        }

        self.requestId = requestAFrame(function() {
            jQuery.fancybox.setTranslate(self.jQuerycontent, self.contentLastPos);
        });
    };

    // Make panning sticky to the edges
    Guestures.prototype.limitMovement = function() {
        var self = this;

        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;

        var distanceX = self.distanceX;
        var distanceY = self.distanceY;

        var contentStartPos = self.contentStartPos;

        var currentOffsetX = contentStartPos.left;
        var currentOffsetY = contentStartPos.top;

        var currentWidth = contentStartPos.width;
        var currentHeight = contentStartPos.height;

        var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY, newOffsetX, newOffsetY;

        if (currentWidth > canvasWidth) {
            newOffsetX = currentOffsetX + distanceX;
        } else {
            newOffsetX = currentOffsetX;
        }

        newOffsetY = currentOffsetY + distanceY;

        // Slow down proportionally to traveled distance
        minTranslateX = Math.max(0, canvasWidth * 0.5 - currentWidth * 0.5);
        minTranslateY = Math.max(0, canvasHeight * 0.5 - currentHeight * 0.5);

        maxTranslateX = Math.min(canvasWidth - currentWidth, canvasWidth * 0.5 - currentWidth * 0.5);
        maxTranslateY = Math.min(canvasHeight - currentHeight, canvasHeight * 0.5 - currentHeight * 0.5);

        //   ->
        if (distanceX > 0 && newOffsetX > minTranslateX) {
            newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
        }

        //    <-
        if (distanceX < 0 && newOffsetX < maxTranslateX) {
            newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
        }

        //   \/
        if (distanceY > 0 && newOffsetY > minTranslateY) {
            newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
        }

        //   /\
        if (distanceY < 0 && newOffsetY < maxTranslateY) {
            newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
        }

        return {
            top: newOffsetY,
            left: newOffsetX
        };
    };

    Guestures.prototype.limitPosition = function(newOffsetX, newOffsetY, newWidth, newHeight) {
        var self = this;

        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;

        if (newWidth > canvasWidth) {
            newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
            newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
        } else {
            // Center horizontally
            newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
        }

        if (newHeight > canvasHeight) {
            newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
            newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
        } else {
            // Center vertically
            newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
        }

        return {
            top: newOffsetY,
            left: newOffsetX
        };
    };

    Guestures.prototype.onZoom = function() {
        var self = this;

        // Calculate current distance between points to get pinch ratio and new width and height
        var contentStartPos = self.contentStartPos;

        var currentWidth = contentStartPos.width;
        var currentHeight = contentStartPos.height;

        var currentOffsetX = contentStartPos.left;
        var currentOffsetY = contentStartPos.top;

        var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);

        var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;

        var newWidth = Math.floor(currentWidth * pinchRatio);
        var newHeight = Math.floor(currentHeight * pinchRatio);

        // This is the translation due to pinch-zooming
        var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
        var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;

        // Point between the two touches
        var centerPointEndX = (self.newPoints[0].x + self.newPoints[1].x) / 2 - jQuery(window).scrollLeft();
        var centerPointEndY = (self.newPoints[0].y + self.newPoints[1].y) / 2 - jQuery(window).scrollTop();

        // And this is the translation due to translation of the centerpoint
        // between the two fingers
        var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
        var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;

        // The new offset is the old/current one plus the total translation
        var newOffsetX = currentOffsetX + (translateFromZoomingX + translateFromTranslatingX);
        var newOffsetY = currentOffsetY + (translateFromZoomingY + translateFromTranslatingY);

        var newPos = {
            top: newOffsetY,
            left: newOffsetX,
            scaleX: pinchRatio,
            scaleY: pinchRatio
        };

        self.canTap = false;

        self.newWidth = newWidth;
        self.newHeight = newHeight;

        self.contentLastPos = newPos;

        if (self.requestId) {
            cancelAFrame(self.requestId);

            self.requestId = null;
        }

        self.requestId = requestAFrame(function() {
            jQuery.fancybox.setTranslate(self.jQuerycontent, self.contentLastPos);
        });
    };

    Guestures.prototype.ontouchend = function(e) {
        var self = this;
        var dMs = Math.max(new Date().getTime() - self.startTime, 1);

        var swiping = self.isSwiping;
        var panning = self.isPanning;
        var zooming = self.isZooming;
        var scrolling = self.isScrolling;

        self.endPoints = getPointerXY(e);

        self.jQuerycontainer.removeClass("fancybox-controls--isGrabbing");

        jQuery(document).off(".fb.touch");

        document.removeEventListener("scroll", self.onscroll, true);

        if (self.requestId) {
            cancelAFrame(self.requestId);

            self.requestId = null;
        }

        self.isSwiping = false;
        self.isPanning = false;
        self.isZooming = false;
        self.isScrolling = false;

        self.instance.isDragging = false;

        if (self.canTap) {
            return self.onTap(e);
        }

        self.speed = 366;

        // Speed in px/ms
        self.velocityX = self.distanceX / dMs * 0.5;
        self.velocityY = self.distanceY / dMs * 0.5;

        self.speedX = Math.max(self.speed * 0.5, Math.min(self.speed * 1.5, 1 / Math.abs(self.velocityX) * self.speed));

        if (panning) {
            self.endPanning();
        } else if (zooming) {
            self.endZooming();
        } else {
            self.endSwiping(swiping, scrolling);
        }

        return;
    };

    Guestures.prototype.endSwiping = function(swiping, scrolling) {
        var self = this,
            ret = false,
            len = self.instance.group.length;

        self.sliderLastPos = null;

        // Close if swiped vertically / navigate if horizontally
        if (swiping == "y" && !scrolling && Math.abs(self.distanceY) > 50) {
            // Continue vertical movement
            jQuery.fancybox.animate(
                self.instance.current.jQueryslide, {
                    top: self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
                    opacity: 0
                },
                200
            );

            ret = self.instance.close(true, 200);
        } else if (swiping == "x" && self.distanceX > 50 && len > 1) {
            ret = self.instance.previous(self.speedX);
        } else if (swiping == "x" && self.distanceX < -50 && len > 1) {
            ret = self.instance.next(self.speedX);
        }

        if (ret === false && (swiping == "x" || swiping == "y")) {
            if (scrolling || len < 2) {
                self.instance.centerSlide(self.instance.current, 150);
            } else {
                self.instance.jumpTo(self.instance.current.index);
            }
        }

        self.jQuerycontainer.removeClass("fancybox-is-sliding");
    };

    // Limit panning from edges
    // ========================
    Guestures.prototype.endPanning = function() {
        var self = this;
        var newOffsetX, newOffsetY, newPos;

        if (!self.contentLastPos) {
            return;
        }

        if (self.opts.momentum === false) {
            newOffsetX = self.contentLastPos.left;
            newOffsetY = self.contentLastPos.top;
        } else {
            // Continue movement
            newOffsetX = self.contentLastPos.left + self.velocityX * self.speed;
            newOffsetY = self.contentLastPos.top + self.velocityY * self.speed;
        }

        newPos = self.limitPosition(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);

        newPos.width = self.contentStartPos.width;
        newPos.height = self.contentStartPos.height;

        jQuery.fancybox.animate(self.jQuerycontent, newPos, 330);
    };

    Guestures.prototype.endZooming = function() {
        var self = this;

        var current = self.instance.current;

        var newOffsetX, newOffsetY, newPos, reset;

        var newWidth = self.newWidth;
        var newHeight = self.newHeight;

        if (!self.contentLastPos) {
            return;
        }

        newOffsetX = self.contentLastPos.left;
        newOffsetY = self.contentLastPos.top;

        reset = {
            top: newOffsetY,
            left: newOffsetX,
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1
        };

        // Reset scalex/scaleY values; this helps for perfomance and does not break animation
        jQuery.fancybox.setTranslate(self.jQuerycontent, reset);

        if (newWidth < self.canvasWidth && newHeight < self.canvasHeight) {
            self.instance.scaleToFit(150);
        } else if (newWidth > current.width || newHeight > current.height) {
            self.instance.scaleToActual(self.centerPointStartX, self.centerPointStartY, 150);
        } else {
            newPos = self.limitPosition(newOffsetX, newOffsetY, newWidth, newHeight);

            // Switch from scale() to width/height or animation will not work correctly
            jQuery.fancybox.setTranslate(self.jQuerycontent, jQuery.fancybox.getTranslate(self.jQuerycontent));

            jQuery.fancybox.animate(self.jQuerycontent, newPos, 150);
        }
    };

    Guestures.prototype.onTap = function(e) {
        var self = this;
        var jQuerytarget = jQuery(e.target);

        var instance = self.instance;
        var current = instance.current;

        var endPoints = (e && getPointerXY(e)) || self.startPoints;

        var tapX = endPoints[0] ? endPoints[0].x - jQuery(window).scrollLeft() - self.stagePos.left : 0;
        var tapY = endPoints[0] ? endPoints[0].y - jQuery(window).scrollTop() - self.stagePos.top : 0;

        var where;

        var process = function(prefix) {
            var action = current.opts[prefix];

            if (jQuery.isFunction(action)) {
                action = action.apply(instance, [current, e]);
            }

            if (!action) {
                return;
            }

            switch (action) {
                case "close":
                    instance.close(self.startEvent);

                    break;

                case "toggleControls":
                    instance.toggleControls(true);

                    break;

                case "next":
                    instance.next();

                    break;

                case "nextOrClose":
                    if (instance.group.length > 1) {
                        instance.next();
                    } else {
                        instance.close(self.startEvent);
                    }

                    break;

                case "zoom":
                    if (current.type == "image" && (current.isLoaded || current.jQueryghost)) {
                        if (instance.canPan()) {
                            instance.scaleToFit();
                        } else if (instance.isScaledDown()) {
                            instance.scaleToActual(tapX, tapY);
                        } else if (instance.group.length < 2) {
                            instance.close(self.startEvent);
                        }
                    }

                    break;
            }
        };

        // Ignore right click
        if (e.originalEvent && e.originalEvent.button == 2) {
            return;
        }

        // Skip if clicked on the scrollbar
        if (!jQuerytarget.is("img") && tapX > jQuerytarget[0].clientWidth + jQuerytarget.offset().left) {
            return;
        }

        // Check where is clicked
        if (jQuerytarget.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container")) {
            where = "Outside";
        } else if (jQuerytarget.is(".fancybox-slide")) {
            where = "Slide";
        } else if (
            instance.current.jQuerycontent &&
            instance.current.jQuerycontent
            .find(jQuerytarget)
            .addBack()
            .filter(jQuerytarget).length
        ) {
            where = "Content";
        } else {
            return;
        }

        // Check if this is a double tap
        if (self.tapped) {
            // Stop previously created single tap
            clearTimeout(self.tapped);
            self.tapped = null;

            // Skip if distance between taps is too big
            if (Math.abs(tapX - self.tapX) > 50 || Math.abs(tapY - self.tapY) > 50) {
                return this;
            }

            // OK, now we assume that this is a double-tap
            process("dblclick" + where);
        } else {
            // Single tap will be processed if user has not clicked second time within 300ms
            // or there is no need to wait for double-tap
            self.tapX = tapX;
            self.tapY = tapY;

            if (current.opts["dblclick" + where] && current.opts["dblclick" + where] !== current.opts["click" + where]) {
                self.tapped = setTimeout(function() {
                    self.tapped = null;

                    process("click" + where);
                }, 500);
            } else {
                process("click" + where);
            }
        }

        return this;
    };

    jQuery(document).on("onActivate.fb", function(e, instance) {
        if (instance && !instance.Guestures) {
            instance.Guestures = new Guestures(instance);
        }
    });
})(window, document, window.jQuery || jQuery);

// ==========================================================================
//
// SlideShow
// Enables slideshow functionality
//
// Example of usage:
// jQuery.fancybox.getInstance().SlideShow.start()
//
// ==========================================================================
(function(document, jQuery) {
    "use strict";

    jQuery.extend(true, jQuery.fancybox.defaults, {
        btnTpl: {
            slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M13,12 L27,20 L13,27 Z" />' +
                '<path d="M15,10 v19 M23,10 v19" />' +
                "</svg>" +
                "</button>"
        },
        slideShow: {
            autoStart: false,
            speed: 3000
        }
    });

    var SlideShow = function(instance) {
        this.instance = instance;
        this.init();
    };

    jQuery.extend(SlideShow.prototype, {
        timer: null,
        isActive: false,
        jQuerybutton: null,

        init: function() {
            var self = this;

            self.jQuerybutton = self.instance.jQueryrefs.toolbar.find("[data-fancybox-play]").on("click", function() {
                self.toggle();
            });

            if (self.instance.group.length < 2 || !self.instance.group[self.instance.currIndex].opts.slideShow) {
                self.jQuerybutton.hide();
            }
        },

        set: function(force) {
            var self = this;

            // Check if reached last element
            if (
                self.instance &&
                self.instance.current &&
                (force === true || self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1)
            ) {
                self.timer = setTimeout(function() {
                    if (self.isActive) {
                        self.instance.jumpTo((self.instance.currIndex + 1) % self.instance.group.length);
                    }
                }, self.instance.current.opts.slideShow.speed);
            } else {
                self.stop();
                self.instance.idleSecondsCounter = 0;
                self.instance.showControls();
            }
        },

        clear: function() {
            var self = this;

            clearTimeout(self.timer);

            self.timer = null;
        },

        start: function() {
            var self = this;
            var current = self.instance.current;

            if (current) {
                self.isActive = true;

                self.jQuerybutton
                    .attr("title", current.opts.i18n[current.opts.lang].PLAY_STOP)
                    .removeClass("fancybox-button--play")
                    .addClass("fancybox-button--pause");

                self.set(true);
            }
        },

        stop: function() {
            var self = this;
            var current = self.instance.current;

            self.clear();

            self.jQuerybutton
                .attr("title", current.opts.i18n[current.opts.lang].PLAY_START)
                .removeClass("fancybox-button--pause")
                .addClass("fancybox-button--play");

            self.isActive = false;
        },

        toggle: function() {
            var self = this;

            if (self.isActive) {
                self.stop();
            } else {
                self.start();
            }
        }
    });

    jQuery(document).on({
        "onInit.fb": function(e, instance) {
            if (instance && !instance.SlideShow) {
                instance.SlideShow = new SlideShow(instance);
            }
        },

        "beforeShow.fb": function(e, instance, current, firstRun) {
            var SlideShow = instance && instance.SlideShow;

            if (firstRun) {
                if (SlideShow && current.opts.slideShow.autoStart) {
                    SlideShow.start();
                }
            } else if (SlideShow && SlideShow.isActive) {
                SlideShow.clear();
            }
        },

        "afterShow.fb": function(e, instance, current) {
            var SlideShow = instance && instance.SlideShow;

            if (SlideShow && SlideShow.isActive) {
                SlideShow.set();
            }
        },

        "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
            var SlideShow = instance && instance.SlideShow;

            // "P" or Spacebar
            if (SlideShow && current.opts.slideShow && (keycode === 80 || keycode === 32) && !jQuery(document.activeElement).is("button,a,input")) {
                keypress.preventDefault();

                SlideShow.toggle();
            }
        },

        "beforeClose.fb onDeactivate.fb": function(e, instance) {
            var SlideShow = instance && instance.SlideShow;

            if (SlideShow) {
                SlideShow.stop();
            }
        }
    });

    // Page Visibility API to pause slideshow when window is not active
    jQuery(document).on("visibilitychange", function() {
        var instance = jQuery.fancybox.getInstance();
        var SlideShow = instance && instance.SlideShow;

        if (SlideShow && SlideShow.isActive) {
            if (document.hidden) {
                SlideShow.clear();
            } else {
                SlideShow.set();
            }
        }
    });
})(document, window.jQuery || jQuery);

// ==========================================================================
//
// FullScreen
// Adds fullscreen functionality
//
// ==========================================================================
(function(document, jQuery) {
    "use strict";

    // Collection of methods supported by user browser
    var fn = (function() {
        var fnMap = [
            ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
            // new WebKit
            [
                "webkitRequestFullscreen",
                "webkitExitFullscreen",
                "webkitFullscreenElement",
                "webkitFullscreenEnabled",
                "webkitfullscreenchange",
                "webkitfullscreenerror"
            ],
            // old WebKit (Safari 5.1)
            [
                "webkitRequestFullScreen",
                "webkitCancelFullScreen",
                "webkitCurrentFullScreenElement",
                "webkitCancelFullScreen",
                "webkitfullscreenchange",
                "webkitfullscreenerror"
            ],
            [
                "mozRequestFullScreen",
                "mozCancelFullScreen",
                "mozFullScreenElement",
                "mozFullScreenEnabled",
                "mozfullscreenchange",
                "mozfullscreenerror"
            ],
            ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
        ];

        var ret = {};

        for (var i = 0; i < fnMap.length; i++) {
            var val = fnMap[i];

            if (val && val[1] in document) {
                for (var j = 0; j < val.length; j++) {
                    ret[fnMap[0][j]] = val[j];
                }

                return ret;
            }
        }

        return false;
    })();

    // If browser does not have Full Screen API, then simply unset default button template and stop
    if (!fn) {
        if (jQuery && jQuery.fancybox) {
            jQuery.fancybox.defaults.btnTpl.fullScreen = false;
        }

        return;
    }

    var FullScreen = {
        request: function(elem) {
            elem = elem || document.documentElement;

            elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);
        },
        exit: function() {
            document[fn.exitFullscreen]();
        },
        toggle: function(elem) {
            elem = elem || document.documentElement;

            if (this.isFullscreen()) {
                this.exit();
            } else {
                this.request(elem);
            }
        },
        isFullscreen: function() {
            return Boolean(document[fn.fullscreenElement]);
        },
        enabled: function() {
            return Boolean(document[fn.fullscreenEnabled]);
        }
    };

    jQuery.extend(true, jQuery.fancybox.defaults, {
        btnTpl: {
            fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M9,12 v16 h22 v-16 h-22 v8" />' +
                "</svg>" +
                "</button>"
        },
        fullScreen: {
            autoStart: false
        }
    });

    jQuery(document).on({
        "onInit.fb": function(e, instance) {
            var jQuerycontainer;

            if (instance && instance.group[instance.currIndex].opts.fullScreen) {
                jQuerycontainer = instance.jQueryrefs.container;

                jQuerycontainer.on("click.fb-fullscreen", "[data-fancybox-fullscreen]", function(e) {
                    e.stopPropagation();
                    e.preventDefault();

                    FullScreen.toggle();
                });

                if (instance.opts.fullScreen && instance.opts.fullScreen.autoStart === true) {
                    FullScreen.request();
                }

                // Expose API
                instance.FullScreen = FullScreen;
            } else if (instance) {
                instance.jQueryrefs.toolbar.find("[data-fancybox-fullscreen]").hide();
            }
        },

        "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
            // "F"
            if (instance && instance.FullScreen && keycode === 70) {
                keypress.preventDefault();

                instance.FullScreen.toggle();
            }
        },

        "beforeClose.fb": function(e, instance) {
            if (instance && instance.FullScreen && instance.jQueryrefs.container.hasClass("fancybox-is-fullscreen")) {
                FullScreen.exit();
            }
        }
    });

    jQuery(document).on(fn.fullscreenchange, function() {
        var isFullscreen = FullScreen.isFullscreen(),
            instance = jQuery.fancybox.getInstance();

        if (instance) {
            // If image is zooming, then force to stop and reposition properly
            if (instance.current && instance.current.type === "image" && instance.isAnimating) {
                instance.current.jQuerycontent.css("transition", "none");

                instance.isAnimating = false;

                instance.update(true, true, 0);
            }

            instance.trigger("onFullscreenChange", isFullscreen);

            instance.jQueryrefs.container.toggleClass("fancybox-is-fullscreen", isFullscreen);
        }
    });
})(document, window.jQuery || jQuery);

// ==========================================================================
//
// Thumbs
// Displays thumbnails in a grid
//
// ==========================================================================
(function(document, jQuery) {
    "use strict";

    var CLASS = "fancybox-thumbs",
        CLASS_ACTIVE = CLASS + "-active",
        CLASS_LOAD = CLASS + "-loading";

    // Make sure there are default values
    jQuery.fancybox.defaults = jQuery.extend(
        true, {
            btnTpl: {
                thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}">' +
                    '<svg viewBox="0 0 120 120">' +
                    '<path d="M30,30 h14 v14 h-14 Z M50,30 h14 v14 h-14 Z M70,30 h14 v14 h-14 Z M30,50 h14 v14 h-14 Z M50,50 h14 v14 h-14 Z M70,50 h14 v14 h-14 Z M30,70 h14 v14 h-14 Z M50,70 h14 v14 h-14 Z M70,70 h14 v14 h-14 Z" />' +
                    "</svg>" +
                    "</button>"
            },
            thumbs: {
                autoStart: false, // Display thumbnails on opening
                hideOnClose: true, // Hide thumbnail grid when closing animation starts
                parentEl: ".fancybox-container", // Container is injected into this element
                axis: "y" // Vertical (y) or horizontal (x) scrolling
            }
        },
        jQuery.fancybox.defaults
    );

    var FancyThumbs = function(instance) {
        this.init(instance);
    };

    jQuery.extend(FancyThumbs.prototype, {
        jQuerybutton: null,
        jQuerygrid: null,
        jQuerylist: null,
        isVisible: false,
        isActive: false,

        init: function(instance) {
            var self = this,
                first,
                second;

            self.instance = instance;

            instance.Thumbs = self;

            self.opts = instance.group[instance.currIndex].opts.thumbs;

            // Enable thumbs if at least two group items have thumbnails
            first = instance.group[0];
            first = first.opts.thumb || (first.opts.jQuerythumb && first.opts.jQuerythumb.length ? first.opts.jQuerythumb.attr("src") : false);

            if (instance.group.length > 1) {
                second = instance.group[1];
                second = second.opts.thumb || (second.opts.jQuerythumb && second.opts.jQuerythumb.length ? second.opts.jQuerythumb.attr("src") : false);
            }

            self.jQuerybutton = instance.jQueryrefs.toolbar.find("[data-fancybox-thumbs]");

            if (self.opts && first && second && first && second) {
                self.jQuerybutton.show().on("click", function() {
                    self.toggle();
                });

                self.isActive = true;
            } else {
                self.jQuerybutton.hide();
            }
        },

        create: function() {
            var self = this,
                instance = self.instance,
                parentEl = self.opts.parentEl,
                list = [],
                src;

            if (!self.jQuerygrid) {
                // Create main element
                self.jQuerygrid = jQuery('<div class="' + CLASS + " " + CLASS + "-" + self.opts.axis + '"></div>').appendTo(
                    instance.jQueryrefs.container
                    .find(parentEl)
                    .addBack()
                    .filter(parentEl)
                );

                // Add "click" event that performs gallery navigation
                self.jQuerygrid.on("click", "li", function() {
                    instance.jumpTo(jQuery(this).attr("data-index"));
                });
            }

            // Build the list
            if (!self.jQuerylist) {
                self.jQuerylist = jQuery("<ul>").appendTo(self.jQuerygrid);
            }

            jQuery.each(instance.group, function(i, item) {
                src = item.opts.thumb || (item.opts.jQuerythumb ? item.opts.jQuerythumb.attr("src") : null);

                if (!src && item.type === "image") {
                    src = item.src;
                }

                list.push(
                    '<li data-index="' +
                    i +
                    '" tabindex="0" class="' +
                    CLASS_LOAD +
                    '"' +
                    (src && src.length ? ' style="background-image:url(' + src + ')" />' : "") +
                    "></li>"
                );
            });

            self.jQuerylist[0].innerHTML = list.join("");

            if (self.opts.axis === "x") {
                // Set fixed width for list element to enable horizontal scrolling
                self.jQuerylist.width(
                    parseInt(self.jQuerygrid.css("padding-right"), 10) +
                    instance.group.length *
                    self.jQuerylist
                    .children()
                    .eq(0)
                    .outerWidth(true)
                );
            }
        },

        focus: function(duration) {
            var self = this,
                jQuerylist = self.jQuerylist,
                jQuerygrid = self.jQuerygrid,
                thumb,
                thumbPos;

            if (!self.instance.current) {
                return;
            }

            thumb = jQuerylist
                .children()
                .removeClass(CLASS_ACTIVE)
                .filter('[data-index="' + self.instance.current.index + '"]')
                .addClass(CLASS_ACTIVE);

            thumbPos = thumb.position();

            // Check if need to scroll to make current thumb visible
            if (self.opts.axis === "y" && (thumbPos.top < 0 || thumbPos.top > jQuerylist.height() - thumb.outerHeight())) {
                jQuerylist.stop().animate({
                        scrollTop: jQuerylist.scrollTop() + thumbPos.top
                    },
                    duration
                );
            } else if (
                self.opts.axis === "x" &&
                (thumbPos.left < jQuerygrid.scrollLeft() || thumbPos.left > jQuerygrid.scrollLeft() + (jQuerygrid.width() - thumb.outerWidth()))
            ) {
                jQuerylist
                    .parent()
                    .stop()
                    .animate({
                            scrollLeft: thumbPos.left
                        },
                        duration
                    );
            }
        },

        update: function() {
            var that = this;
            that.instance.jQueryrefs.container.toggleClass("fancybox-show-thumbs", this.isVisible);

            if (that.isVisible) {
                if (!that.jQuerygrid) {
                    that.create();
                }

                that.instance.trigger("onThumbsShow");

                that.focus(0);
            } else if (that.jQuerygrid) {
                that.instance.trigger("onThumbsHide");
            }

            // Update content position
            that.instance.update();
        },

        hide: function() {
            this.isVisible = false;
            this.update();
        },

        show: function() {
            this.isVisible = true;
            this.update();
        },

        toggle: function() {
            this.isVisible = !this.isVisible;
            this.update();
        }
    });

    jQuery(document).on({
        "onInit.fb": function(e, instance) {
            var Thumbs;

            if (instance && !instance.Thumbs) {
                Thumbs = new FancyThumbs(instance);

                if (Thumbs.isActive && Thumbs.opts.autoStart === true) {
                    Thumbs.show();
                }
            }
        },

        "beforeShow.fb": function(e, instance, item, firstRun) {
            var Thumbs = instance && instance.Thumbs;

            if (Thumbs && Thumbs.isVisible) {
                Thumbs.focus(firstRun ? 0 : 250);
            }
        },

        "afterKeydown.fb": function(e, instance, current, keypress, keycode) {
            var Thumbs = instance && instance.Thumbs;

            // "G"
            if (Thumbs && Thumbs.isActive && keycode === 71) {
                keypress.preventDefault();

                Thumbs.toggle();
            }
        },

        "beforeClose.fb": function(e, instance) {
            var Thumbs = instance && instance.Thumbs;

            if (Thumbs && Thumbs.isVisible && Thumbs.opts.hideOnClose !== false) {
                Thumbs.jQuerygrid.hide();
            }
        }
    });
})(document, window.jQuery || jQuery);

//// ==========================================================================
//
// Share
// Displays simple form for sharing current url
//
// ==========================================================================
(function(document, jQuery) {
    "use strict";

    jQuery.extend(true, jQuery.fancybox.defaults, {
        btnTpl: {
            share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}">' +
                '<svg viewBox="0 0 40 40">' +
                '<path d="M6,30 C8,18 19,16 23,16 L23,16 L23,10 L33,20 L23,29 L23,24 C19,24 8,27 6,30 Z">' +
                "</svg>" +
                "</button>"
        },
        share: {
            url: function(instance, item) {
                return (
                    (!instance.currentHash && !(item.type === "inline" || item.type === "html") ? item.origSrc || item.src : false) || window.location
                );
            },
            tpl: '<div class="fancybox-share">' +
                "<h1>{{SHARE}}</h1>" +
                "<p>" +
                '<a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}">' +
                '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg>' +
                "<span>Facebook</span>" +
                "</a>" +
                '<a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}">' +
                '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg>' +
                "<span>Twitter</span>" +
                "</a>" +
                '<a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}">' +
                '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg>' +
                "<span>Pinterest</span>" +
                "</a>" +
                "</p>" +
                '<p><input class="fancybox-share__input" type="text" value="{{url_raw}}" /></p>' +
                "</div>"
        }
    });

    function escapeHtml(string) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
            "`": "&#x60;",
            "=": "&#x3D;"
        };

        return String(string).replace(/[&<>"'`=\/]/g, function(s) {
            return entityMap[s];
        });
    }

    jQuery(document).on("click", "[data-fancybox-share]", function() {
        var instance = jQuery.fancybox.getInstance(),
            current = instance.current || null,
            url,
            tpl;

        if (!current) {
            return;
        }

        if (jQuery.type(current.opts.share.url) === "function") {
            url = current.opts.share.url.apply(current, [instance, current]);
        }

        tpl = current.opts.share.tpl
            .replace(/\{\{media\}\}/g, current.type === "image" ? encodeURIComponent(current.src) : "")
            .replace(/\{\{url\}\}/g, encodeURIComponent(url))
            .replace(/\{\{url_raw\}\}/g, escapeHtml(url))
            .replace(/\{\{descr\}\}/g, instance.jQuerycaption ? encodeURIComponent(instance.jQuerycaption.text()) : "");

        jQuery.fancybox.open({
            src: instance.translate(instance, tpl),
            type: "html",
            opts: {
                animationEffect: false,
                afterLoad: function(shareInstance, shareCurrent) {
                    // Close self if parent instance is closing
                    instance.jQueryrefs.container.one("beforeClose.fb", function() {
                        shareInstance.close(null, 0);
                    });

                    // Opening links in a popup window
                    shareCurrent.jQuerycontent.find(".fancybox-share__links a").click(function() {
                        window.open(this.href, "Share", "width=550, height=450");
                        return false;
                    });
                }
            }
        });
    });
})(document, window.jQuery || jQuery);

// ==========================================================================
//
// Hash
// Enables linking to each modal
//
// ==========================================================================
(function(document, window, jQuery) {
    "use strict";

    // Simple jQuery.escapeSelector polyfill (for jQuery prior v3)
    if (!jQuery.escapeSelector) {
        jQuery.escapeSelector = function(sel) {
            var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-jQuery|[^\x80-\uFFFF\w-]/g;
            var fcssescape = function(ch, asCodePoint) {
                if (asCodePoint) {
                    // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                    if (ch === "\0") {
                        return "\uFFFD";
                    }

                    // Control characters and (dependent upon position) numbers get escaped as code points
                    return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
                }

                // Other potentially-special ASCII characters get backslash-escaped
                return "\\" + ch;
            };

            return (sel + "").replace(rcssescape, fcssescape);
        };
    }

    // Get info about gallery name and current index from url
    function parseUrl() {
        var hash = window.location.hash.substr(1),
            rez = hash.split("-"),
            index = rez.length > 1 && /^\+?\d+jQuery/.test(rez[rez.length - 1]) ? parseInt(rez.pop(-1), 10) || 1 : 1,
            gallery = rez.join("-");

        return {
            hash: hash,
            /* Index is starting from 1 */
            index: index < 1 ? 1 : index,
            gallery: gallery
        };
    }

    // Trigger click evnt on links to open new fancyBox instance
    function triggerFromUrl(url) {
        var jQueryel;

        if (url.gallery !== "") {
            // If we can find element matching 'data-fancybox' atribute, then trigger click event for that.
            // It should start fancyBox
            jQueryel = jQuery("[data-fancybox='" + jQuery.escapeSelector(url.gallery) + "']")
                .eq(url.index - 1)
                .trigger("click.fb-start");
        }
    }

    // Get gallery name from current instance
    function getGalleryID(instance) {
        var opts, ret;

        if (!instance) {
            return false;
        }

        opts = instance.current ? instance.current.opts : instance.opts;
        ret = opts.hash || (opts.jQueryorig ? opts.jQueryorig.data("fancybox") : "");

        return ret === "" ? false : ret;
    }

    // Start when DOM becomes ready
    jQuery(function() {
        // Check if user has disabled this module
        if (jQuery.fancybox.defaults.hash === false) {
            return;
        }

        // Update hash when opening/closing fancyBox
        jQuery(document).on({
            "onInit.fb": function(e, instance) {
                var url, gallery;

                if (instance.group[instance.currIndex].opts.hash === false) {
                    return;
                }

                url = parseUrl();
                gallery = getGalleryID(instance);

                // Make sure gallery start index matches index from hash
                if (gallery && url.gallery && gallery == url.gallery) {
                    instance.currIndex = url.index - 1;
                }
            },

            "beforeShow.fb": function(e, instance, current, firstRun) {
                var gallery;

                if (!current || current.opts.hash === false) {
                    return;
                }

                // Check if need to update window hash
                gallery = getGalleryID(instance);

                if (!gallery) {
                    return;
                }

                // Variable containing last hash value set by fancyBox
                // It will be used to determine if fancyBox needs to close after hash change is detected
                instance.currentHash = gallery + (instance.group.length > 1 ? "-" + (current.index + 1) : "");

                // If current hash is the same (this instance most likely is opened by hashchange), then do nothing
                if (window.location.hash === "#" + instance.currentHash) {
                    return;
                }

                if (!instance.origHash) {
                    instance.origHash = window.location.hash;
                }

                if (instance.hashTimer) {
                    clearTimeout(instance.hashTimer);
                }

                // Update hash
                instance.hashTimer = setTimeout(function() {
                    if ("replaceState" in window.history) {
                        window.history[firstRun ? "pushState" : "replaceState"]({},
                            document.title,
                            window.location.pathname + window.location.search + "#" + instance.currentHash
                        );

                        if (firstRun) {
                            instance.hasCreatedHistory = true;
                        }
                    } else {
                        window.location.hash = instance.currentHash;
                    }

                    instance.hashTimer = null;
                }, 300);
            },

            "beforeClose.fb": function(e, instance, current) {
                var gallery;

                if (current.opts.hash === false) {
                    return;
                }

                gallery = getGalleryID(instance);

                // Goto previous history entry
                if (instance.currentHash && instance.hasCreatedHistory) {
                    window.history.back();
                } else if (instance.currentHash) {
                    if ("replaceState" in window.history) {
                        window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (instance.origHash || ""));
                    } else {
                        window.location.hash = instance.origHash;
                    }
                }

                instance.currentHash = null;

                clearTimeout(instance.hashTimer);
            }
        });

        // Check if need to start/close after url has changed
        jQuery(window).on("hashchange.fb", function() {
            var url = parseUrl(),
                fb;

            // Find last fancyBox instance that has "hash"
            jQuery.each(
                jQuery(".fancybox-container")
                .get()
                .reverse(),
                function(index, value) {
                    var tmp = jQuery(value).data("FancyBox");
                    //isClosing
                    if (tmp.currentHash) {
                        fb = tmp;
                        return false;
                    }
                }
            );

            if (fb) {
                // Now, compare hash values
                if (fb.currentHash && fb.currentHash !== url.gallery + "-" + url.index && !(url.index === 1 && fb.currentHash == url.gallery)) {
                    fb.currentHash = null;

                    fb.close();
                }
            } else if (url.gallery !== "") {
                triggerFromUrl(url);
            }
        });

        // Check current hash and trigger click event on matching element to start fancyBox, if needed
        setTimeout(function() {
            if (!jQuery.fancybox.getInstance()) {
                triggerFromUrl(parseUrl());
            }
        }, 50);
    });
})(document, window, window.jQuery || jQuery);

// ==========================================================================
//
// Wheel
// Basic mouse weheel support for gallery navigation
//
// ==========================================================================
(function(document, jQuery) {
    "use strict";

    var prevTime = new Date().getTime();

    jQuery(document).on({
        "onInit.fb": function(e, instance, current) {
            instance.jQueryrefs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll", function(e) {
                var current = instance.current,
                    currTime = new Date().getTime();

                if (instance.group.length < 2 || current.opts.wheel === false || (current.opts.wheel === "auto" && current.type !== "image")) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                if (current.jQueryslide.hasClass("fancybox-animated")) {
                    return;
                }

                e = e.originalEvent || e;

                if (currTime - prevTime < 250) {
                    return;
                }

                prevTime = currTime;

                instance[(-e.deltaY || -e.deltaX || e.wheelDelta || -e.detail) < 0 ? "next" : "previous"]();
            });
        }
    });
})(document, window.jQuery || jQuery);