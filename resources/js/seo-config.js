window.SITE_URL = "https://kodedevel.github.io";
const url = window.SITE_URL + window.location.pathname;

function applyOGURL() {
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
}

function applyCanonical() {
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
}

function applySEOConfigurations() {

  if (!window.SITE_URL) return;

  applyOGURL();
  applyCanonical();

}

export {applySEOConfigurations};


