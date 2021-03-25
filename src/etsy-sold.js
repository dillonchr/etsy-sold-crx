(() => {
  function isSoldListing() {
    return (
      !!document.querySelector(".btn-transaction.disabled") ||
      window.location.search.includes("show_sold_out")
    );
  }

  //    parses etsy event stream for sold price
  function getSoldPrice() {
    if (isSoldListing()) {
      try {
        if (
          "Etsy" in window &&
          "Context" in window.Etsy &&
          "data" in window.Etsy.Context
        ) {
          const { data } = window.Etsy.Context;
          return `${data.currency_data.symbol}${data.listing_price.toFixed(2)}`;
        }

        //  backup, old code
        const seoData = JSON.parse(
          document.querySelector("script[type='application/ld+json']").innerHTML
        ).offers;

        return {
          currency: seoData.priceCurrency,
          price: seoData.highPrice
        };
      } catch (ignore) {
        //pass
      }
    }
  }

  //    injects element in the style of the normal price
  function displaySoldPrice(price) {
    const htmlToInject = `<p style='color:red;margin-bottom:1rem;font-size:20px;font-weight:bold;'>${price}</p>`;
    //  try old querySelector first
    let hookElement = document.querySelector(
      "#listing-properties, .buy-box__buttons"
    );
    if (hookElement) {
      //  if it's found, inject price before tag
      hookElement.insertAdjacentHTML("beforebegin", htmlToInject);
    } else {
      //  otherwise look for current layout as of 9-16-19
      hookElement = document.querySelector("[data-buy-box-region='price']");
      //  if it's there
      if (hookElement) {
        //  add before the tag closes
        hookElement.insertAdjacentHTML("beforeend", htmlToInject);
      }
    }
    //  always print the currency/price
    //  eslint-disable-next-line
    console.log("%cETSY SOLD!", "background-color:#F56400;color:white;", {
      price
    });
  }

  //    conditionally injects the price
  //    on the condition that we can reliably find the price
  function showPrice() {
    const p = getSoldPrice();
    if (p) {
      displaySoldPrice(p);
    }
  }

  //    kick it all off
  //    ready for parsing
  if (document.readyState !== "loading") {
    showPrice();
    //    or maybe we need to let content settle before scraping
  } else {
    window.addEventListener("DOMContentLoaded", showPrice);
  }
})();
