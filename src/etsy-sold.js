(() => {
    function isSoldListing() {
        return !!document.querySelector('.btn-transaction.disabled') ||
            window.location.search.includes('show_sold_out');
    }

    function getCurrencyPrefix(currency) {
        switch (currency) {
            case 'USD':
            case 'CAD':
            case 'AUD':
                return '$';
            case 'EUR':
                return '€';
            case 'GBP':
                return '£';
            default:
                return currency;
        }
    }

    //    parses etsy event stream for sold price
    function getSoldPrice() {
        try {
            if (isSoldListing()) {
                const seoData = JSON.parse(document.querySelector(`script[type='application/ld+json']`).innerHTML).offers;

                return {
                    currency: seoData.priceCurrency,
                    price: seoData.highPrice
                };
            }
        } catch (ignore) { }
    }

    //    injects element in the style of the normal price
    function displaySoldPrice({currency, price}) {
        const currencySymbol = getCurrencyPrefix(currency);
        const htmlToInject = `<p style='color:red;margin-bottom:1rem;font-size:20px;font-weight:bold;'>${currencySymbol} ${price}</p>`;
        //  try old querySelector first
        let hookElement = document.querySelector('#listing-properties, .buy-box__buttons');
        if (hookElement) {
            //  if it's found, inject price before tag
            hookElement.insertAdjacentHTML('beforebegin', htmlToInject);
        } else {
            //  otherwise look for current layout as of 9-16-19
            hookElement = document.querySelector('[data-buy-box-region="price"] .text-gray-lighter.text-body-smaller');
            //  if it's there
            if (hookElement) {
                //  add before the tag closes
                hookElement.insertAdjacentHTML('beforeend', htmlToInject);
            }
        }
        //  always print the currency/price
        console.log('%cETSY SOLD!', 'background-color:#F56400;color:white;', currencySymbol, price);
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
