const BASE_URL = "https://kodedevel.github.io";
const URL = BASE_URL + window.location.pathname;

function applyCanonical() {
  const head = document.querySelector("head");
  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = URL;
  head.insertBefore(link, head.firstElementChild);
}

function applySEOConfigurations() {
  applyCanonical();
}

export {applySEOConfigurations};

