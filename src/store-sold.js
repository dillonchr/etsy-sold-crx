((numberOfSimultaneousRequests = 1) => {
    const priceCurrency = /"priceCurrency": "([A-Z]+)",/;
    //  this prevents the need to parse XML/JSON, but introduces risks of format changing
    const priceRegex = /"highPrice": "([0-9 .,]+)[,.](\d{2})"/;
    //  risky as well, depends on too much classiness
    const cards = Array.from(document.querySelectorAll('.v2-listing-card a.listing-link, a.buyer-card.card'));
    //  default to no unit
    let currencyPrefix = '';
    const getCurrencyPrefix = (match) => {
        if (match && match.length) {
            switch (match[1]) {
                case 'USD':
                case 'CAD':
                case 'AUD':
                    return '$';
                case 'EUR':
                    return '€';
                case 'GBP':
                    return '£';
                default:
                    return match[1];
            }
        }
    };
    //  brutishly simple async attempt
    const queue = cards.map(elem => {
        //  url with the required json+ld
        const url = elem.getAttribute('href').replace(/\?(ref=.*)$/, '?show_sold_out_detail=1');
        //  append price (or message) to the little `Sold` badge on each card.
        const updateSoldLabel = price => elem
            .querySelector('.n-listing-card__price, .text-gray span')
            .insertAdjacentHTML('beforeend', `<span style="color:red;margin-left:1em;">${price}</span>`);
        //  callback to delay the fetch
        return () => {
            //  download page
            return fetch(url)
                //  dump response
                .then(r => r.ok && r.text())
                .then(html => {
                    if (!currencyPrefix) {
                        currencyPrefix = getCurrencyPrefix(html.match(priceCurrency));
                    }
                    //  try to parse out the price
                    const priceMatch = html.match(priceRegex);
                    if (priceMatch && priceMatch.length > 1) {
                        pageTotal += parseFloat(`${priceMatch[1]}.${priceMatch[2]}`);
                        updateSoldLabel(`${currencyPrefix}${priceMatch[1]}`);
                    } else {
                        //  haven't seen this happen yet, but just in case
                        updateSoldLabel('N/A');
                    }
                })
                //  catch any unexpected request closures
                .catch(err => {
                    updateSoldLabel('ERROR');
                    console.error('Etsy Sold! :: Store Page Error', err);
                });
        };
    });

    //    shows the sum of all sold prices on current page in header next to sales count
    const printPageTotal = () => document
                .querySelector('.flag-body .text-gray-lightest')
                .insertAdjacentHTML('beforeend', `<span style="color:red;margin-left:1em;">${currencyPrefix}${pageTotal.toFixed(2)} on this page</span>`);

    //    sum all found prices for the current page
    let pageTotal = 0;

    //  this method will take the first request from the stack
    //  and keep calling itself until the stack's empty
    //  using the name thread gives the idea that it's its own process
    const thread = () => {
        if (queue.length) {
            const next = queue.shift();
            //    last one out, gets the lights
            next().then(queue.length === 0 ? printPageTotal : thread);
        }
    };

    //  this creates as many "thread"s as requested
    //  keep this low to prevent ui thrashing and possibly even network troubles
    const requests = Array(numberOfSimultaneousRequests)
        .fill(0)
        .forEach(thread);
})(4);
