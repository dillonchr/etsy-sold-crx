setTimeout(() => {
    //    kick it all off
    //    ready for parsing
    if (document.readyState !== 'loading') {
        EstySold.showPrice();
    //    or maybe we need to let content settle before scraping
    } else {
        window.addEventListener('DOMContentLoaded', EstySold.showPrice);
    }
}, 10);
