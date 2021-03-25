/* global chrome */
(() => {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("etsy-sold.js");
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);
})();
