window.SITE_URL = "https://kodedevel.github.io";
const url = window.SITE_URL + window.location.pathname;
const faviconURL = window.SITE_URL + "/resources/favicon.png"

function applyOGURL() {
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", url);
}

function applyOGImage() {
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", faviconURL)
}

function applyCanonical() {
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
}

function applySEOConfigurations() {

  if (!window.SITE_URL) return;

  applyOGURL();
  applyOGImage();
  applyCanonical();

}

export {applySEOConfigurations};

