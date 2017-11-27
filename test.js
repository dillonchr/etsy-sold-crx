const { JSDOM } = require('jsdom');
const test = require('tape');
const testUrl = 'https://www.etsy.com/listing/522536487/vintage-french-kepi?show_sold_out_detail=1';
import es from 'etsy-sold';

test('exists', t => {
    t.plan(1);

    t.equal(!!es && es.hasOwnProperty('getSoldPrice'), true);
});
