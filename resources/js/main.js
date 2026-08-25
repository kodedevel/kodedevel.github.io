import {initSlider} from "./index.js";
import {createCodeViews} from "./article.js";
import {initUiComponents, scrollTopVisibility} from "./base.js";
import {applySEOConfigurations} from "./seo-config.js";
import 'https://esm.sh/giscus';

let isOnDocumentClicked = false;
let hashStack = [];

function clearHashStack() {
  while (hashStack.length > 0)
    hashStack.pop();
}

function handleBrowserBackButton() {

  document.onclick = function () {
    isOnDocumentClicked = true;
  }

  window.onhashchange = function () {

    const url = new URL(window.location.href);

    if (isOnDocumentClicked) {
      isOnDocumentClicked = false;
      hashStack.push(url.hash);
      return;
    } else {

      isOnDocumentClicked = false;

      if (hashStack.length === 0) {
        history.back();
      } else {
        clearHashStack();
        window.scrollTo({top: 0, behavior: "smooth"});
      }

    }

  }

}

function initAnalytics() {
  const measureId = 'G-S74CG697B9';

  window.dataLayer = window.dataLayer || [];

  function gtag(...args) {
    window.dataLayer.push(args);
  }

  gtag('js', new Date());
  gtag('config', measureId);
}

function executeCodes() {

  initAnalytics();

  handleBrowserBackButton();

  //window.onscroll = scrollTopVisibility;
  //
  window.addEventListener("scroll", scrollTopVisibility);
  createCodeViews();
  initUiComponents();

  var path = window.location.pathname;

  //check if the path is index page
  if (path === "/") {
    initSlider();
  }

  //apply all neccessary configurations for seo
  applySEOConfigurations();

}

function start() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", executeCodes);
  } else {
    executeCodes();
  }
}

start();
