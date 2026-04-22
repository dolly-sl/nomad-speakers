// tweaks these below variable if you want to show subtotal and discount
var showCartSubTotalDiscountSection = true;
var showEmptyCartIcon = false;
var showCartCountInTopNav = true;
var showProgressBar = true;
var showVendorOnCartPage = false;
// Fixed variables
var lineItemComparePrice;
var cartObject;
var cartCountEmptyValue = "0";
var boxID = "BuilderID";
var cartExtraInfo;
//extra classes for the elements
var removeExtraClass = "btn-border-black-animate";
// recharge 2020
var frequency = "";
var recurringchecked = false;
var frequency_unit = "";
//SVG icons
var removeMiniCartTextOrIcon =
    '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">    <path fill-rule="evenodd" clip-rule="evenodd" d="m5.815 7.586 4.188 4.188 1.523-1.523-4.188-4.188 4.189-4.189L10.004.351 5.814 4.54 1.628.352.104 1.875l4.188 4.188-4.188 4.188 1.523 1.523 4.188-4.188z" fill="#1A1B1B"/> </svg>';


var minusIcon = '';
var plusIcon = '';
$(document).ready(function($) {
    reloadAjaxCartItemUsingCartAjaxObject();
    progressBar();
    quickCartTotal();
    //	window.location.href = "https://checkout.rechargeapps.com/r/checkout?myshopify_domain=XXX.myshopify.com";
    //window.location = '/checkout';

});
/*
EVENTS
1. Update quantity
2. remove item from cart
3. reload ajax cart
4. quickCartTotal
5. cart.requestComplete
*/
//QUANTITY UPDATE
function updateCartQuantity(cartThis) {
    var id = $(cartThis).attr("data-variant-id");
    var quantity = $("#updates_" + id).val();
    var type = $(cartThis).attr("date-type");
    var newQuantity = parseInt(quantity);
    if (type == "plus") {
        newQuantity = newQuantity + 1;
    } else {
        if (newQuantity > 0) {
            newQuantity = newQuantity - 1;
        }
    }
    var formData = {
        updates: {}
    };
    formData.updates[id] = newQuantity;
    // Perform the AJAX request to update the cart
    $.ajax({
        type: "POST",
        url: "/cart/update.js",
        data: formData,
        dataType: "json",
        success: function(cart) {
            // Perform any additional tasks after removing items
            $("#updates_" + id).val(newQuantity);
            getCartData(cart);
        },
        error: function(error) {
            // Handle error if the request fails
            console.error("Error updating items from the cart:", error);
        }
    });
}
/* If you need extra information like collection title, metafield etc then use this function */
function reloadAjaxCartItemUsingCartAjaxObject(data) {
    //   cartInfo(data);
    $.ajax({
        type: "GET",
        url: "/cart?view=alternate.json",
        success: function(response) {
            //extra information against the cart like collection title metafield, product title metafield, tags
            cartExtraInfo = $.parseJSON(response);
            cartInfo(data);
            // Populate addon products
            populateAddonProducts(cartExtraInfo);
        },
        error: function(status) {
            console.warn("ERROR", status);
            cartInfo(data);
        },
    });
}
// Populate addon products in cart drawer and cart page
function populateAddonProducts(cartExtraInfo) {
    if (!cartExtraInfo || !cartExtraInfo.addons || cartExtraInfo.addons.length === 0) {
        $(".js__addon-products-wrapper").html("");
        $(".js__cart-page-addon-wrapper").html("");
        $(".js__cart-page-addon-product").hide();
        $(".js__cart-minicart-addon-product").hide();
        return;
    }
    
    // Get array of variant IDs already in cart - convert to string for consistency
    var cartVariantIds = [];
    if (cartExtraInfo.items && cartExtraInfo.items.length > 0) {
        $.each(cartExtraInfo.items, function(index, item) {
            if (item.id) {
                cartVariantIds.push(String(item.id));
            }
        });
    }
    
    var addonHTML = ""; // For cart drawer (swiper format)
    var cartPageAddonHTML = ""; // For cart page (flex-wrap format)
    var processedAddonIds = []; // Track addon IDs already processed to avoid duplicates
    
    $.each(cartExtraInfo.addons, function(index, addon) {
        // Skip if this addon is already in the cart - convert to string for consistency
        var addonIdStr = String(addon.id);
        if ($.inArray(addonIdStr, cartVariantIds) !== -1) {
            return true; // continue to next iteration
        }
        
        // Skip if this addon ID has already been processed in this iteration
        if ($.inArray(addonIdStr, processedAddonIds) !== -1) {
            return true; // continue to next iteration
        }
        
        // Mark this addon as processed
        processedAddonIds.push(addonIdStr);
        
        var price = formatter.format(addon.variant_price / 100);
        
        // HTML for cart drawer (swiper-slide format)
        var addonHTMLItem = '<li class="swiper-slide">';
        addonHTMLItem += '<div class="image-section">';
        addonHTMLItem += '<img src="' + addon.productImage + '" alt="' + addon.product_title + '">';
        addonHTMLItem += '</div>';
        addonHTMLItem += '<div class="content">';
        addonHTMLItem += '<span class="name">' + addon.product_title + '</span>';
        addonHTMLItem += '<span class="price">' + price + '</span>';
        addonHTMLItem += '<a href="javascript:;" class="btn--primary js__addon-add-to-cart" data-attr-variantid="' + addon.id + '">Add</a>';
        addonHTMLItem += '</div>';
        addonHTMLItem += '</li>';
        
        // HTML for cart page (flex format)
        var cartPageItem = '<li class="flex">';
        cartPageItem += '<div class="image-section">';
        cartPageItem += '<img src="' + addon.productImage + '" alt="' + addon.product_title + '">';
        cartPageItem += '</div>';
        cartPageItem += '<div class="content">';
        cartPageItem += '<span class="name">' + addon.product_title + '</span>';
        cartPageItem += '<span class="price">' + price + '</span>';
        cartPageItem += '<a href="javascript:;" class="btn--primary js__addon-add-to-cart" data-attr-variantid="' + addon.id + '">Add</a>';
        cartPageItem += '</div>';
        cartPageItem += '</li>';
        
        addonHTML += addonHTMLItem;
        cartPageAddonHTML += cartPageItem;
    });
    
    // Populate cart drawer
    $(".js__addon-products-wrapper").html(addonHTML);
   
    // Populate cart page
    if (cartPageAddonHTML !== "") {
        $(".js__cart-page-addon-wrapper").html(cartPageAddonHTML);
        $(".js__cart-page-addon-product").show();
        $(".js__cart-minicart-addon-product").show();
    } else {
        $(".js__cart-page-addon-wrapper").html("");
        $(".js__cart-page-addon-product").hide();
        $(".js__cart-minicart-addon-product").hide();
    }
    
    // Initialize the swiper if it exists (for cart drawer)
    if (typeof Swiper !== 'undefined') {
         /* Hero Banner SLider */
  var addonProducts = new Swiper(".js_addon-products-slider", {
    slidesPerView: 1,

    resistance: false,
 autoHeight: true,
    loop: false,
    // autoplay: {
    //     delay: 10000,
    // },
    // Navigation arrows
    pagination: {
      el: ".swiper-pagination-addon-product",
      clickable: true,
    },
  });
    }
}
//RELOAD AJAX CART
function cartInfo(data) {
    var lineCount = 1;
    var cartObject;
    if (data == undefined) {
        cartObject = CartJS.cart;
    } else {
        cartObject = data;
        quickCartTotal(data);
    }
    $(".js__ajax-products-bind").html("");
    $(".js__ajax-products-bind").removeClass("empty");
    $(".cart-list").html("");
    if (cartObject.items.length == 0) {
        $(".empty-cart-section").show();
        $(".template-cart").find(".four-column-reviews").hide();
        $(".js__show-cart-items-section").hide();
        $(".js__top-cart-form-actions").hide();
        $(".js__ajax-products-bind").html("<li>Your Cart is Empty</li>");
        $(".js__ajax-products-bind").addClass("empty");
    } else {
        $(".js__top-cart-form-actions").show();
        $(cartObject.items).each(function() {
            var imageURL = this.featured_image.url;
            //imageURL = imageURL[0] + "." + imageURL[1] + '_450x450' + "." + imageURL[2];
            var imageAlt = this.featured_image.alt;
            var itemPrice = this.original_price;
            var itemLinePriceTotal = this.line_price;
            var handle = this.handle;
            var itemID = this.id;
            var itemPriceAfterDiscount = this.discounted_price;
            var comparePrice = "";
            let disabled = "";
            let finalLineItemPrice = this.final_line_price;
            let cartBundleBoxID = "";
            let boolPromoOffer = false;
            let productTitle = this.product_title;
            let url = this.url;
            let itemProperties = "";
            let itemPropertiesElement = "";
            var boolItemBoxType = false;
            var hideElementClass = "";
            var readonly = "";
            var justifyCenter = "";
            let sellingPlayInformation = "";

            if (this.selling_plan_allocation != undefined) {
                sellingPlayInformation = this.selling_plan_allocation.selling_plan.name;
            }
            if (this.properties != null) {
                itemProperties = this.properties;
                if (Object.keys(itemProperties).length > 0) {
                    $.each(itemProperties, function(key, value) {
                        /* If box ID exists, then remove quantity + -  working */
                        if (key == boxID) {
                            cartBundleBoxID = value;
                        }
                        if (key == "_ProductUrl") {
                            url = value;
                        }
                        if (key == "_promoOffer") {
                            boolPromoOffer = true;
                        }
                    });
                    /* Checking the Box ID for the builder */
                    itemPropertiesElement = "<ul>";
                    $.each(itemProperties, function(key, value) {
                        /* If box ID exists, then remove quantity + -  working */
                        if (key == boxID || key == "_FreeGift") {
                            hideElementClass = "hide";
                            readonly = "readonly='readonly'";
                            boolItemBoxType = true;
                            justifyCenter = "justify-center ";
                            url = "javascript:;";
                        }
                        if (key.indexOf("_") > -1) {} else {
                            if (key != boxID) {
                                itemPropertiesElement +=
                                    "<li class='flex'><span>" +
                                    key +
                                    ": </span><span style='padding-left: 5px'>" +
                                    value +
                                    "</span>";
                                itemPropertiesElement += "</li>";
                            } else {
                                itemPropertiesElement +=
                                    "<li class='flex'><span>" +
                                    key +
                                    ": </span><span style='padding-left: 5px'>" +
                                    value +
                                    "</span>";
                                itemPropertiesElement += "</li>";
                            }
                        }
                        // Recharge - when subscription is via properties for older recharge version before November 2020
                        recharge2020(key, value);
                    });
                    // Recharge 2020, check if it's a subscription, then bind the value in the UL
                    if (recurringchecked) {
                        itemPropertiesElement +=
                            "<li class='flex'><span>Recurring Delivery every " +
                            frequency +
                            " " +
                            frequency_unit +
                            ". Change or cancel anytime</span>";
                        itemPropertiesElement += "</li>";
                    }
                    itemPropertiesElement += "</ul>";
                } else {
                    //itemPropertiesElement = "";
                }
            }

            var rechargeSelected = this.selling_plan_allocation;

            var rechargeDropdown = "";
            /* Loop through cartExtraInformation section */
            $(cartExtraInfo.items).each(function(key, value) {
                if (value.id == itemID) {
                    if (value.comparePrice != null) {
                        comparePrice = value.comparePrice;
                    }
                    if (value.productImage != null) {
                        imageURL = value.productImage
                    }
                    var Quantity = value.quantity;


                    if (value.product_recharge == "True") {


                        if (rechargeSelected == undefined) {
                            rechargeDropdown = "<select id='planID" + lineCount + "' data-qty=" + Quantity + " class='" + hideElementClass + " custom-dropdown-select js__cart-plan'><option value=" + value.product_rechargeID + ">" + value.product_rechargeName + "</option><option value='One Time Purchase' selected>One Time Purchase</option></select>";

                        } else {


                            rechargeDropdown = "<select id='planID" + lineCount + "' data-qty=" + this.quantity + " class='" + hideElementClass + " custom-dropdown-select js__cart-plan'><option value=" + value.product_rechargeID + " selected>" + value.product_rechargeName + "</option><option value='One Time Purchase'>One Time Purchase</option></select>";

                        }

                    }



                    productTitle =
                        "<h5 class'h6'> <a href='" +
                        url +
                        "' id='product-card-" +
                        this.id +
                        "' tabindex='0'>" +
                        value.product_title.split("with")[0] +
                        " </a></h5>";
                }
            });
            /* get compare price using cartLib object */
            // if (typeof cartLib !== "undefined") {
            //           $.each(cartLib, function(key, value) {
            //               //console.log(value);
            //               if (value["id"] == itemID) {
            //                   comparePrice = value["comparePrice"];
            //               }
            //           });
            //       }
            /* FORMATTED PRICING */
            var formattedcomparePrice = formatter.format(comparePrice / 100);
            var comparePriceHtml = "";
            if (comparePrice > parseFloat(itemPrice)) {
                comparePriceHtml = "<s>" + formattedcomparePrice + "</s>";
            }
            // total compared price for the item with quantity
            var totalListItemComparePrice = formatter.format((comparePrice * this.quantity) / 100);
            // item original price
            var formattedItemPrice = formatter.format(itemPrice / 100);
            // line price
            var formattedItemLinePriceTotal = formatter.format(itemLinePriceTotal / 100);
            //final line item price
            var formattedFinalLineItemPrice = formatter.format(finalLineItemPrice / 100);
            //Price after discount
            let showPrice = "";
            let itemPriceAfterDiscountStatus = false;
            let discountedMessage = "";
            let discountedMessageElement = "";
            if (this.discounts != null) {
                discountedMessage = this.discounts;
                if (Object.keys(discountedMessage).length > 0) {
                    //console.log("DISCOUNT EXISTS");
                    discountedMessageElement = "<span class='discountedMessage'>";
                    $.each(discountedMessage, function(key, value) {
                        discountedMessageElement += value.title;
                    });
                    discountedMessageElement += "</span>";
                }
            }
            var formattedItemPriceAfterDiscount = formatter.format(itemPriceAfterDiscount / 100);
            // if itemPriceAfterDiscount > 0 then set the status to true so you can interchange the values
            if (this.discounts.length > 0) {
                itemPriceAfterDiscountStatus = true;
            }
            // if it's true; then show the compared price as the main price this.price and main price as discounted price
            if (itemPriceAfterDiscountStatus) {
                //comparePriceHtml
                showPrice =
                    '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0"><s>' +
                    formattedItemPrice +
                    '</s><span class="price" data-key="' +
                    itemID +
                    '">' +
                    formattedItemPriceAfterDiscount +
                    "</span><span class='forMiniCart'>" +
                    formattedFinalLineItemPrice +
                    "</span></span>" +
                    discountedMessageElement;
            } else {
                showPrice =
                    '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0">' +
                    comparePriceHtml +
                    '<span class="price" data-key="' +
                    itemID +
                    '">' +
                    formattedItemPrice +
                    "</span><span class='forMiniCart'>" +
                    formattedFinalLineItemPrice +
                    "</span></span>";
            }
            /* check if variantTitle is NULL, then don't show variant */
            var variantTitle = this.variant_title;
            if (variantTitle == null) {
                variantTitle = "";
            }
            var variantData = "";
            $.each(this.options_with_values, function(key, value) {
                //console.log("key" + key);console.log("value" + value["name"]);console.log("value" + value["value"]);
                variantData +=
                    "<li><span>" + value["name"] + ": " + value["value"].split("with")[0] + "</span></li>";
            });
            /* CUSTOM - if the product title contains "bag",  then disabled the quantity element
                To be applied for all the products with BoxID and Promo Offer
                */
            if (
                (this.product_title.toLowerCase().indexOf("bag") >= 0 &&
                    cartBundleBoxID != "") ||
                (this.product_title.toLowerCase().indexOf("bag") >= 0 && boolPromoOffer)
            ) {
                //if you want to hide the quantity + - then enable the class below
                // hideElementClass="hide"
                justifyCenter = "justify-center ";
                readonly = "readonly='readonly'";
                disabled = "disabled ";
            }
            /* 
       LINE ITEM FOR THE MINI CART
        */
            // remove anchor
           
            //quantity element
            var quantityElement =
                '<div class="cart-quantity-outer ' +
                disabled +
                justifyCenter +
                '"> <a  tabindex="0"  class="minus-qty ' +
                hideElementClass +
                '  font-zero" date-type="minus" onclick="updateCartQuantity(this)"   data-variant-id="' +
                itemID +
                '">' +
                minusIcon +
                '</a> <input aria-label="Quantity"  tabindex="-1"  data-limit="' +
                boolItemBoxType +
                '"  ' +
                readonly +
                '   onkeydown="return isNumeric(event);" type="text"  data-attr-raw-variant-quantity="94" data-cart-line-count="' +
                lineCount +
                '" class="cart__quantity-selector js__cart__quantity-selector" name="updates[]" id="updates_' +
                itemID +
                '" value="' +
                this.quantity +
                '" maxlength="3" size="3"> <a  tabindex="0"  class="plus-qty ' +
                hideElementClass +
                '  font-zero" date-type="plus" onclick="updateCartQuantity(this)"     data-variant-id="' +
                itemID +
                '">' +
                plusIcon +
                "</a> </div>";
            //vendor element
            let vendorElement =
                '<span class="subheading uppercase">' + this.vendor + "</span>";
            var lineItem;
            lineItem =
                '<li class="flex-wrap js__cart-table-item-row" data-cart-line-count=' +
                lineCount +
                ' data-handle="' +
                handle +
                '" data-variant-id=' +
                itemID +
                '><div class="image-section"> <a href="' +
                url +
                '"><img alt="' +
                imageAlt +
                '" src="' +
                imageURL +
                '""> </a> </div>';
            lineItem +=
                '<div class="content"><a class="remove" data-cart-line-count="' +
                    lineCount +
                    '" data-variant-id="' +
                    itemID +
                    '" href="javascript:;">remove</a><div class="title-section">' +
                productTitle +
                 
                "";
            if (sellingPlayInformation != "") {
                lineItem += '<p class="capitalize">' + sellingPlayInformation + "</p>";
            }
            if (itemPropertiesElement != "") {
                lineItem += '<p class="capitalize">' + itemPropertiesElement + "</p>";
            }
            if (variantTitle != "") {
                lineItem += "<ul>" + variantData + "</ul>";
            }
            lineItem +=
                showPrice +
                '</div><div class="flex-space-between"><div class="quantity-remove-outer">' +
                quantityElement+'</div>';
            lineItem +=
                "<span class='price'>" +
                formattedItemPriceAfterDiscount +
                comparePriceHtml +
                "</span></div>" + rechargeDropdown + "</div>";
            lineItem += "</li>";
            /* Bind the line item to the list */
            $(".js__ajax-products-bind").append(lineItem);
            /*******LINE ITEM FOR THE CART PAGE********/
            if ($(".cart-list")[0]) {
                var cartLineItem = "";
                cartLineItem =
                    '<div class="cart-list__items cart-table-body js__cart-table-item-row flex" data-cart-line-count="' +
                    lineCount +
                    '" data-attr-compare-price="" data-variant-id="' +
                    itemID +
                    '"><div class="cart-list__items__columns"><a class="image-section " href="' +
                url +
                '"><img class="img-responsive img-thumbnail item-image" src="' +
                    imageURL +
                    '" alt="' +
                    imageAlt +
                    '"></a> <div class="content">';
                // show vendor on cart page
                if (showVendorOnCartPage) {
                    cartLineItem += vendorElement;
                }
                cartLineItem += productTitle;
                cartLineItem += '<div class="cart-list__variant-properties">';
                if (sellingPlayInformation != "") {
                    cartLineItem +=
                        '<span class="capitalize">' + sellingPlayInformation + "</span>";
                }
                if (itemPropertiesElement != "") {
                    cartLineItem +=
                        '<span class="capitalize">' + itemPropertiesElement + "</span>";
                }
                if (variantTitle != "") {
                    cartLineItem += "<ul>" + variantData + "</ul>";
                }
                
                cartLineItem +=showPrice+ "</div>";
                cartLineItem +=
                    '</div>  </div> ';

                 cartLineItem +=
                    '<div class="cart-list__items__columns price" > ' +
                    showPrice;
                // ** Remove action is added here too
                cartLineItem += "</div>";    
                cartLineItem +=
                    '<div class="cart-list__items__columns quantity" data-variant-id="' +
                    itemID +
                    '"> ' +
                    quantityElement +
                    '   <span class="js__out-of-stock"></span>';
                // ** Remove action is added here too
                cartLineItem += "</div><div class='cart-list__items__columns remove ' ><a class='remove' data-cart-line-count='" +
                    lineCount +
                    "' data-variant-id='" +
                    itemID +
                    "' href='javascript:;'>remove</a></div>";
                cartLineItem +=
                    '<div class="cart-list__items__columns total-price " data-head="Total"> <span class="price-wrapper js__set-line-item-price" data-attr-price="' +
                    itemPrice +
                    '" data-attr-compare-price=' +
                    totalListItemComparePrice +
                    '><s class="hide">' +
                    totalListItemComparePrice +
                    '</s><span class="price" data-key="' +
                    itemID +
                    '">' +
                    formattedItemLinePriceTotal +
                    "</span> </span>";
                // ** Remove element is added here too
                cartCountEmptyValue += " </div></div>";
                $(".cart-list").append(cartLineItem);
            }
            lineCount++;
        });
    }

}
//CALCULATE TOTAL OF THE CART
function quickCartTotal(data) {
    if (data == undefined) {
        cartObject = CartJS.cart;
    } else {
        cartObject = data;
    }
    let total = cartObject.items_subtotal_price;
    total = total / 100;
    total = formatter.format(total);
    
     $(".js__cart-sub-total").html(total);
    $(".js__cart-total").html(total);
    $(".js__ajax-cart-total").html("" + total);
    $(".js__ajax-cart-total").show();
    $(".js__ajax-cart-count").html(cartObject.item_count);
    $(".js__top-cart-form-actions").show();
    $(".js__cart-expand ").removeClass("empty-cart");
}
/* REMOVE */
var savedItemPropertyBoxID = "";
$(document).on("click", ".remove", function() {
    var variantID = parseInt($(this).attr("data-variant-id"));
    var clickedLineItemCount = parseInt($(this).attr("data-cart-line-count"));
    var currentLoopItemCount = 1;
    // console.log(variantID);
    var boxID = "BuilderID";
    var itemsToRemove = [];
    var formData = {
        updates: {}
    };
    $.getJSON("/cart.js", function(cart) {
        var savedItemPropertyBoxID = "";
        // console.log(cart.items.length);
        // Find the item with the matching variantID and save its BoxID property
        for (var i = 0; i < cart.items.length; i++) {
            if (clickedLineItemCount === currentLoopItemCount) {

                var currentItem = cart.items[i];
                if (currentItem.variant_id === variantID) {
                    // console.log(currentItem);
                    // console.log(currentItem.variant_id);
                    // console.log("variant ID matches");
                    // console.log(currentItem.properties);
                    // console.log(currentItem.properties[boxID]);
                    if (currentItem.properties && currentItem.properties[boxID]) {
                        savedItemPropertyBoxID = currentItem.properties[boxID];
                        // console.log("Saved Item Property Box ID:", savedItemPropertyBoxID);
                        break;
                    } else {
                        // it doesn't has the BoxID, then delete the particular LineItem
                        // console.log("Current Line Item - With no BoxID")
                        itemsToRemove.push(currentItem.variant_id);
                    }
                }
            }
            currentLoopItemCount = currentLoopItemCount + 1;
        }
        // Loop through cart items to find items with matching BoxID
        for (var j = 0; j < cart.items.length; j++) {
            var currentItem = cart.items[j];
            if (currentItem.properties && currentItem.properties[boxID] === savedItemPropertyBoxID) {
                itemsToRemove.push(currentItem.variant_id);
                //console.log("Item Variant ID to Remove:", currentItem.variant_id);
            }
        }
        // console.log(itemsToRemove);
        // console.log(itemsToRemove.length);
        // Call the function to remove items from the cart
        removeItemsFromCart(itemsToRemove);
        // Remove items from the cart
    });
});


    // Function to remove items from the cart
