import {prepareSlider} from "./index.js";
import {prepareSubjectItems} from "./learn.js";
import {createCodeViews} from './article.js';
import {loadAllUiComponents, scrollTopVisibility} from './base.js';
import {applySEOConfigurations} from "./seo-config.js";
import * as fileloader from './fileloader.js';

fileloader.loadStylesheet(
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
  "sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi",
  "anonymous"
);

fileloader.loadJavaScript(
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js",
  "sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3",
  "anonymous"
);

fileloader.loadJavaScript(
  "https://code.jquery.com/jquery-3.6.1.min.js",
  "sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=",
  "anonymous"
);


function executeCodes() {

  window.onscroll = scrollTopVisibility;
  createCodeViews();
  loadAllUiComponents();

  var path = window.location.pathname;

  //check if the path is index page
  if (path === "/") {
    prepareSlider();
  }

  //check if the file path origins from learn
  if (path.startsWith("/learn")) {
    prepareSubjectItems();
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
