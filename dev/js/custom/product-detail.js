var colorSelected = "";
var secondOptionVariantValue = "";
var thirdOptionVariantValue = "";
var selectedVariantID;
$(document).ready(function($) {
    /* if no varient then active class added in product image section*/
    if (prodLib.length == 0) {
        $(".js-pdp-media").addClass("active");
        $(".js__pdp-thumbnail-slider li:first-child").addClass("active");
    }
    var colorPosition = $("#colorPosition").val();
    var numberOfAvailableOptions = parseInt($("#optionSize").val());

    // on page load check the color position, and set 2nd and 3rd options values
    checkColorPosition();

    function checkColorPosition() {
        getColorPosition();
        /* 
    if only color and no other options
  */
        if (colorPosition != undefined && numberOfAvailableOptions == 1) {
            SoldOutUnavailableOnColorSwatches(colorSelected);
        }
    }


    /*Quantity Plus Minus*/
    $(".js-product-single__quantity .js-plus-minus-qty").click(function() {
        var type = $(this).attr("data-type");
        var productQuantity = $(".js-quantity-selector").val();
        if (type == "minus") {
            if (productQuantity > 1) {
                productQuantity--;
            }
        } else {
            productQuantity++;
        }
        $(".js-quantity-selector").val(productQuantity);
    });


    // On DD change, fire the form DD element and also run the soldoutColorSwatches function
    $(".js__pdp-variant-select").change(function() {
        var optionIndex = $(this).attr("data-option");
        var optionValue = $(this).val();
        $(
            "#product .product__form .options .option.option-" +
            optionIndex +
            " .label span"
        ).text(optionValue);

        // button  - Sold out and add to cart
        $("#product-select-option-" + optionIndex)
            .val(optionValue)
            .trigger("change");
        /*Checking if this is filter type then image filter code will work*/
        var OptionType = $(this).attr("data-type");
        var FilterType = $("#variantFilterType").val();

        if (OptionType == FilterType) {
            imageFilter(optionValue);
        }

        var selectedVariant = $("#product-select :selected").text().replace("- sold out!", "");
        $(".js__product-variant-selected").html(selectedVariant)

        $(".rc-option--active").click();


        //color swatch - sold out working
        SoldOutUnavailableOnColorSwatches(colorSelected);
    });

    $(document).on("click", ".js__pdp-variant-select li", function() {

        var optionIndex = $(this).attr("data-option");
        var optionValue = $(this).attr("data-value");
        var optionType = $(this).parent("ul").attr("data-type");
        $(this).parent("ul").children("li").removeClass("active");
        $(this).addClass("active");



        $("#product-select-option-" + optionIndex)
            .val(optionValue)
            .trigger("change");

        $("#product-select").change();


        /*Checking if this is filter type then image filter code will work*/
        try {
            var FilterType = $("#variantFilterType").val();

            if (optionType == FilterType) {
                imageFilter(optionValue);
            }
        } catch {

        }
        // button  - Sold out and add to cart

        try {
            SoldOutUnavailableOnColorSwatches(colorSelected);
        } catch {

        }
        //color swatch - sold out working






    });
    $(".js__pdp-variant-select li.active").click();


    $(".js__color-swatches").click(function() {

        // remove active class - from all the li's
        $('.js__color-swatches').removeClass('active');
        // add class on the one which is clicked
        $(this).addClass('active');
        var optionindex = $(this).data('option');
        var thevalue = $(this).data('value');

        //show the selected value
        $('.variant-option.option-' + optionindex + ' .label span').text(thevalue);

        // trigger change
        $('#product-select-option-' + optionindex).val(thevalue).trigger('change');

        /*Checking if this is filter type then image filter code will work*/
        var OptionType = $(this).parent("ul").attr("data-type");
        var FilterType = $("#variantFilterType").val();
        if (OptionType == FilterType) {
            imageFilter(thevalue);
        }


    });


    /*Run this function when image change on variant click*/
    function imageFilter(selectedValue) {

        /*Slick slider filter on swatch click*/
        var thumbColorSelected = selectedValue.replace(" ", "-");
        thumbColorSelected = thumbColorSelected.replace(/[^a-zA-Z0-9 ]/g, "-");
        thumbColorSelected = thumbColorSelected.replace(/ /g, "-");
        thumbColorSelected = thumbColorSelected.replace(/--/g, "-");
        thumbColorSelected = thumbColorSelected.replace(/---/g, "-");

        // $(".pdp-slider").slick("slickUnfilter");
        //   $(".js__pdp-thumbnail-slider").slick("slickUnfilter");
        $(".pdp-slider").find(".all").addClass(thumbColorSelected.toLowerCase());
        $(".js__pdp-thumbnail-slider").find(".all").addClass(thumbColorSelected.toLowerCase());
        //   $(".pdp-slider").slick("slickFilter", "." + thumbColorSelected.toLowerCase());
        //  $(".js__pdp-thumbnail-slider").slick( "slickFilter","." + thumbColorSelected.toLowerCase());
        $(".js__pdp-thumbnail-slider .swiper-slide").removeClass("active");
        //$(".js__pdp-thumbnail-slider").slick("refresh");


        $(".pdp-slider").find(".slide").addClass("remove-slide").removeClass("swiper-slide").removeAttr("aria-label");
        $(".js__pdp-thumbnail-slider").find(".slide").addClass("remove-slide").removeClass("swiper-slide").removeAttr("aria-label");
        $(".pdp-slider").find(".slide").children(".image-section").removeAttr("data-fancybox");
        $(".pdp-slider").find("." + thumbColorSelected.toLowerCase()).removeClass("remove-slide").addClass("swiper-slide");
        $(".js__pdp-thumbnail-slider").find("." + thumbColorSelected.toLowerCase()).removeClass("remove-slide").addClass("swiper-slide");
        $(".pdp-slider").find("." + thumbColorSelected.toLowerCase()).children(".image-section").attr("data-fancybox", "product");



        pdpThumbnail.destroy();
        pdpSlider.destroy();

        if (getglobalLib("PDP_Slider_Thumbnail") == "vertical") {
            pdpThumbnail = new Swiper(".js__pdp-thumbnail-slider", {
                slidesPerView: 3,
                resistance: false,
                shortSwipes: false,
                freeMode: true,
                watchSlidesProgress: true,
                clickable: true,
                grabCursor: true,
                observer: true,
                observeParents: true,
                draggable: true

                ,

                 

            });

        } else {
            pdpThumbnail = new Swiper(".js__pdp-thumbnail-slider", {
                resistance: false,
                shortSwipes: true,
                loop: true,
                slidesPerView: 'auto',
                freeMode: true,
                watchSlidesProgress: true,
                clickable: true,
                grabCursor: true,
                mousewheel: true,
                spaceBetween: 20,
                breakpoints: {
                    // when window width is >= 320px
                    360: {
                        slidesPerView: 2,
                        
                      },
                      // when window width is >= 480px
                      480: {
                        slidesPerView: 3,
                       
                      },
                      // when window width is >= 640px
                      601: {
                          slidesPerView: 'auto',
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
            loop: false,
            spaceBetween: 12,
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



        /*Selected first variant image in slider which have no all class*/
        var boolVariantFirstImage = false;
        $(".js__pdp-thumbnail-slider  li").each(function() {
                if (!$(this).hasClass("all")) {
                    if (boolVariantFirstImage == false) {


                        $(this).click();
                        $(this).addClass("active");


                        boolVariantFirstImage = true;

                    }
                }
            })
            /*When we dont have any variant image*/

        if (boolVariantFirstImage == false) {
            $(".js__pdp-thumbnail-slider li:first-child").addClass("active");
            $(".js__pdp-thumbnail-slider li:first-child").click();
        }
        colorSelected = selectedValue;
    }
    // main sold out and unavailable working
    function SoldOutUnavailableOnColorSwatches(colorSelected) {
        getColorPosition();

        // Remove out of stock and unavailable from color swatches
        $(".js__color-swatches").removeClass("out-of-stock");
        $(".js__color-swatches").removeClass("unavailable");

        var colorLength = $(".js__color-swatches").length;
        var colorCount = 1;
        /*
        Loop Through each input radio for the color
        */

        // we are using color swatch working for other options when they are radio buttons
        $(".js__color-swatches").each(function(index) {
            var colorValue = $(this).attr("data-value");
            var checkColorOptionExists = false;
            /* 
             Loop through product library object for variant 
             and if variant select matches and quantity = 0 then show out of stock message
             */

            /*
            PENDING - Merge - ProdLib Each Function
            */

            $.each(prodLib, function(key, value) {
                let itemQuantity = value.quantity;
                let itemAvailable = value.available;
                var prodColorOptionValue = "";
                var prodSecondOptionValue = "";
                var prodThirdOptionValue = "";
                if (colorPosition == "1") {
                    prodColorOptionValue = value.option1;
                    prodSecondOptionValue = value.option2;
                    prodThirdOptionValue = value.option3;
                }
                if (colorPosition == "2") {
                    prodColorOptionValue = value.option2;
                    prodSecondOptionValue = value.option1;
                    prodThirdOptionValue = value.option3;
                }
                if (colorPosition == "3") {
                    prodColorOptionValue = value.option3;
                    prodSecondOptionValue = value.option1;
                    prodThirdOptionValue = value.option2;
                }
                var colorOption = prodColorOptionValue.toLowerCase();
                colorOption = colorOption.replace(/[^a-zA-Z0-9 ]/g, "-");

                colorOption = colorOption.replace(/ /g, "-");
                colorOption = colorOption.replace(/--/g, "-");
                colorOption = colorOption.replace(/---/g, "-");
                /*Checking each color  size quantity and which have 0 then added out of stock class*/
                if (numberOfAvailableOptions == 3) {
                    /*three matching option checking quantity if 0 then showing out of stock */
                    if (
                        secondOptionVariantValue.toLowerCase() ==
                        prodSecondOptionValue.toLowerCase() &&
                        thirdOptionVariantValue.toLowerCase() ==
                        prodThirdOptionValue.toLowerCase()
                    ) {
                        {
                            //check if quantity>1 then set the color swatch - Out of stock
                            setColorSwatchOutofStock(
                                colorOption,
                                itemQuantity,
                                itemAvailable
                            );
                        }
                    }
                } else if (numberOfAvailableOptions == 2) {
                    /*two matching option checking quantity if 0 then showing out of stock */
                    if (
                        prodSecondOptionValue.toLowerCase() ==
                        secondOptionVariantValue.toLowerCase()
                    ) {
                        {
                            //check if quantity>1 then set the color swatch - Out of stock
                            setColorSwatchOutofStock(
                                colorOption,
                                itemQuantity,
                                itemAvailable
                            );
                        }
                    }
                } else {
                    //check if quantity>1 then set the color swatch - Out of stock
                    setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
                }

                if (prodColorOptionValue == colorValue) {
                    if (numberOfAvailableOptions == 3) {
                        if (
                            prodSecondOptionValue.toLowerCase() ==
                            secondOptionVariantValue.toLowerCase() &&
                            prodThirdOptionValue.toLowerCase() ==
                            thirdOptionVariantValue.toLowerCase()
                        ) {
                            checkColorOptionExists = true;
                        }
                    } else if (numberOfAvailableOptions == 2) {
                        if (
                            prodSecondOptionValue.toLowerCase() ==
                            secondOptionVariantValue.toLowerCase()
                        ) {
                            checkColorOptionExists = true;
                        }
                    } else {
                        checkColorOptionExists = true;
                    }
                }




            });

            if (checkColorOptionExists == false) {
                var colorOption = colorValue;
                colorOption = colorOption.replace(/[^a-zA-Z0-9 ]/g, "-");
                colorOption = colorOption.replace(/ /g, "-");
                colorOption = colorOption.replace(/--/g, "-");
                colorOption = colorOption.replace(/---/g, "-");
                colorOption = colorOption.toLowerCase();
                $(
                    ".js__color-swatches[data-type-value=" + colorOption + "]"
                ).removeClass("out-of-stock");
                $(".js__color-swatches[data-type-value=" + colorOption + "]").addClass(
                    "unavailable"
                );

                if (
                    $(
                        ".js__color-swatches[data-type-value=" + colorOption + "]"
                    ).hasClass("active")
                ) {
                    var nextColor = colorCount + 1;
                    if (colorCount < colorLength) {
                        $(".js__color-swatches:nth-child(" + nextColor + ")").click();
                    } else {
                        $(".js__color-swatches:nth-child(1)").click();
                    }
                }
            }
            colorCount++;
        });
    }

    function getColorPosition() {
        if (colorPosition != undefined && numberOfAvailableOptions > 1) {
            if (colorPosition == "1") {
                secondOptionVariantValue = $(".js__pdp-variant-select1").val();
                if (numberOfAvailableOptions > 2) {
                    thirdOptionVariantValue = $(".js__pdp-variant-select2").val();
                }
            }
            if (colorPosition == "2") {
                secondOptionVariantValue = $(".js__pdp-variant-select0").val();
                if (numberOfAvailableOptions > 2) {
                    thirdOptionVariantValue = $(".js__pdp-variant-select2").val();
                }
            }
            if (colorPosition == "3") {
                secondOptionVariantValue = $(".js__pdp-variant-select0").val();
                if (numberOfAvailableOptions > 2) {
                    thirdOptionVariantValue = $(".js__pdp-variant-select1").val();
                }
            }
        } else {
            secondOptionVariantValue = $(".js__pdp-variant-select0").val();
            if (numberOfAvailableOptions > 1) {
                thirdOptionVariantValue = $(".js__pdp-variant-select1").val();
            }
        }
        try {
            colorSelected = colorSelected.toLowerCase();
        } catch {}
    }

    function setColorSwatchOutofStock(prodColor, prodQuantity, prodAvailability) {
        if (prodQuantity < 1 && prodAvailability == "false") {
            $(".js__color-swatches[data-type-value=" + prodColor + "]").addClass(
                "out-of-stock"
            );
        }
    }

    $(window).scroll(function() {


        var sticky = $(".product__media-outer"),
            scroll = $(window).scrollTop();
        var pos = sticky.height();
        if (scroll >= 768 & scroll <= (pos - 690)) {
            sticky.addClass("fixed");
            // $(".main-content").addClass("active");
        } else {
            sticky.removeClass("fixed");
            // $(".main-content").removeClass("active");
        }
    });

    // show para on click read More button

    $(".js__read-more_btn").click(function() {

        $(".js__read-less-content").addClass("hide");
        $(".js__read-more-content").removeClass("hide");



    });
    $(".js__read-less_btn").click(function() {
        $(".js__read-less-content").removeClass("hide");
        $(".js__read-more-content").addClass("hide");


    });

});