function removeItemsFromCart(itemsToRemove) {
    var formData = {
        updates: {}
    };
    // Populate the formData with variant IDs to remove
    for (var k = 0; k < itemsToRemove.length; k++) {
        var variantID = itemsToRemove[k];
        formData.updates[variantID] = 0;
    }
    $.ajax({
        type: "POST",
        url: "/cart/update.js",
        data: formData,
        dataType: "json",
        success: function(cart) {
            getCartData(cart);
        },
        error: function(error) {
            // Handle error if the request fails
            console.error("Error removing items from the cart:", error);
        }
    });
}





function getCartData() {
    $.getJSON("/cart.js", function(cart) {
        cartInfo(cart);
        progressBar();
        
        // Reload addon products to refresh the list after cart updates
        $.ajax({
            type: "GET",
            url: "/cart?view=alternate.json",
            success: function(response) {
                cartExtraInfo = $.parseJSON(response);
                populateAddonProducts(cartExtraInfo);
            },
            error: function(status) {
                console.warn("ERROR fetching addon products", status);
            },
        });
        
        setTimeout(function() {
            addons();
        }, 1000);
    });
}
/*
PROGRESS BAR
*/
function progressBar() {
    var totalAmount = 0;
    var shippingGrandTotal = 0;
    $(".js__cart-shipping").addClass("hide");
    if (showProgressBar) {
        fetch("/cart.js", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => res.json())
            .then((data) => {
                totalAmount = data.total_price / 100;
                var freeShippingAmount = parseFloat(
                    $(".js__free-shipping-limit").html()
                );

                
                $(".js__free-shipping-amount").html(formatter.format(freeShippingAmount))
                
                

                
               
                if (totalAmount => freeShippingAmount) {
                   $(".js__cart-shipping").removeClass("hide");
                }
               

            });
    }
}


