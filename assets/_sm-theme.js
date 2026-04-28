"use strict";

// tweaks these below variable if you want to show subtotal and discount
var showCartSubTotalDiscountSection = true;
var showEmptyCartIcon = false;
var showCartCountInTopNav = true;
var showProgressBar = true;
var showVendorOnCartPage = false; // Fixed variables

var lineItemComparePrice;
var cartObject;
var cartCountEmptyValue = "0";
var boxID = "BuilderID";
var cartExtraInfo; //extra classes for the elements

var removeExtraClass = "btn-border-black-animate"; // recharge 2020

var frequency = "";
var recurringchecked = false;
var frequency_unit = ""; //SVG icons

var removeMiniCartTextOrIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">    <path fill-rule="evenodd" clip-rule="evenodd" d="m5.815 7.586 4.188 4.188 1.523-1.523-4.188-4.188 4.189-4.189L10.004.351 5.814 4.54 1.628.352.104 1.875l4.188 4.188-4.188 4.188 1.523 1.523 4.188-4.188z" fill="#1A1B1B"/> </svg>';
var minusIcon = '';
var plusIcon = '';
$(document).ready(function ($) {
  reloadAjaxCartItemUsingCartAjaxObject();
  progressBar();
  quickCartTotal(); //	window.location.href = "https://checkout.rechargeapps.com/r/checkout?myshopify_domain=XXX.myshopify.com";
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
  formData.updates[id] = newQuantity; // Perform the AJAX request to update the cart

  $.ajax({
    type: "POST",
    url: "/cart/update.js",
    data: formData,
    dataType: "json",
    success: function success(cart) {
      // Perform any additional tasks after removing items
      $("#updates_" + id).val(newQuantity);
      getCartData(cart);
    },
    error: function error(_error) {
      // Handle error if the request fails
      console.error("Error updating items from the cart:", _error);
    }
  });
}
/* If you need extra information like collection title, metafield etc then use this function */


function reloadAjaxCartItemUsingCartAjaxObject(data) {
  //   cartInfo(data);
  $.ajax({
    type: "GET",
    url: "/cart?view=alternate.json",
    success: function success(response) {
      //extra information against the cart like collection title metafield, product title metafield, tags
      cartExtraInfo = $.parseJSON(response);
      cartInfo(data); // Populate addon products

      populateAddonProducts(cartExtraInfo);
    },
    error: function error(status) {
      console.warn("ERROR", status);
      cartInfo(data);
    }
  });
} // Populate addon products in cart drawer and cart page


function populateAddonProducts(cartExtraInfo) {
  if (!cartExtraInfo || !cartExtraInfo.addons || cartExtraInfo.addons.length === 0) {
    $(".js__addon-products-wrapper").html("");
    $(".js__cart-page-addon-wrapper").html("");
    $(".js__cart-page-addon-product").hide();
    $(".js__cart-minicart-addon-product").hide();
    return;
  } // Get array of variant IDs already in cart - convert to string for consistency


  var cartVariantIds = [];

  if (cartExtraInfo.items && cartExtraInfo.items.length > 0) {
    $.each(cartExtraInfo.items, function (index, item) {
      if (item.id) {
        cartVariantIds.push(String(item.id));
      }
    });
  }

  var addonHTML = ""; // For cart drawer (swiper format)

  var cartPageAddonHTML = ""; // For cart page (flex-wrap format)

  var processedAddonIds = []; // Track addon IDs already processed to avoid duplicates

  $.each(cartExtraInfo.addons, function (index, addon) {
    // Skip if this addon is already in the cart - convert to string for consistency
    var addonIdStr = String(addon.id);

    if ($.inArray(addonIdStr, cartVariantIds) !== -1) {
      return true; // continue to next iteration
    } // Skip if this addon ID has already been processed in this iteration


    if ($.inArray(addonIdStr, processedAddonIds) !== -1) {
      return true; // continue to next iteration
    } // Mark this addon as processed


    processedAddonIds.push(addonIdStr);
    var price = formatter.format(addon.variant_price / 100); // HTML for cart drawer (swiper-slide format)

    var addonHTMLItem = '<li class="swiper-slide">';
    addonHTMLItem += '<div class="image-section">';
    addonHTMLItem += '<img src="' + addon.productImage + '" alt="' + addon.product_title + '">';
    addonHTMLItem += '</div>';
    addonHTMLItem += '<div class="content">';
    addonHTMLItem += '<span class="name">' + addon.product_title + '</span>';
    addonHTMLItem += '<span class="price">' + price + '</span>';
    addonHTMLItem += '<a href="javascript:;" class="btn--primary js__addon-add-to-cart" data-attr-variantid="' + addon.id + '">Add</a>';
    addonHTMLItem += '</div>';
    addonHTMLItem += '</li>'; // HTML for cart page (flex format)

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
  }); // Populate cart drawer

  $(".js__addon-products-wrapper").html(addonHTML); // Populate cart page

  if (cartPageAddonHTML !== "") {
    $(".js__cart-page-addon-wrapper").html(cartPageAddonHTML);
    $(".js__cart-page-addon-product").show();
    $(".js__cart-minicart-addon-product").show();
  } else {
    $(".js__cart-page-addon-wrapper").html("");
    $(".js__cart-page-addon-product").hide();
    $(".js__cart-minicart-addon-product").hide();
  } // Initialize the swiper if it exists (for cart drawer)


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
        clickable: true
      }
    });
  }
} //RELOAD AJAX CART


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
    $(cartObject.items).each(function () {
      var imageURL = this.featured_image.url; //imageURL = imageURL[0] + "." + imageURL[1] + '_450x450' + "." + imageURL[2];

      var imageAlt = this.featured_image.alt;
      var itemPrice = this.original_price;
      var itemLinePriceTotal = this.line_price;
      var handle = this.handle;
      var itemID = this.id;
      var itemPriceAfterDiscount = this.discounted_price;
      var comparePrice = "";
      var disabled = "";
      var finalLineItemPrice = this.final_line_price;
      var cartBundleBoxID = "";
      var boolPromoOffer = false;
      var productTitle = this.product_title;
      var url = this.url;
      var itemProperties = "";
      var itemPropertiesElement = "";
      var boolItemBoxType = false;
      var hideElementClass = "";
      var readonly = "";
      var justifyCenter = "";
      var sellingPlayInformation = "";

      if (this.selling_plan_allocation != undefined) {
        sellingPlayInformation = this.selling_plan_allocation.selling_plan.name;
      }

      if (this.properties != null) {
        itemProperties = this.properties;

        if (Object.keys(itemProperties).length > 0) {
          $.each(itemProperties, function (key, value) {
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
          $.each(itemProperties, function (key, value) {
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
                itemPropertiesElement += "<li class='flex'><span>" + key + ": </span><span style='padding-left: 5px'>" + value + "</span>";
                itemPropertiesElement += "</li>";
              } else {
                itemPropertiesElement += "<li class='flex'><span>" + key + ": </span><span style='padding-left: 5px'>" + value + "</span>";
                itemPropertiesElement += "</li>";
              }
            } // Recharge - when subscription is via properties for older recharge version before November 2020


            recharge2020(key, value);
          }); // Recharge 2020, check if it's a subscription, then bind the value in the UL

          if (recurringchecked) {
            itemPropertiesElement += "<li class='flex'><span>Recurring Delivery every " + frequency + " " + frequency_unit + ". Change or cancel anytime</span>";
            itemPropertiesElement += "</li>";
          }

          itemPropertiesElement += "</ul>";
        } else {//itemPropertiesElement = "";
        }
      }

      var rechargeSelected = this.selling_plan_allocation;
      var rechargeDropdown = "";
      /* Loop through cartExtraInformation section */

      $(cartExtraInfo.items).each(function (key, value) {
        if (value.id == itemID) {
          if (value.comparePrice != null) {
            comparePrice = value.comparePrice;
          }

          if (value.productImage != null) {
            imageURL = value.productImage;
          }

          var Quantity = value.quantity;

          if (value.product_recharge == "True") {
            if (rechargeSelected == undefined) {
              rechargeDropdown = "<select id='planID" + lineCount + "' data-qty=" + Quantity + " class='" + hideElementClass + " custom-dropdown-select js__cart-plan'><option value=" + value.product_rechargeID + ">" + value.product_rechargeName + "</option><option value='One Time Purchase' selected>One Time Purchase</option></select>";
            } else {
              rechargeDropdown = "<select id='planID" + lineCount + "' data-qty=" + this.quantity + " class='" + hideElementClass + " custom-dropdown-select js__cart-plan'><option value=" + value.product_rechargeID + " selected>" + value.product_rechargeName + "</option><option value='One Time Purchase'>One Time Purchase</option></select>";
            }
          }

          productTitle = "<h5 class'h6'> <a href='" + url + "' id='product-card-" + this.id + "' tabindex='0'>" + value.product_title.split("with")[0] + " </a></h5>";
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
      } // total compared price for the item with quantity


      var totalListItemComparePrice = formatter.format(comparePrice * this.quantity / 100); // item original price

      var formattedItemPrice = formatter.format(itemPrice / 100); // line price

      var formattedItemLinePriceTotal = formatter.format(itemLinePriceTotal / 100); //final line item price

      var formattedFinalLineItemPrice = formatter.format(finalLineItemPrice / 100); //Price after discount

      var showPrice = "";
      var itemPriceAfterDiscountStatus = false;
      var discountedMessage = "";
      var discountedMessageElement = "";

      if (this.discounts != null) {
        discountedMessage = this.discounts;

        if (Object.keys(discountedMessage).length > 0) {
          //console.log("DISCOUNT EXISTS");
          discountedMessageElement = "<span class='discountedMessage'>";
          $.each(discountedMessage, function (key, value) {
            discountedMessageElement += value.title;
          });
          discountedMessageElement += "</span>";
        }
      }

      var formattedItemPriceAfterDiscount = formatter.format(itemPriceAfterDiscount / 100); // if itemPriceAfterDiscount > 0 then set the status to true so you can interchange the values

      if (this.discounts.length > 0) {
        itemPriceAfterDiscountStatus = true;
      } // if it's true; then show the compared price as the main price this.price and main price as discounted price


      if (itemPriceAfterDiscountStatus) {
        //comparePriceHtml
        showPrice = '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0"><s>' + formattedItemPrice + '</s><span class="price" data-key="' + itemID + '">' + formattedItemPriceAfterDiscount + "</span><span class='forMiniCart'>" + formattedFinalLineItemPrice + "</span></span>" + discountedMessageElement;
      } else {
        showPrice = '<span class="price-wrapper js__raw-line-item-price"  data-attr-compare-price="0">' + comparePriceHtml + '<span class="price" data-key="' + itemID + '">' + formattedItemPrice + "</span><span class='forMiniCart'>" + formattedFinalLineItemPrice + "</span></span>";
      }
      /* check if variantTitle is NULL, then don't show variant */


      var variantTitle = this.variant_title;

      if (variantTitle == null) {
        variantTitle = "";
      }

      var variantData = "";
      $.each(this.options_with_values, function (key, value) {
        //console.log("key" + key);console.log("value" + value["name"]);console.log("value" + value["value"]);
        variantData += "<li><span>" + value["name"] + ": " + value["value"].split("with")[0] + "</span></li>";
      });
      /* CUSTOM - if the product title contains "bag",  then disabled the quantity element
          To be applied for all the products with BoxID and Promo Offer
          */

      if (this.product_title.toLowerCase().indexOf("bag") >= 0 && cartBundleBoxID != "" || this.product_title.toLowerCase().indexOf("bag") >= 0 && boolPromoOffer) {
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


      var quantityElement = '<div class="cart-quantity-outer ' + disabled + justifyCenter + '"> <a  tabindex="0"  class="minus-qty ' + hideElementClass + '  font-zero" date-type="minus" onclick="updateCartQuantity(this)"   data-variant-id="' + itemID + '">' + minusIcon + '</a> <input aria-label="Quantity"  tabindex="-1"  data-limit="' + boolItemBoxType + '"  ' + readonly + '   onkeydown="return isNumeric(event);" type="text"  data-attr-raw-variant-quantity="94" data-cart-line-count="' + lineCount + '" class="cart__quantity-selector js__cart__quantity-selector" name="updates[]" id="updates_' + itemID + '" value="' + this.quantity + '" maxlength="3" size="3"> <a  tabindex="0"  class="plus-qty ' + hideElementClass + '  font-zero" date-type="plus" onclick="updateCartQuantity(this)"     data-variant-id="' + itemID + '">' + plusIcon + "</a> </div>"; //vendor element

      var vendorElement = '<span class="subheading uppercase">' + this.vendor + "</span>";
      var lineItem;
      lineItem = '<li class="flex-wrap js__cart-table-item-row" data-cart-line-count=' + lineCount + ' data-handle="' + handle + '" data-variant-id=' + itemID + '><div class="image-section"> <a href="' + url + '"><img alt="' + imageAlt + '" src="' + imageURL + '""> </a> </div>';
      lineItem += '<div class="content"><a class="remove" data-cart-line-count="' + lineCount + '" data-variant-id="' + itemID + '" href="javascript:;">remove</a><div class="title-section">' + productTitle + "";

      if (sellingPlayInformation != "") {
        lineItem += '<p class="capitalize">' + sellingPlayInformation + "</p>";
      }

      if (itemPropertiesElement != "") {
        lineItem += '<p class="capitalize">' + itemPropertiesElement + "</p>";
      }

      if (variantTitle != "") {
        lineItem += "<ul>" + variantData + "</ul>";
      }

      lineItem += showPrice + '</div><div class="flex-space-between"><div class="quantity-remove-outer">' + quantityElement + '</div>';
      lineItem += "<span class='price'>" + formattedItemPriceAfterDiscount + comparePriceHtml + "</span></div>" + rechargeDropdown + "</div>";
      lineItem += "</li>";
      /* Bind the line item to the list */

      $(".js__ajax-products-bind").append(lineItem);
      /*******LINE ITEM FOR THE CART PAGE********/

      if ($(".cart-list")[0]) {
        var cartLineItem = "";
        cartLineItem = '<div class="cart-list__items cart-table-body js__cart-table-item-row flex" data-cart-line-count="' + lineCount + '" data-attr-compare-price="" data-variant-id="' + itemID + '"><div class="cart-list__items__columns"><a class="image-section " href="' + url + '"><img class="img-responsive img-thumbnail item-image" src="' + imageURL + '" alt="' + imageAlt + '"></a> <div class="content">'; // show vendor on cart page

        if (showVendorOnCartPage) {
          cartLineItem += vendorElement;
        }

        cartLineItem += productTitle;
        cartLineItem += '<div class="cart-list__variant-properties">';

        if (sellingPlayInformation != "") {
          cartLineItem += '<span class="capitalize">' + sellingPlayInformation + "</span>";
        }

        if (itemPropertiesElement != "") {
          cartLineItem += '<span class="capitalize">' + itemPropertiesElement + "</span>";
        }

        if (variantTitle != "") {
          cartLineItem += "<ul>" + variantData + "</ul>";
        }

        cartLineItem += showPrice + "</div>";
        cartLineItem += '</div>  </div> ';
        cartLineItem += '<div class="cart-list__items__columns price" > ' + showPrice; // ** Remove action is added here too

        cartLineItem += "</div>";
        cartLineItem += '<div class="cart-list__items__columns quantity" data-variant-id="' + itemID + '"> ' + quantityElement + '   <span class="js__out-of-stock"></span>'; // ** Remove action is added here too

        cartLineItem += "</div><div class='cart-list__items__columns remove ' ><a class='remove' data-cart-line-count='" + lineCount + "' data-variant-id='" + itemID + "' href='javascript:;'>remove</a></div>";
        cartLineItem += '<div class="cart-list__items__columns total-price " data-head="Total"> <span class="price-wrapper js__set-line-item-price" data-attr-price="' + itemPrice + '" data-attr-compare-price=' + totalListItemComparePrice + '><s class="hide">' + totalListItemComparePrice + '</s><span class="price" data-key="' + itemID + '">' + formattedItemLinePriceTotal + "</span> </span>"; // ** Remove element is added here too

        cartCountEmptyValue += " </div></div>";
        $(".cart-list").append(cartLineItem);
      }

      lineCount++;
    });
  }
} //CALCULATE TOTAL OF THE CART


function quickCartTotal(data) {
  if (data == undefined) {
    cartObject = CartJS.cart;
  } else {
    cartObject = data;
  }

  var total = cartObject.items_subtotal_price;
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
$(document).on("click", ".remove", function () {
  var variantID = parseInt($(this).attr("data-variant-id"));
  var clickedLineItemCount = parseInt($(this).attr("data-cart-line-count"));
  var currentLoopItemCount = 1; // console.log(variantID);

  var boxID = "BuilderID";
  var itemsToRemove = [];
  var formData = {
    updates: {}
  };
  $.getJSON("/cart.js", function (cart) {
    var savedItemPropertyBoxID = ""; // console.log(cart.items.length);
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
            savedItemPropertyBoxID = currentItem.properties[boxID]; // console.log("Saved Item Property Box ID:", savedItemPropertyBoxID);

            break;
          } else {
            // it doesn't has the BoxID, then delete the particular LineItem
            // console.log("Current Line Item - With no BoxID")
            itemsToRemove.push(currentItem.variant_id);
          }
        }
      }

      currentLoopItemCount = currentLoopItemCount + 1;
    } // Loop through cart items to find items with matching BoxID


    for (var j = 0; j < cart.items.length; j++) {
      var currentItem = cart.items[j];

      if (currentItem.properties && currentItem.properties[boxID] === savedItemPropertyBoxID) {
        itemsToRemove.push(currentItem.variant_id); //console.log("Item Variant ID to Remove:", currentItem.variant_id);
      }
    } // console.log(itemsToRemove);
    // console.log(itemsToRemove.length);
    // Call the function to remove items from the cart


    removeItemsFromCart(itemsToRemove); // Remove items from the cart
  });
}); // Function to remove items from the cart

