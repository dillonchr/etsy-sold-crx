export default {
    //    lets us know if we should look for the sold price or not
    get isSoldListing() {
        return !!document.querySelector('.btn-transaction.disabled') || window.location.search.includes('show_sold_out');
    },
    //    parses etsy event stream for sold price
    getSoldPrice() {
        try {
            if (this.isSoldListing) {
                const seoData = JSON.parse(document.querySelector(`script[type='application/ld+json']`).innerHTML).offers;
                return {currency: seoData.priceCurrency, price: parseFloat(seoData.highPrice).toFixed(2)};
            }
        } catch (ignore) {
            return;
        }
    },
    //    injects element in the style of the normal price
    displaySoldPrice({currency, price}) {
        document.querySelector('#listing-properties, .buy-box__buttons')
            .insertAdjacentHTML('beforebegin', `<span style='float:left;color:red;font-size:20px;font-weight:bold;'><span class='currency-symbol'>${currency === 'USD' ? '$' : currency}</span><span class='currency-value'>${price}</span></span>`);
    },
    //    conditionally injects the price
    //    on the condition that we can reliably find the price
    showPrice() {
        const p = this.getSoldPrice();
        if (p) {
            this.displaySoldPrice(p);
        }
    }
};