/*
ADDONS
NOTE:: CONFUSING CODE FOR THE ADDONS - WILL NEED TO CLEAN IT A BIT
1. Try to get all the addon handles for the items which are in the cart
2. Create an array for item>addon
3. Loop through all the cart items and addon
4. CHECK - if addon is already there in the list, then the same 2nd addon should not be visible
*/
function cartAddItemAddon(addonSelectedVariantID, addonQuantity) {
    CartJS.addItem(
        addonSelectedVariantID,
        addonQuantity, {}, {
            success: function(data, textStatus, jqXHR) {
                //console.log("success");
                /* Pending - Remove the selected addon when add to cart is clicked */
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log("error");
            },
        }
    );
}

function addons() {
    //console.log("addons");
    /*Hide repeating addons*/
    var cartAddons = "";
    $(".js__top-cart-addons li").each(function(index) {
        // update this with variantID
        var addoneHandle = $(this).attr("data-handler");
        // if cartAddon is null,
        if (cartAddons == "") {
            // save the addonHandle
            cartAddons = addoneHandle;
        } else {
            //set bool value to see if the addons is present in the addon list or not
            // by default it's false
            var boolCartAddons = false;
            // going through the string and checking if the current addon handle = the addon
            //handle present in the string
            var cartAddons2 = cartAddons.split(",");
            for (var a = 0; a < cartAddons2.length; a++) {
                if ($(this).attr("data-handler") == cartAddons2[a]) {
                    // if present, then hide it
                    $(this).hide();
                    boolCartAddons = true;
                }
            }
            // add the new addon handle to the string
            if (boolCartAddons == false) {
                cartAddons = cartAddons + "," + addoneHandle;
            }
        }

        /* Hide the addons from the addon list, if the addon is present in the cart */
        var boolItemCartAddon = false;
        $(".js__ajax-products-bind li").each(function(index) {
            var itemHandle = $(this).attr("data-handle");

            if (addoneHandle == itemHandle) {
                boolItemCartAddon = true;
            }
        });
        if (boolItemCartAddon == true) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
    /* Hide the complete section if there are no addons */
    var boolAddonExist = false;
    $(".js__top-cart-addons li").each(function(index) {
        if ($(this).css("display") != "none") {
            boolAddonExist = true;
        }
    });
    //console.log("boolAddonExist"+boolAddonExist);
    if (boolAddonExist == false) {
        //console.log("if");
        $(".js__freq-bought-products").hide();
    } else {
        //console.log("else");
        $(".js__freq-bought-products").show();
    }
}
//Addons are fetched from the schemas; Varies from theme to theme
setTimeout(function() {
    addons();
}, 1000);



