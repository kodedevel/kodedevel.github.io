import {initSlider} from "./index.js";
import {createCodeViews} from "./article.js";
import {initUiComponents, scrollTopVisibility} from "./base.js";
import {applySEOConfigurations} from "./seo-config.js";

function executeCodes() {
  window.onscroll = scrollTopVisibility;
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
