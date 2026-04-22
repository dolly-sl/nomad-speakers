var pdpThumbnail;
var pdpSlider;
$(document).ready(function($) {


        var producrSlider = new Swiper('.js__pdp-recommendation-slider', {
            slidesPerView: 3,
            autoHeight: true,
            resistance: false,
            shortSwipes: true,

            spaceBetween: 40,
            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next-product-recommed',
                prevEl: '.swiper-button-prev-product-recommed',
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                601: {
                    slidesPerView: 2,
                },
                981: {
                    slidesPerView: 3,
                },
            },
        });

        /*Slider working Start*/
        if (getglobalLib("PDP_Slider_Thumbnail") == "vertical") {
            pdpThumbnail = new Swiper(".js__pdp-thumbnail-slider", {


                slidesPerView: 3,
                resistance: false,
                shortSwipes: false,
                clickable: true,
                grabCursor: true,
                observer: true,
                observeParents: true,
                draggable: true,

                breakpoints: {
                    980: {
                        slidesPerView: "auto",
                        direction: "horizontal",

                    },
                    981: {
                        slidesPerView: 6,
                        direction: "vertical",
                    },
                },

            });
        } else {
            pdpThumbnail = new Swiper(".js__pdp-thumbnail-slider", {
                resistance: false,
                shortSwipes: true,
                slidesPerView: 4,
                freeMode: true,
                watchSlidesProgress: true,
                clickable: true,
                grabCursor: true,
                mousewheel: true,
                direction: "horizontal",
                spaceBetween: 20,
                breakpoints: {
                    // when window width is >= 320px
                    0: {
                        slidesPerView: 2,
                        
                    },
                    360: {
                      slidesPerView: 2,
                      
                    },
                    // when window width is >= 480px
                    401: {
                      slidesPerView: 3,
                     
                    },
                    // when window width is >= 640px
                    601: {
                        slidesPerView: 4,
                    }
                  }



            });


        }

        pdpSlider = new Swiper(".js__pdp-slider", {
            slidesPerView: 1,
            grabCursor: false,
            mousewheel: false,
            clickable: false,
            resistance: false,
            shortSwipes: true,
            spaceBetween: 12,
            loop: false,
            pagination: {
            el: ".swiper-pagination-pdp",
             clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next-pdp",
                prevEl: ".swiper-button-prev-pdp",
            },
            thumbs: {
                swiper: pdpThumbnail,
            },
        });
        /*PDP tab section drop down change*/
        $(".js__pdp-tab-select").change(function() {
            $(".tab-content").removeClass("active");
            $(".tab-content").hide();
            $("#" + $(this).val()).show();
            $("#" + $(this).val()).addClass("active");
            $(".tab-link").removeClass("active");
            $("#tab-link-" + $(this).val()).addClass("active");
        })




        /* var pdpSlideCount = 0;
         $(document).on("click", ".swiper-button-next-pdp.swiper-button-disabled", function(e) {
                 var ariaLabel = $(".js__pdp-slider").find(".swiper-slide-active").attr("aria-label").split("/");
                 console.log(ariaLabel[0]);
                 console.log(ariaLabel[1]);
                 pdpSlideCount++;
                 if (pdpSlideCount == 2) {
                     if (ariaLabel[0].trim() == ariaLabel[1].trim()) {
                         pdpSlideCount = 0
                         pdpSlider.slideTo(0);
                     }
                 }

             })*/
        /* Manual click of thumbnail of slider*/
        $(document).on("click", ".pdp-thumbnail li", function(e) {
            var slideno = $(this).index();
            $(".pdp-thumbnail li").removeClass("active");
            $(this).addClass("active");
            $(".pdp-slider").slick("slickGoTo", slideno);

            setTimeout(function() {
                $(".pdp-thumbnail").slick("slickGoTo", slideno);
            }, 500);
            /* var slideno = $(this).index();
                     $(".pdp-thumbnail li").removeClass("active");
                     $(this).addClass("active");
                     console.log("slideno"+slideno);
               
                     $(".pdp-slider").slick("slickGoTo", slideno);*/

        });
        /*Write review click*/
        $(".js__write-review-btn").click(function() {

            $(".yotpo-new-review-btn").click();

        });

        /*View details*/
        $(document).on("click", ".js__pdp-view-details", function(e) {
            e.preventDefault();

            $(".tab-link").removeClass("active");
            $(".tab-head li:first-child").children(".tab-link").addClass("active");

            $(".tab-content").removeClass("active");
            $(".tab-content:first-child").addClass("active");
            $(".tab-content").hide();
            $(".tab-content:first-child").show();
            $(".js__pdp-tab-select").val($(".tab-head li:first-child").children(".tab-link").attr("data-attr"));

            setTimeout(function() {
                var target = $(".tab-content:first-child");
                $("html, body").animate({
                        scrollTop: target.offset().top - 350,
                    },
                    500
                );
            }, 500);
        });

        /*Review star click*/
        $(document).on("click", ".js__review-section", function(e) {
            e.preventDefault();

            $(".tab-link").removeClass("active");
            $("#tab-link-reviews").addClass("active");

            $(".tab-content").removeClass("active");
            $("#reviews").addClass("active");
            $(".tab-content").hide();
            $("#reviews").show();
            $(".js__pdp-tab-select").val("Reviews");

            setTimeout(function() {
                var target = $("#reviews");
                $("html, body").animate({
                        scrollTop: target.offset().top - 350,
                    },
                    500
                );
            }, 500);
        });

        /*Ninja price update */
        var targetNodes = $(".product__form");
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var bundleObersrver = new MutationObserver(mutationHandler);
        var obsConfig = {
            childList: true,
            characterData: true,
            attributes: true,
            subtree: true
        }; //--- Add a target node to the observer. Can only add one node at a time.

        targetNodes.each(function() {
            bundleObersrver.observe(this, obsConfig);
        });

        function mutationHandler(mutationRecords) {
            //loop through all the mutations that just occured
            mutationRecords.forEach(function(mutation) {
                if (mutation.type == "childList") {
                    //loop though the added nodes
                    mutation.addedNodes.forEach(function(added_node) {
                        // console.log($(".rc-container-wrapper").html())


                        if ($(".rc-container-wrapper").html() != undefined) {
                            //console.log("click recharge active");
                            $(".label-recharge-info").remove();
                            if ($(".js__subscribeText").html() != "") {
                                $(".rc-option__subsave").append("<span class='label-recharge-info'>" + $(".js__subscribeText").html() + "</span>")
                            }
                            if ($(".js__onetimeText").html() != "") {
                                $(".rc-option__onetime").append("<span class='label-recharge-info'>" + $(".js__onetimeText").html() + "</span>")
                            }

                            setTimeout(function() {
                                $(".rc-option--active").click();
                            }, 500);

                            bundleObersrver.disconnect();
                        }

                            setTimeout(function() {
                                console.log("sub price" + $(".rc_widget__price--subsave").html());
                                console.log("onetime price" + $(".rc_widget__price--onetime").html());
                                $(".rc-option__subsave").children(".rc_widget__option__label").children("s").remove();
                                $(".rc-option__subsave").children(".rc_widget__option__label").append(" <s>" + $(".rc_widget__price--onetime").html() + "</s>");
                                console.log("sub price 2" + $(".rc_widget__price--subsave").html());
                                $(".rc-option--active").click();
                            }, 500);




                    });
                }
            });
        }

        /* change frequency dropdown checking if   value not null then change button text */

        $(document).on("change", ".rc_widget__option__plans__dropdown", function(e) {
            $(".rc-option--active").click();
        });


        $(document).on("click", ".rc_widget__option", function(e) {
            //console.log("onetime ");

            var price = $(this).find(".rc-option__price").html();
            $(".pdp-add-to-cart-price").html(price);
            $(".js__pdp-variant-select li.active").click();



        });






        /*Slider working End*/
        /* Call page load functions */
        setTimeout(function() {
            setColorThumbImages();
        }, 1000);
        /* FORMATTING: Loop Through each color thumb and set the images for them through the product color library object */
        function setColorThumbImages() {
            if ($(".js-variant-color-swatch li")[0]) {
                $(".js-variant-color-swatch  li").each(function(index) {
                    var color = $(this).attr("data-color");
                    var colorValue = getVariantColor(color);
                    //$(this).children("div.color").css("background-color", colorValue);
                    if (colorValue == "") {
                        $(this).children("img").css("opacity", "0");
                    }
                    $(this).children("img").attr("src", colorValue);
                });
            }
        }
    })
    /*PENDING Get Variant Color*/
function getVariantColor(color) {
    try {
        var variantColorValue = "";
        $.each(prodColor, function(key, value) {
                if (color.toLowerCase() == value.title.toLowerCase()) {
                    variantColorValue = value.color;
                }
            })
            /* $.each(prodLib, function (key, value) {
               if (color.toLowerCase() == value.option1.toLowerCase()) {
                 variantColorValue = value.image;
               }
             });*/
        return variantColorValue;
    } catch {}
}
/* Color swatch click*/
$(document).ready(function($) {
    $(document).on("mouseenter", ".js__product-cart-color li", function() {
        var productID = $(this).attr("data-product-id");
        var variantImage = $(this).attr("data-image");
        var featuredImage = $(this).attr("data-featured_image");
        if (variantImage.indexOf("no-image-") == -1) {
            $(".js__product-image-" + productID).attr("src", variantImage);
        } else {
            $(".js__product-image-" + productID).attr("src", featuredImage);
        }
    })
    $(document).on("mouseleave", ".js__product-cart-color li", function() {
        var productID = $(this).attr("data-product-id");
        var featuredImage = $(".js__product-image-" + productID).attr("data-src");
        $(".js__product-image-" + productID).attr("src", featuredImage);

    })
})