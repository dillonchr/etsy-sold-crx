(() => {
    //    lets us know if we should look for the sold price or not
    function isSoldListing() {
        return !!document.querySelector('.btn-transaction.disabled') || window.location.search.includes('show_sold_out');
    }

    //    parses etsy event stream for sold price
    function getSoldPrice() {
        try {
            if (isSoldListing()) {
                const seoData = JSON.parse(document.querySelector(`script[type='application/ld+json']`).innerHTML).offers;
                return {currency: seoData.priceCurrency, price: parseFloat(seoData.highPrice).toFixed(2)};
            }
        } catch (ignore) {
            return;
        }
    }

    //    injects element in the style of the normal price
    function displaySoldPrice({currency, price}) {
        document.querySelector('#listing-properties, .buy-box__buttons')
            .insertAdjacentHTML('beforebegin', `<span style='float:left;color:red;font-size:20px;font-weight:bold;'><span class='currency-symbol'>${currency === 'USD' ? '$' : currency}</span><span class='currency-value'>${price}</span></span>`);
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
    if (document.readyState !== 'loading') {
        showPrice();
    //    or maybe we need to let content settle before scraping
    } else {
        window.addEventListener('DOMContentLoaded', showPrice);
    }
})();