function removeItemsFromCart(itemsToRemove) {
  var formData = {
    updates: {}
  }; // Populate the formData with variant IDs to remove

  for (var k = 0; k < itemsToRemove.length; k++) {
    var variantID = itemsToRemove[k];
    formData.updates[variantID] = 0;
  }

  $.ajax({
    type: "POST",
    url: "/cart/update.js",
    data: formData,
    dataType: "json",
    success: function success(cart) {
      getCartData(cart);
    },
    error: function error(_error2) {
      // Handle error if the request fails
      console.error("Error removing items from the cart:", _error2);
    }
  });
}

function getCartData() {
  $.getJSON("/cart.js", function (cart) {
    cartInfo(cart);
    progressBar(); // Reload addon products to refresh the list after cart updates

    $.ajax({
      type: "GET",
      url: "/cart?view=alternate.json",
      success: function success(response) {
        cartExtraInfo = $.parseJSON(response);
        populateAddonProducts(cartExtraInfo);
      },
      error: function error(status) {
        console.warn("ERROR fetching addon products", status);
      }
    });
    setTimeout(function () {
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
        "Content-Type": "application/json"
      }
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      totalAmount = data.total_price / 100;
      var freeShippingAmount = parseFloat($(".js__free-shipping-limit").html());
      $(".js__free-shipping-amount").html(formatter.format(freeShippingAmount));
      console.log("totalAmount" + totalAmount);
      console.log("freeShippingAmount" + freeShippingAmount);

      if (totalAmount > freeShippingAmount) {
        console.log("if");
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
  CartJS.addItem(addonSelectedVariantID, addonQuantity, {}, {
    success: function success(data, textStatus, jqXHR) {//console.log("success");

      /* Pending - Remove the selected addon when add to cart is clicked */
    },
    error: function error(jqXHR, textStatus, errorThrown) {//console.log("error");
    }
  });
}

function addons() {
  //console.log("addons");

  /*Hide repeating addons*/
  var cartAddons = "";
  $(".js__top-cart-addons li").each(function (index) {
    // update this with variantID
    var addoneHandle = $(this).attr("data-handler"); // if cartAddon is null,

    if (cartAddons == "") {
      // save the addonHandle
      cartAddons = addoneHandle;
    } else {
      //set bool value to see if the addons is present in the addon list or not
      // by default it's false
      var boolCartAddons = false; // going through the string and checking if the current addon handle = the addon
      //handle present in the string

      var cartAddons2 = cartAddons.split(",");

      for (var a = 0; a < cartAddons2.length; a++) {
        if ($(this).attr("data-handler") == cartAddons2[a]) {
          // if present, then hide it
          $(this).hide();
          boolCartAddons = true;
        }
      } // add the new addon handle to the string


      if (boolCartAddons == false) {
        cartAddons = cartAddons + "," + addoneHandle;
      }
    }
    /* Hide the addons from the addon list, if the addon is present in the cart */


    var boolItemCartAddon = false;
    $(".js__ajax-products-bind li").each(function (index) {
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
  $(".js__top-cart-addons li").each(function (index) {
    if ($(this).css("display") != "none") {
      boolAddonExist = true;
    }
  }); //console.log("boolAddonExist"+boolAddonExist);

  if (boolAddonExist == false) {
    //console.log("if");
    $(".js__freq-bought-products").hide();
  } else {
    //console.log("else");
    $(".js__freq-bought-products").show();
  }
} //Addons are fetched from the schemas; Varies from theme to theme


setTimeout(function () {
  addons();
}, 1000);
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

jQuery(function () {
  var _Swiper;

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
      prevEl: ".swiper-button-prev-product-section"
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      376: {
        slidesPerView: 1
      },
      481: {
        slidesPerView: 1
      },
      769: {
        slidesPerView: 3
      },
      1100: {
        slidesPerView: 4
      }
    }
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
      clickable: true
    }
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
      clickable: true
    }
  });
  var marquee = document.querySelectorAll(".js_logo-slider .swiper-wrapper .swiper-slide");

  if (marquee.length > 0) {
    var wrapper = document.querySelector(".js_logo-slider .swiper-wrapper");

    for (var i = 0; i < 500; i++) {
      marquee.forEach(function (slide) {
        // Clone each slide
        var clone1 = slide.cloneNode(true); // Inject it into the wrapper

        wrapper.appendChild(clone1);
      });
    }
  } // logo Slider


  var logoSlider = new Swiper(".js_logo-slider", (_Swiper = {
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
      disableOnInteraction: false
    },
    slidesPerView: 5.5
  }, _defineProperty(_Swiper, "spaceBetween", 100), _defineProperty(_Swiper, "speed", 4000), _defineProperty(_Swiper, "breakpoints", {
    0: {
      slidesPerView: 2.5,
      spaceBetween: 30
    },
    481: {
      slidesPerView: 3.5,
      spaceBetween: 50
    },
    769: {
      slidesPerView: 4.5,
      spaceBetween: 50
    },
    1201: {
      slidesPerView: 5.5,
      spaceBetween: 70
    }
  }), _Swiper)); //    embed slider

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
      prevEl: ".swiper-button-prev-embed-slider "
    }
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
      prevEl: ".swiper-button-prev-content-slider"
    }
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
        spaceBetween: 10
      },
      481: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      601: {
        slidesPerView: 3,
        spaceBetween: 10
      },
      769: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      981: {
        slidesPerView: 5,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 20
      },
      1440: {
        slidesPerView: "auto",
        spaceBetween: 20
      }
    },
    navigation: {
      nextEl: ".swiper-button-next-product-slider",
      prevEl: ".swiper-button-prev-product-slider "
    }
  });
  var blogSlider = new Swiper(".js__blog-slider", {
    slidesPerView: "auto",
    spaceBetween: 20,
    threshold: 1,
    loop: true,
    breakpoints: {
      1920: {
        slidesPerView: "auto"
      }
    },
    navigation: {
      nextEl: ".swiper-button-next-blog-slider",
      prevEl: ".swiper-button-prev-blog-slider "
    }
  });
  var productSlider = new Swiper(".js__small-product-slider", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: true,
    threshold: 1,
    breakpoints: {
      1025: {
        slidesPerView: 3,
        spaceBetween: 25
      },
      981: {
        slidesPerView: 2,
        spaceBetween: 25
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 25
      },
      0: {
        slidesPerView: 2,
        spaceBetween: 25
      }
    },
    navigation: {
      nextEl: ".swiper-button-next-small-product-slider",
      prevEl: ".swiper-button-prev-small-product-slider "
    }
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
  } catch (_unused) {}
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
    $(this).parent("li").parent("ul").parent(".pdp-tab-small__wrapper__head").parent(".pdp-tab-small__wrapper").children(".pdp-tab-small__wrapper__content").children(".pdp-tab-content").hide();
    $(this).parent("li").parent("ul").parent(".pdp-tab-small__wrapper__head").parent(".pdp-tab-small__wrapper__head-outer").parent(".pdp-tab-small__wrapper").children(".pdp-tab-small__wrapper__content").children(".pdp-tab-content").hide();
    $(this).parent("li").parent("ul").children("li").children(".pdp-tab-link").removeClass("active");
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
      $("html, body").stop().animate({
        scrollTop: target.offset().top - 150
      }, 1000);
    }
  });
  /* accordion working about content in small screen*/

  $(".js__accordian").children("li").children("h2,h4,h5,h3,.feature-header").click(function (e) {
    if ($(this).parent("li").children(".content").css("display") == "none") {
      $(this).parent("li").parent(".js__accordian").children("li").children(".content").hide();
      $(this).parent("li").parent(".js__accordian").children("li").removeClass("active");
      $(this).parent("li").children(".content").slideDown();
      $(this).parent("li").addClass("active");
    } else {
      $(this).parent("li").children(".content").slideUp();
      $(this).parent("li").removeClass("active");
    }
  });
  $(document).on("click", ".pid-content-box", function () {
    if ($(this).find(".pid-content-expander").html() != "") {
      if ($(this).parent(".pid-content-flex").children(".pid-content-description").css("display") == "none") {
        $(this).parent(".pid-content-flex").children(".pid-content-description").slideDown();
        $(this).addClass("active");
      } else {
        $(this).parent(".pid-content-flex").children(".pid-content-description").slideUp();
        $(this).removeClass("active");
      }
    }
  });
  /* Accordion working when we have multiple content*/

  $(".js__accordians").children("li").attr("aria-expanded", false);
  $(".js__accordians").children("li").children("h5,h6,h3,h4").attr("role", "button");
  $(".js__accordians").children("li").children("h5,h6,h3,h4").attr("tabindex", "0");
  $(".js__accordians").children("li").children("h5,h6,h3,h4").click(function (e) {
    var type = $(this).parent("li").attr("data-attr");

    if ($("." + type).css("display") == "none") {
      $(this).attr("aria-expanded", true);
      $(this).parent("li").parent(".js__accordians").children(".content").hide();
      $(this).parent("li").parent(".js__accordians").children("li").removeClass("active");
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
  $(".js__accordians").children("li").children("h5,h6,h3,h4").keypress(function (e) {
    if (e.which == 13) {
      var type = $(this).parent("li").attr("data-attr");

      if ($("." + type).css("display") == "none") {
        $(this).attr("aria-expanded", true);
        $(this).parent("li").parent(".js__accordians").children(".content").hide();
        $(this).parent("li").parent(".js__accordians").children("li").removeClass("active");
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

    if ($(this).parent(".tab-content").children(".accordion-con").css("display") == "none") {
      // $(".accordion-con").slideUp();
      // $(".accordion-con").removeClass("active");
      // $(".accordion-link").removeClass("active");
      // $(".tab-content").removeClass("active");
      $(".tab-link").removeClass("active");
      $(this).parent(".tab-content").children(".accordion-con").slideDown();
      $(this).parent(".tab-content").children(".accordion-con").addClass("active"); // $(this).parent(".tab-content").addClass("active");

      $(this).parent(".tab-content").children(".accordion-link").addClass("active");
      var dataId = $(this).parent(".tab-content").attr("data-attr");
      document.getElementById(dataId).className += " active";
      $("html,body").animate({
        scrollTop: $(this).offset().top - 120
      }, 500);
    } else {
      // $(".accordion-con").slideUp();
      // $(".accordion-con").removeClass("active");
      // $(".tab-content").removeClass("active");
      $(this).parent(".tab-content").children(".accordion-link").removeClass("active"); // $(this).parent(".tab-content").removeClass("active");

      $(this).parent(".tab-content").children(".accordion-con").removeClass("active");
    }
  });
  $(document).on("click", ".js___accordion", function (e) {
    e.preventDefault();

    if ($(this).parent(".tab-content").children(".accordion-con").css("display") == "none") {
      $(".accordion-con").slideUp();
      $(".accordion-con").removeClass("active");
      $(".accordion-link").removeClass("active"); // $(".tab-content").removeClass("active");

      $(".tab-link").removeClass("active");
      $(this).parent(".tab-content").children(".accordion-con").slideDown();
      $(this).parent(".tab-content").children(".accordion-con").addClass("active"); // $(this).parent(".tab-content").addClass("active");

      $(this).parent(".tab-content").children(".accordion-link").addClass("active");
      var dataId = $(this).parent(".tab-content").attr("data-attr");
      document.getElementById(dataId).className += " active";
      $("html,body").animate({
        scrollTop: $(this).offset().top - 120
      }, 500);
    } else {
      $(".accordion-con").slideUp();
      $(".accordion-con").removeClass("active"); // $(".tab-content").removeClass("active");

      $(this).parent(".tab-content").children(".accordion-link").removeClass("active"); // $(this).parent(".tab-content").removeClass("active");

      $(this).parent(".tab-content").children(".accordion-con").removeClass("active");
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
    $(".js__no-data-found").addClass("hide"); //first hide all tabs again when a new option is selected

    $(".tab-content").hide(); //then show the tab content of whatever option value was selected

    $("#" + "tab-" + dropdown).show();

    if (dropdown == "all") {
      $(".js__tab-content").each(function () {
        if ($(this).find(".js__accordian").html().trim() == "<li>Sorry Data Is Not Added Yet</li>") {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    }
  });
  $(".js__tab-content").each(function () {
    if ($(this).find(".js__accordian").html().trim() == "") {
      $(this).find(".js__accordian").html("<li>Sorry Data Is Not Added Yet</li>");
    }
  });
});
/*Blog content checking if p tag has image then adding class*/

jQuery(function ($) {
  $(".article-content p").each(function () {
    var $p = $(this); // Check if paragraph has img or iframe

    if ($p.find("img, iframe").length) {
      $p.addClass("full-width"); // Wrap text nodes

      $p.contents().each(function () {
        if (this.nodeType === 3 && this.nodeValue.trim().length > 0) {
          $(this).replaceWith('<span class="text-content">' + this.nodeValue + "</span>");
        }
      });
    } else {
      // Wrap text-only paragraphs
      if (!$p.find("span.text-content").length) {
        $p.contents().filter(function () {
          return this.nodeType === 3 && this.nodeValue.trim().length > 0;
        }).wrap('<span class="text-content"></span>');
      }
    } // 👇 check for video after everything


    if ($p.find(".video-wrapper").length) {
      $p.addClass("has-video");
    }
  });
}); // jQuery(document).ready(function ($) {
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

$(document).on("click", ".js__popup-quantity .js-plus-minus-qty", function (e) {
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

$(document).on("click", ".js__quick-view-click", function (e) {
  e.preventDefault();
  e.stopImmediatePropagation();
  var id = $(this).attr("data-id"); //Executed after SWYM has loaded all necessary resources.

  var productTItle = $(this).attr("title");
  $(".js__popup-product-name-" + id).html(productTItle);
  $(".js__popup-variant-select-" + id + " li:first-child").click(); // show modal pop up

  $("#modal-" + id).show();
});
/* Quick View - Variant Radio Button Clicks */

$(document).on("click", ".js__popup-variant-select li", function (e) {
  $(this).parent("ul").children("li").removeClass("active");
  var option = $(this).attr("data-value");
  var optionDisplayText = $(this).text() || $(this).html(); // Get the displayed text as well

  var optionPosition = parseInt($(this).attr("data-option")) || 1; // Get which option position (1, 2, or 3)

  $(this).addClass("active");
  var pID = $(this).attr("data-id"); // Validate required attributes

  if (!pID) {
    return;
  }

  var $productSelect = $("#product-select-" + pID);

  if ($productSelect.length === 0) {
    return;
  } // Normalize the option value for comparison - handles quotes, whitespace, and HTML entities


  var normalizeString = function normalizeString(str) {
    if (!str) return "";
    var text = str.toString(); // Decode HTML entities

    var tempDiv = $('<div>').html(text);
    text = tempDiv.text() || text; // Normalize all types of quotes to a single quote character

    text = text.replace(/[""''`]/g, '"'); // Normalize whitespace

    text = text.replace(/\s+/g, ' ');
    return text.trim();
  }; // Check if data-value seems incomplete (shorter than displayed text by significant amount)
  // This handles cases where data-value is malformed due to unescaped quotes in HTML


  var normalizedDisplayText = normalizeString(optionDisplayText);
  var normalizedOption = option ? normalizeString(option) : ""; // If data-value is missing or significantly shorter than displayed text, prioritize displayed text
  // Also check if they're very different (data-value might be truncated due to quote issues)

  var useDisplayText = false;

  if (!normalizedOption || normalizedDisplayText.length > normalizedOption.length * 1.5) {
    useDisplayText = true;
  } // Build array of options to try - prioritize displayed text if data-value seems broken


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
  $productSelect.find("option").each(function (index) {
    if (matchFound) {
      return false; // Break loop
    } // Use text() instead of html() to get plain text content without HTML encoding issues


    var optionName = $(this).text() || $(this).html();
    var vID = $(this).attr("value");
    var variantSoldout = $(this).attr("data-soldout");
    var price = $(this).attr("data-price"); // Validate optionName before processing

    if (!optionName || !vID) {
      return true; // Continue to next iteration
    } // Normalize the option name for comparison


    var normalizedOptionName = normalizeString(optionName); // Try multiple matching strategies:

    var isMatch = false; // 1. Exact match (for single option products)

    for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
      var currentOption = optionsToTry[optIdx];

      if (normalizedOptionName === currentOption) {
        isMatch = true;
        break;
      }
    } // 2. If not exact match, try splitting by common separators (/, -, |)
    // This handles multi-option products where variant.title = "Option1 / Option2 / Option3"


    if (!isMatch) {
      var separators = [' / ', ' - ', ' | ', ' /', '/ ', ' -', '- ', ' |', '| ', '/', '-', '|'];
      var variantParts = [normalizedOptionName]; // Split by separators

      for (var i = 0; i < separators.length; i++) {
        if (normalizedOptionName.indexOf(separators[i]) !== -1) {
          variantParts = normalizedOptionName.split(separators[i]).map(function (part) {
            return normalizeString(part);
          });
          break;
        }
      } // Check all parts of the variant title for a match with any of our option values


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
    } // 3. Check if variant title starts with any of our option values (for when it's the first option)


    if (!isMatch) {
      for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
        var currentOption = optionsToTry[optIdx];

        if (normalizedOptionName.indexOf(currentOption) === 0) {
          isMatch = true;
          break;
        }
      }
    } // 4. Fallback: Check if option value is contained anywhere in variant title
    // This handles edge cases where format might be different or has extra characters


    if (!isMatch) {
      for (var optIdx = 0; optIdx < optionsToTry.length && !isMatch; optIdx++) {
        var currentOption = optionsToTry[optIdx];

        if (currentOption.length >= 3 && normalizedOptionName.indexOf(currentOption) !== -1) {
          isMatch = true;
          break;
        }
      }
    } // 5. Final fallback: Compare normalized versions removing all special characters except alphanumeric and spaces
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
        $(".js__modal-popup-addtocart-" + pID).attr("disabled", "disabled"); //update the text for the add to cart button to sold out

        $(".js__modal-popup-addtocart-" + pID).html("Soldout");
      } else {
        $(".js__modal-popup-qty-" + pID).show(); //update the text for the button to add to cart, if not sold out

        $(".js__modal-popup-addtocart-" + pID).html("Add to Cart"); // if not sold out, then remove the attr disabled

        $(".js__modal-popup-addtocart-" + pID).removeAttr("disabled");
      } // update the variant ID for the data-variant-id


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
$(document).on("click", ".js__modal-popup-addtocart", function (e) {
  console.log("click");
  var pID = $(this).attr("data-id");
  console.log("pID" + pID);
  var selectedVariantID = $(this).attr("data-variant-id");
  console.log("pID" + selectedVariantID);
  var quantity = parseInt($(".js-quantity-selector-" + pID).val());
  var recharge = $(".js__rc_radio_options-" + pID).html();
  var items = [];

  if (recharge == undefined) {
    /* For the main item */
    items.push({
      id: selectedVariantID,
      quantity: quantity
    });
  } else {
    if ($(".js__rc_radio_options-" + pID + " .rc_block__type-modal-popup.rc_block__type--active").hasClass("rc_block__type__onetime")) {
      items.push({
        id: selectedVariantID,
        quantity: quantity
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
    success: function success(response, textStatus, jqXHR) {
      console.log("success");
      $(".modal-quick-view").hide();

      if (getglobalLib("Mini_Cart") == "yes") {
        /* Show message */
        setTimeout(openMiniCart, 500);
      } else {
        window.location = "/cart";
      }
    },
    // Define an error callback to display an error message.
    error: function error(jqXHR, textStatus, errorThrown) {
      showCartErrorMessage();
      console.log("error");
    }
  });
});
$(document).on("click", ".js__quick-view-popup-close", function (e) {
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
      $(".dropdown-select").val("all"); //Go through each list item and hide if not match search

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
    var items = [];
    /* For the main item */

    items.push({
      id: selectedVariantID,
      quantity: quantity
    });
    CartJS.addItems(items, {
      success: function success(response, textStatus, jqXHR) {
        console.log("success adding to cart");
        $(".modal-quick-view").hide();
        $(".js__card-add-to-cart-" + selectedVariantID).addClass("added");
        $(".js__card-add-to-cart-" + selectedVariantID).html("Added");

        if (getglobalLib("Mini_Cart") == "yes") {
          /* Show message */
          setTimeout(openMiniCart, 500);
        } else {
          window.location = "/cart";
        }
      },
      // Define an error callback to display an error message.
      error: function error(jqXHR, textStatus, errorThrown) {
        showCartErrorMessage();
        console.log("error adding to cart");
      }
    });
  });
});
jQuery(document).ready(function ($) {
  $(".js__read-mode-toggle").on("click", function () {
    if ($(this).hasClass("active")) {
      $(this).parent(".mobile-block").parent(".js__description-outer").find(".desktopdescription").removeClass("active");
      $(this).removeClass("active");
      $(this).html("Read More");
    } else {
      $(this).parent(".mobile-block").parent(".js__description-outer").find(".desktopdescription").addClass("active");
      $(this).addClass("active");
      $(this).html("Read Less");
    }
  });
}); // Footer DropDown Of Link

jQuery(document).ready(function ($) {
  $(".footer-links .accordion-toggle").on("click", function (e) {
    if ($(window).width() <= 768) {
      e.preventDefault();
      e.stopPropagation();
      var $toggle = $(this);
      var $content = $toggle.next(".accordion-content");

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
  }); // Reset state when resizing back to desktop

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
      var params = new URLSearchParams(window.location.search);
      var currentPage = params.get("page"); // Hide featured and popular sections if not first page

      if (currentPage && currentPage !== "1") {
        $(".featured-blog-section, .three-column-blog-slider").hide();
      }
    }
  } // Wait until those sections actually load (important for JSON templates)


  var checkSections = setInterval(function () {
    if ($(".featured-blog-section").length || $(".three-column-blog-slider").length) {
      hideBlogExtraSections();
      clearInterval(checkSections);
    }
  }, 300); // Also run immediately in case they’re already present

  hideBlogExtraSections();
});
jQuery(document).ready(function ($) {
  var $popup = $(".article-video-popup"); // 🔹 Open popup

  $(".video-wrapper").on("click", function () {
    var id = $(this).attr("data-id");
    $("#modal-video-popup-" + id).fadeIn(200).css("display", "flex");
  }); // 🔹 Close popup on close button OR clicking outside

  /* $(".close-popup, .article-video-popup").on("click", function (e) {
     if ($(e.target).is(".article-video-popup, .close-popup")) {
       $popup.fadeOut(200);
     }
   });*/

  $(document).on("click", ".article-video-popup", function (e) {
    if (!($(e.target).closest(".video-popup-inner").length > 0 || $(e.target).closest(".close-popup").length > 0)) {
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
"use strict";

var showCartMessage = true;
jQuery(function () {
  //Nav - Open and Close Mini cart
  if (getglobalLib("Mini_Cart") == "yes") {
    $(".js__cart-expand").on("click", function () {
      $("#CartSidebar").toggleClass("active");
      $("#cart_overlay").toggleClass("active");
      $(this).addClass("active");
    });
    $("#js__cart-close").on("click", function () {
      $("#CartSidebar").removeClass("active");
      $("#cart_overlay").removeClass("active");
      $(".js__cart-expand").removeClass("active");
    }); // Close cart on ESC key press

    $(document).on("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        $("#CartSidebar").removeClass("active");
        $("#cart_overlay").removeClass("active");
        $(".js__cart-expand").removeClass("active");
      }
    });
    $(".js__cart-expand").attr("href", "javascript:void(0)");
  }
  /* Cart - Free Shipping Progress bar Visiblity */


  try {
    if (getglobalLib("Free_Shipping_progressbar") == "yes" && $(".js__free-shipping-limit").html().trim() != "" && showProgressBar == true) {
      $(".js__progressbar_visiblity").removeClass("hide");
    }
  } catch (_unused) {}
  /* Remove mini cart from the cart page */


  if ($(".cart-table-body")[0]) {
    $("#CartSidebar").remove();
    $("#cart_overlay").remove();
    $(".js__top-cart-form-actions").remove();
    $(".js__ajax-products-bind").remove();
    $(".mini-cart").removeClass("js__cart-expand");
    $(".mini-cart").attr("href", "/cart");
  }
  /* show no items in cart */


  if (CartJS.cart.item_count == 0) {
    $(".empty-cart-section").show();
    $(".js__show-cart-items-section").hide();
    $("#shopify-section-cart-recommendations").hide();
  } else {
    $(".empty-cart-section").hide();
  }
  /*Quantity Plus Minus for the textbox */


  $(".js__product-single__quantity .js__minus-qty").click(function () {
    decreaseQuantity();
  });
  $(".js__product-single__quantity .js__plus-qty").click(function () {
    increaseQuantity();
  });

  function increaseQuantity() {
    var productQuantity = $(".js__quantity-selector").val();
    productQuantity++;
    $(".js__quantity-selector").val(productQuantity);
  }

  function decreaseQuantity() {
    var productQuantity = $(".js__quantity-selector").val();

    if (productQuantity > 1) {
      productQuantity--;
    }

    $(".js__quantity-selector").val(productQuantity);
  }
});
/* 
NOTIFICATIONS SECTION
Show Noticiations On Success and Error
Note: This function isn't being used in every theme
Feel free to comment/uncomment as per the functionality
*/

function showCartSuccessMessage() {
  setTimeout(openMiniCart, 500);

  if (showCartMessage == true) {
    $("#cart-message").addClass("message-success");
    $("#cart-message").removeClass("message-error");
    $("#cart-message").html("Successfully added to cart!");
    $("#cart-message").show();
    setTimeout(function () {
      $("#cart-message").hide();
    }, 5000);
  }
}

function showCartErrorMessage() {
  if (showCartMessage == true) {
    $("#cart-message").removeClass("message-success");
    $("#cart-message").addClass("message-error");
    $("#cart-message").html("Sorry! Seems like the product is out of stock");
    $("#cart-message").show();
    setTimeout(function () {
      $("#cart-message").hide();
    }, 5000);
  }
}

function openMiniCart() {
  fetch('/cart.js', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    $("#CartSidebar").toggleClass("active");
    $("#cart_overlay").toggleClass("active");
  });
}
/* EVENT: When the cart request is completed everytime the below function is run */


$(document).on("cart.requestComplete", function (event, cart) {
  reloadAjaxCartItemUsingCartAjaxObject(cart); //Progress Bar of shipping in cart and mini cart; Varies from theme to theme

  progressBar(); //Show and hide empty cart depending upon the cart items

  setTimeout(function () {
    // calculateSubTotalWithDiscount();
    addons();
  }, 1000);
}); // $(document).on("cart.requestStarted", function (event, cart) {console.log("Request started"); });
//$(document).on("cart.ready", function (event, cart) {});

/* currency formatter */

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});
"use strict";

jQuery(function () {
  /* Footer - Accordion Visiblity */
  if (getglobalLib("Footer_Accordion") == "yes") {
    $(".js__accordion-toggle-visiblity").addClass("accordion-toggle-footer");
    $(".js__accordion-content-visiblity").addClass("accordion-content-footer");
  }
  /* FAQ - Category Sidebar Visiblity */


  if (getglobalLib("FAQ_Side_Panel") == "yes") {
    $(".js__faq-category-side-panel").removeClass("hide");
  }

  if (getglobalLib("Product_Recommendation_Slider") == "on") {
    $("#js__pdp-recommendation-slider").not(".slick-initialized").slick({
      slidesToShow: 4,
      slidesToScroll: 4,
      dots: false,
      centerMode: false,
      infinite: false,
      focusOnSelect: true,
      variableWidth: true,
      draggable: true
    });
  }
});
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  if (window.Swiper) {
    new Swiper(".js__announcement-slider", {
      slidesPerView: 1,
      resistance: false,
      shortSwipes: true,
      loop: false,
      // autoHeight: true,
      autoplay: {
        delay: 10000
      }
    });
  } else {
    console.warn("Swiper is not loaded!");
  } //Close Announcement Bar on Click


  document.getElementById("announcement-close").addEventListener("click", function () {
    document.querySelector(".announcement-bar").style.display = "none";
    document.body.classList.remove("announcement-visible");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  var _searchSection$queryS;

  var header = document.getElementById("mainHeader");
  var nav = document.getElementById("navbarNavDropdown");
  var searchSection = document.getElementById("js-header-search-section");
  var searchBtn = document.getElementById("js__header-search-btn") || document.querySelector(".header .toggle-icon") || document.querySelector(".toggle-icon");
  var body = document.body; // 🧠 Check if page has hero section

  var hasHero = !!document.querySelector(".hero-banner, .inner-hero-section, .error-page, .collection-hero-section"); // 🔹 Shared header state manager

  window.updateHeaderState = function () {
    var menuOpen = nav === null || nav === void 0 ? void 0 : nav.classList.contains("active");
    var searchOpen = (searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.dataset.open) === "true";
    var scrollY = window.scrollY; // 🧩 For pages with NO hero → always white

    if (!hasHero) {
      header === null || header === void 0 ? void 0 : header.classList.add("white");
      header === null || header === void 0 ? void 0 : header.classList.remove("transparent");
      body.classList.add("white-header");
      return; // stop here — no other logic applies
    } // For hero pages — toggle normally


    if (menuOpen || searchOpen) {
      header === null || header === void 0 ? void 0 : header.classList.remove("transparent");
      header === null || header === void 0 ? void 0 : header.classList.add("white");
      body.classList.add("white-header");
    } else {
      body.classList.remove("white-header");

      if (scrollY > 33) {
        header === null || header === void 0 ? void 0 : header.classList.add("white", "fixed");
        header === null || header === void 0 ? void 0 : header.classList.remove("transparent");
      }
    }
  }; // 🔸 SEARCH TOGGLE LOGIC


  var searchInput = (_searchSection$queryS = searchSection === null || searchSection === void 0 ? void 0 : searchSection.querySelector(".search")) !== null && _searchSection$queryS !== void 0 ? _searchSection$queryS : null;

  function openSearchBar() {
    if (!searchSection || !searchBtn) return;
    searchSection.classList.add("visible");
    searchBtn.classList.add("active");
    searchBtn.dataset.open = "true";
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.focus();
    updateHeaderState();
  }

  function closeSearchBar() {
    if (!searchSection || !searchBtn) return;
    searchSection.classList.remove("visible");
    searchBtn.classList.remove("active");
    searchBtn.dataset.open = "false";
    updateHeaderState();
  }

  searchSection === null || searchSection === void 0 ? void 0 : searchSection.addEventListener("click", function (e) {
    return e.stopPropagation();
  });
  searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    e.preventDefault();
    searchBtn.dataset.open === "true" ? closeSearchBar() : openSearchBar();
  });
  document.addEventListener("click", function () {
    if ((searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.dataset.open) === "true") closeSearchBar();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && (searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.dataset.open) === "true") closeSearchBar();
  }); // 🔸 Update header on scroll and resize

  window.addEventListener("scroll", updateHeaderState);
  window.addEventListener("resize", updateHeaderState); // Initialize header state on load

  updateHeaderState();
}); // SUB MENU And BIG NAV

document.addEventListener("DOMContentLoaded", function () {
  var header = document.getElementById("mainHeader");
  var mainHeader = document.querySelector(".main-header");
  var hasHero = !!document.querySelector(".hero-banner, .inner-hero-section, .error-page, .collection-hero-section");
  document.querySelectorAll(".has-sub-nav").forEach(function (item) {
    var hideTimeout;
    var link = item.querySelector(".site-nav__link");
    var subNav = item.querySelector(".sub-nav");

    var showSubNav = function showSubNav() {
      clearTimeout(hideTimeout);
      link === null || link === void 0 ? void 0 : link.classList.add("hover-submenu");

      if (subNav) {
        Object.assign(subNav.style, {
          visibility: "visible",
          opacity: "1",
          zIndex: "1"
        });
        subNav.classList.add("active");
      } // Update header classes


      header === null || header === void 0 ? void 0 : header.classList.remove("transparent");
      header === null || header === void 0 ? void 0 : header.classList.add("white", "open-sub-menu"); // also mark open state

      mainHeader === null || mainHeader === void 0 ? void 0 : mainHeader.classList.remove("active"); // Close search if open

      document.querySelectorAll(".header-search-section.visible, .js__search.active").forEach(function (el) {
        return el.classList.remove("visible", "active");
      });
    };

    var hideSubNav = function hideSubNav() {
      hideTimeout = setTimeout(function () {
        link === null || link === void 0 ? void 0 : link.classList.remove("hover-submenu");

        if (subNav) {
          Object.assign(subNav.style, {
            visibility: "hidden",
            opacity: "0"
          });
          subNav.classList.remove("active");
        }

        var anyOpen = document.querySelector(".has-sub-nav .sub-nav.active");

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
    var header = document.getElementById("mainHeader");
    var hasHero = !!document.querySelector(".hero-banner, .inner-hero-section, .error-page, .collection-hero-section");
    document.querySelectorAll(".has-big-nav").forEach(function (item) {
      var link = item.querySelector(".site-nav__link");
      var bigNav = item.querySelector(".big-nav");
      item.addEventListener("click", function (event) {
        event.stopPropagation();
        var isActive = bigNav.classList.contains("active"); // ✅ Close SEARCH if it's open

        var searchBtn = document.getElementById("js__header-search-btn");
        var searchSection = document.getElementById("js-header-search-section");
        var isSearchOpen = (searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.dataset.open) === "true" || (searchSection === null || searchSection === void 0 ? void 0 : searchSection.classList.contains("visible"));

        if (isSearchOpen) {
          if (typeof window.closeSearchBar === "function") {
            window.closeSearchBar();
          } else {
            // fallback in case closeSearchBar isn't global
            searchSection === null || searchSection === void 0 ? void 0 : searchSection.classList.remove("visible");
            searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.classList.remove("active");
            if (searchBtn) searchBtn.dataset.open = "false";
          }
        } // Close all menus


        document.querySelectorAll(".has-big-nav .big-nav").forEach(function (bn) {
          bn.style.visibility = "hidden";
          bn.style.opacity = "0";
          bn.classList.remove("active");
        });
        document.querySelectorAll(".site-nav__link").forEach(function (lnk) {
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
    }); // Close on outside click

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".has-big-nav")) {
        document.querySelectorAll(".has-big-nav .big-nav").forEach(function (bn) {
          bn.style.visibility = "hidden";
          bn.style.opacity = "0";
          bn.classList.remove("active");
        });
        document.querySelectorAll(".site-nav__link").forEach(function (lnk) {
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
        opacity: "0"
      });
    }
  });
}); // Open MObile Menu

document.addEventListener("DOMContentLoaded", function () {
  var navLink = false;
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("navbarNavDropdown");
  var header = document.getElementById("mainHeader");
  var hideEls = document.querySelectorAll(".js__mobile-menu-open-hide, .js__mobile-announcement-text"); // 🔍 Check if page has hero/inner-banner/error-page

  var hasHero = !!document.querySelector(".hero-banner, .inner-hero-section, .error-page, .collection-hero-section"); // 🧠 Handles header state on scroll & nav open/close

  var updateHeaderState = function updateHeaderState() {
    var scrollY = window.scrollY; // 🧩 Pages without hero → always white, always white-header

    if (!hasHero) {
      header.classList.add("white");
      header.classList.remove("transparent");
      document.body.classList.add("white-header");
      return;
    } // 🧩 Pages with hero → normal behavior


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
  }; // 🍔 Toggles mobile menu


  var toggleMenu = function toggleMenu() {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");
    navLink = true;
    hideEls.forEach(function (el) {
      return nav.classList.contains("active") ? el.classList.add("active") : el.classList.remove("active");
    }); // Lock scroll when open (for mobile)

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
      document.querySelectorAll("body .boost-pfs-search-suggestion-group").forEach(function (el) {
        return el.style.display = "none";
      });
    }

    updateHeaderState();
  };

  hamburger.addEventListener("click", toggleMenu);
  hamburger.addEventListener("focus", function () {
    if (!navLink) toggleMenu();
  });
  window.addEventListener("resize", updateHeaderState);
  window.addEventListener("scroll", updateHeaderState); // Initialize header state on load

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
}); // Dynamic Mobile Nav Bar top according to the height of the header and the announcement

document.addEventListener("DOMContentLoaded", function () {
  var nav = document.getElementById("navbarNavDropdown");
  var header = document.getElementById("mainHeader");
  var announcement = document.querySelector(".announcement-bar");

  function isVisible(el) {
    return el && el.offsetParent !== null && el.offsetHeight > 0;
  }

  function setNavTop() {
    if (!nav || !header) return;
    var baseHeaderHeight = 60;
    var totalHeight = baseHeaderHeight;

    if (!header.classList.contains("fixed")) {
      // Only add announcement height when header is not fixed
      if (window.innerWidth < 981 && isVisible(announcement)) {
        totalHeight += announcement.offsetHeight;
      }
    }

    nav.style.top = "".concat(totalHeight, "px");
  } // Run on load


  setNavTop(); // Run on resize

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
    $(".js__big-nav-link").mousedown(function () {
      $(this).toggleClass("active"); // slide toggle the nav instead of class toggle

      $(".js__big-nav").stop(true, true).slideToggle(300);
      navLink = true;
    }).focus(function () {
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
    $(".js__sub-nav-link").mousedown(function (e) {
      $(this).toggleClass("active");
      $(".js__sub-nav").toggleClass("active");
      navLink = true;
    }).focus(function (e) {
      "use strict";

      if (navLink) {} else {
        $(this).toggleClass("active");
        $(".js__sub-nav").toggleClass("active");
      }
    });
  });
})(jQuery); // Close MOBILE SUB NAV ON CLICK BACK


(function ($) {
  $(function () {
    var navLink = false;
    $(".js__sub-nav-close").mousedown(function (e) {
      $(this).toggleClass("active");
      $(".js__sub-nav").toggleClass("active");
      navLink = true;
    }).focus(function (e) {
      "use strict";

      if (navLink) {} else {
        $(this).toggleClass("active");
        $(".js__sub-nav").toggleClass("active");
      }
    });
  });
})(jQuery); // Adding fixed class


document.addEventListener("DOMContentLoaded", function () {
  var header = document.getElementById("mainHeader");
  var heroBanner = document.querySelector(".hero-banner, .inner-hero-section, .error-page, .collection-hero-section");
  var announcement = document.querySelector(".announcement-bar");
  var hamburger = document.getElementById("hamburger");
  var sticky = header ? header.offsetTop : 0;

  function isSearchOpen() {
    return !!document.querySelector(".js__search.active, .header-search-section.visible, .header-search-section.active");
  }

  function checkScroll() {
    if (!header) return;

    if (window.pageYOffset > sticky) {
      header.classList.add("fixed");
      document.body.classList.add("header-fixed");
      header.classList.remove("transparent");
    } else {
      header.classList.remove("fixed");
      document.body.classList.remove("header-fixed"); // if (!isSearchOpen()) {
      //   header.classList.add("transparent");
      // } else {
      //   header.classList.remove("transparent");
      //   header.classList.add("white");
      // }
    }
  } // Run once and on scroll


  checkScroll();
  window.addEventListener("scroll", checkScroll); // Hamburger behavior

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      if (window.scrollY === 0 && announcement && announcement.offsetParent !== null) {
        header.classList.remove("fixed");
        document.body.classList.remove("header-fixed");
      } else {
        header.classList.add("fixed");
        document.body.classList.add("header-fixed");
      }
    });
  }
}); // Safe header manager — robust and defensive
"use strict";

var pdpThumbnail;
var pdpSlider;
$(document).ready(function ($) {
  var producrSlider = new Swiper('.js__pdp-recommendation-slider', {
    slidesPerView: 3,
    autoHeight: true,
    resistance: false,
    shortSwipes: true,
    spaceBetween: 40,
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next-product-recommed',
      prevEl: '.swiper-button-prev-product-recommed'
    },
    breakpoints: {
      0: {
        slidesPerView: 1
      },
      601: {
        slidesPerView: 2
      },
      981: {
        slidesPerView: 3
      }
    }
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
        767: {
          slidesPerView: "auto",
          direction: "horizontal"
        },
        768: {
          slidesPerView: 6,
          direction: "vertical"
        }
      }
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
          slidesPerView: 2
        },
        360: {
          slidesPerView: 2
        },
        // when window width is >= 480px
        401: {
          slidesPerView: 3
        },
        // when window width is >= 640px
        601: {
          slidesPerView: 4
        }
      }
    });
  }

  pdpSlider = new Swiper(".js__pdp-slider", {
    slidesPerView: 1,
    autoHeight: true,
    grabCursor: false,
    mousewheel: false,
    clickable: false,
    resistance: false,
    shortSwipes: true,
    spaceBetween: 12,
    loop: false,
    pagination: {
      el: ".swiper-pagination-pdp",
      clickable: true
    },
    navigation: {
      nextEl: ".swiper-button-next-pdp",
      prevEl: ".swiper-button-prev-pdp"
    },
    thumbs: {
      swiper: pdpThumbnail
    }
  });
  /*PDP tab section drop down change*/

  $(".js__pdp-tab-select").change(function () {
    $(".tab-content").removeClass("active");
    $(".tab-content").hide();
    $("#" + $(this).val()).show();
    $("#" + $(this).val()).addClass("active");
    $(".tab-link").removeClass("active");
    $("#tab-link-" + $(this).val()).addClass("active");
  });
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

  $(document).on("click", ".pdp-thumbnail li", function (e) {
    var slideno = $(this).index();
    $(".pdp-thumbnail li").removeClass("active");
    $(this).addClass("active");
    $(".pdp-slider").slick("slickGoTo", slideno);
    setTimeout(function () {
      $(".pdp-thumbnail").slick("slickGoTo", slideno);
    }, 500);
    /* var slideno = $(this).index();
             $(".pdp-thumbnail li").removeClass("active");
             $(this).addClass("active");
             console.log("slideno"+slideno);
       
             $(".pdp-slider").slick("slickGoTo", slideno);*/
  });
  /*Write review click*/

  $(".js__write-review-btn").click(function () {
    $(".yotpo-new-review-btn").click();
  });
  /*View details*/

  $(document).on("click", ".js__pdp-view-details", function (e) {
    e.preventDefault();
    $(".tab-link").removeClass("active");
    $(".tab-head li:first-child").children(".tab-link").addClass("active");
    $(".tab-content").removeClass("active");
    $(".tab-content:first-child").addClass("active");
    $(".tab-content").hide();
    $(".tab-content:first-child").show();
    $(".js__pdp-tab-select").val($(".tab-head li:first-child").children(".tab-link").attr("data-attr"));
    setTimeout(function () {
      var target = $(".tab-content:first-child");
      $("html, body").animate({
        scrollTop: target.offset().top - 350
      }, 500);
    }, 500);
  });
  /*Review star click*/

  $(document).on("click", ".js__review-section", function (e) {
    e.preventDefault();
    $(".tab-link").removeClass("active");
    $("#tab-link-reviews").addClass("active");
    $(".tab-content").removeClass("active");
    $("#reviews").addClass("active");
    $(".tab-content").hide();
    $("#reviews").show();
    $(".js__pdp-tab-select").val("Reviews");
    setTimeout(function () {
      var target = $("#reviews");
      $("html, body").animate({
        scrollTop: target.offset().top - 350
      }, 500);
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

  targetNodes.each(function () {
    bundleObersrver.observe(this, obsConfig);
  });

  function mutationHandler(mutationRecords) {
    //loop through all the mutations that just occured
    mutationRecords.forEach(function (mutation) {
      if (mutation.type == "childList") {
        //loop though the added nodes
        mutation.addedNodes.forEach(function (added_node) {
          // console.log($(".rc-container-wrapper").html())
          if ($(".rc-container-wrapper").html() != undefined) {
            //console.log("click recharge active");
            $(".label-recharge-info").remove();

            if ($(".js__subscribeText").html() != "") {
              $(".rc-option__subsave").append("<span class='label-recharge-info'>" + $(".js__subscribeText").html() + "</span>");
            }

            if ($(".js__onetimeText").html() != "") {
              $(".rc-option__onetime").append("<span class='label-recharge-info'>" + $(".js__onetimeText").html() + "</span>");
            }

            setTimeout(function () {
              $(".rc-option--active").click();
            }, 500);
            bundleObersrver.disconnect();
          }

          setTimeout(function () {
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


  $(document).on("change", ".rc_widget__option__plans__dropdown", function (e) {
    $(".rc-option--active").click();
  });
  $(document).on("click", ".rc_widget__option", function (e) {
    //console.log("onetime ");
    var price = $(this).find(".rc-option__price").html();
    $(".pdp-add-to-cart-price").html(price);
    $(".js__pdp-variant-select li.active").click();
  });
  /*Slider working End*/

  /* Call page load functions */

  setTimeout(function () {
    setColorThumbImages();
  }, 1000);
  /* FORMATTING: Loop Through each color thumb and set the images for them through the product color library object */

  function setColorThumbImages() {
    if ($(".js-variant-color-swatch li")[0]) {
      $(".js-variant-color-swatch  li").each(function (index) {
        var color = $(this).attr("data-color");
        var colorValue = getVariantColor(color); //$(this).children("div.color").css("background-color", colorValue);

        if (colorValue == "") {
          $(this).children("img").css("opacity", "0");
        }

        $(this).children("img").attr("src", colorValue);
      });
    }
  }
});
/*PENDING Get Variant Color*/

function getVariantColor(color) {
  try {
    var variantColorValue = "";
    $.each(prodColor, function (key, value) {
      if (color.toLowerCase() == value.title.toLowerCase()) {
        variantColorValue = value.color;
      }
    });
    /* $.each(prodLib, function (key, value) {
       if (color.toLowerCase() == value.option1.toLowerCase()) {
         variantColorValue = value.image;
       }
     });*/

    return variantColorValue;
  } catch (_unused) {}
}
/* Color swatch click*/


$(document).ready(function ($) {
  $(document).on("mouseenter", ".js__product-cart-color li", function () {
    var productID = $(this).attr("data-product-id");
    var variantImage = $(this).attr("data-image");
    var featuredImage = $(this).attr("data-featured_image");

    if (variantImage.indexOf("no-image-") == -1) {
      $(".js__product-image-" + productID).attr("src", variantImage);
    } else {
      $(".js__product-image-" + productID).attr("src", featuredImage);
    }
  });
  $(document).on("mouseleave", ".js__product-cart-color li", function () {
    var productID = $(this).attr("data-product-id");
    var featuredImage = $(".js__product-image-" + productID).attr("data-src");
    $(".js__product-image-" + productID).attr("src", featuredImage);
  });
});
"use strict";

var colorSelected = "";
var secondOptionVariantValue = "";
var thirdOptionVariantValue = "";
var selectedVariantID;
$(document).ready(function ($) {
  /* if no varient then active class added in product image section*/
  if (prodLib.length == 0) {
    $(".js-pdp-media").addClass("active");
    $(".js__pdp-thumbnail-slider li:first-child").addClass("active");
  }

  var colorPosition = $("#colorPosition").val();
  var numberOfAvailableOptions = parseInt($("#optionSize").val()); // on page load check the color position, and set 2nd and 3rd options values

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


  $(".js-product-single__quantity .js-plus-minus-qty").click(function () {
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
  }); // On DD change, fire the form DD element and also run the soldoutColorSwatches function

  $(".js__pdp-variant-select").change(function () {
    var optionIndex = $(this).attr("data-option");
    var optionValue = $(this).val();
    $("#product .product__form .options .option.option-" + optionIndex + " .label span").text(optionValue); // button  - Sold out and add to cart

    $("#product-select-option-" + optionIndex).val(optionValue).trigger("change");
    /*Checking if this is filter type then image filter code will work*/

    var OptionType = $(this).attr("data-type");
    var FilterType = $("#variantFilterType").val();

    if (OptionType == FilterType) {
      imageFilter(optionValue);
    }

    var selectedVariant = $("#product-select :selected").text().replace("- sold out!", "");
    $(".js__product-variant-selected").html(selectedVariant);
    $(".rc-option--active").click(); //color swatch - sold out working

    SoldOutUnavailableOnColorSwatches(colorSelected);
  });
  $(document).on("click", ".js__pdp-variant-select li", function () {
    var optionIndex = $(this).attr("data-option");
    var optionValue = $(this).attr("data-value");
    var optionType = $(this).parent("ul").attr("data-type");
    $(this).parent("ul").children("li").removeClass("active");
    $(this).addClass("active");
    $("#product-select-option-" + optionIndex).val(optionValue).trigger("change");
    $("#product-select").change();
    /*Checking if this is filter type then image filter code will work*/

    try {
      var FilterType = $("#variantFilterType").val();

      if (optionType == FilterType) {
        imageFilter(optionValue);
      }
    } catch (_unused) {} // button  - Sold out and add to cart


    try {
      SoldOutUnavailableOnColorSwatches(colorSelected);
    } catch (_unused2) {} //color swatch - sold out working

  });
  $(".js__pdp-variant-select li.active").click();
  $(".js__color-swatches").click(function () {
    // remove active class - from all the li's
    $('.js__color-swatches').removeClass('active'); // add class on the one which is clicked

    $(this).addClass('active');
    var optionindex = $(this).data('option');
    var thevalue = $(this).data('value'); //show the selected value

    $('.variant-option.option-' + optionindex + ' .label span').text(thevalue); // trigger change

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
    thumbColorSelected = thumbColorSelected.replace(/---/g, "-"); // $(".pdp-slider").slick("slickUnfilter");
    //   $(".js__pdp-thumbnail-slider").slick("slickUnfilter");

    $(".pdp-slider").find(".all").addClass(thumbColorSelected.toLowerCase());
    $(".js__pdp-thumbnail-slider").find(".all").addClass(thumbColorSelected.toLowerCase()); //   $(".pdp-slider").slick("slickFilter", "." + thumbColorSelected.toLowerCase());
    //  $(".js__pdp-thumbnail-slider").slick( "slickFilter","." + thumbColorSelected.toLowerCase());

    $(".js__pdp-thumbnail-slider .swiper-slide").removeClass("active"); //$(".js__pdp-thumbnail-slider").slick("refresh");

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
            slidesPerView: 2
          },
          // when window width is >= 480px
          480: {
            slidesPerView: 3
          },
          // when window width is >= 640px
          601: {
            slidesPerView: 'auto'
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
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next-pdp",
        prevEl: ".swiper-button-prev-pdp"
      },
      thumbs: {
        swiper: pdpThumbnail
      }
    });
    /*Selected first variant image in slider which have no all class*/

    var boolVariantFirstImage = false;
    $(".js__pdp-thumbnail-slider  li").each(function () {
      if (!$(this).hasClass("all")) {
        if (boolVariantFirstImage == false) {
          $(this).click();
          $(this).addClass("active");
          boolVariantFirstImage = true;
        }
      }
    });
    /*When we dont have any variant image*/

    if (boolVariantFirstImage == false) {
      $(".js__pdp-thumbnail-slider li:first-child").addClass("active");
      $(".js__pdp-thumbnail-slider li:first-child").click();
    }

    colorSelected = selectedValue;
  } // main sold out and unavailable working


  function SoldOutUnavailableOnColorSwatches(colorSelected) {
    getColorPosition(); // Remove out of stock and unavailable from color swatches

    $(".js__color-swatches").removeClass("out-of-stock");
    $(".js__color-swatches").removeClass("unavailable");
    var colorLength = $(".js__color-swatches").length;
    var colorCount = 1;
    /*
    Loop Through each input radio for the color
    */
    // we are using color swatch working for other options when they are radio buttons

    $(".js__color-swatches").each(function (index) {
      var colorValue = $(this).attr("data-value");
      var checkColorOptionExists = false;
      /* 
       Loop through product library object for variant 
       and if variant select matches and quantity = 0 then show out of stock message
       */

      /*
      PENDING - Merge - ProdLib Each Function
      */

      $.each(prodLib, function (key, value) {
        var itemQuantity = value.quantity;
        var itemAvailable = value.available;
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
          if (secondOptionVariantValue.toLowerCase() == prodSecondOptionValue.toLowerCase() && thirdOptionVariantValue.toLowerCase() == prodThirdOptionValue.toLowerCase()) {
            {
              //check if quantity>1 then set the color swatch - Out of stock
              setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
            }
          }
        } else if (numberOfAvailableOptions == 2) {
          /*two matching option checking quantity if 0 then showing out of stock */
          if (prodSecondOptionValue.toLowerCase() == secondOptionVariantValue.toLowerCase()) {
            {
              //check if quantity>1 then set the color swatch - Out of stock
              setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
            }
          }
        } else {
          //check if quantity>1 then set the color swatch - Out of stock
          setColorSwatchOutofStock(colorOption, itemQuantity, itemAvailable);
        }

        if (prodColorOptionValue == colorValue) {
          if (numberOfAvailableOptions == 3) {
            if (prodSecondOptionValue.toLowerCase() == secondOptionVariantValue.toLowerCase() && prodThirdOptionValue.toLowerCase() == thirdOptionVariantValue.toLowerCase()) {
              checkColorOptionExists = true;
            }
          } else if (numberOfAvailableOptions == 2) {
            if (prodSecondOptionValue.toLowerCase() == secondOptionVariantValue.toLowerCase()) {
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
        $(".js__color-swatches[data-type-value=" + colorOption + "]").removeClass("out-of-stock");
        $(".js__color-swatches[data-type-value=" + colorOption + "]").addClass("unavailable");

        if ($(".js__color-swatches[data-type-value=" + colorOption + "]").hasClass("active")) {
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
    } catch (_unused3) {}
  }

  function setColorSwatchOutofStock(prodColor, prodQuantity, prodAvailability) {
    if (prodQuantity < 1 && prodAvailability == "false") {
      $(".js__color-swatches[data-type-value=" + prodColor + "]").addClass("out-of-stock");
    }
  }

  $(window).scroll(function () {
    var sticky = $(".product__media-outer"),
        scroll = $(window).scrollTop();
    var pos = sticky.height();

    if (scroll >= 768 & scroll <= pos - 690) {
      sticky.addClass("fixed"); // $(".main-content").addClass("active");
    } else {
      sticky.removeClass("fixed"); // $(".main-content").removeClass("active");
    }
  }); // show para on click read More button

  $(".js__read-more_btn").click(function () {
    $(".js__read-less-content").addClass("hide");
    $(".js__read-more-content").removeClass("hide");
  });
  $(".js__read-less_btn").click(function () {
    $(".js__read-less-content").removeClass("hide");
    $(".js__read-more-content").addClass("hide");
  });
});