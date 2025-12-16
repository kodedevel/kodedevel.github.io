const BASE_URL = "https://kodedevel.github.io";
const URL = BASE_URL + window.location.pathname;

function applyCanonical() {
  const head = document.querySelector("head");
  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = URL;
  head.insertBefore(link, head.firstElementChild);
}

function estimateTotalReadingTime() {
  const article = document.querySelector("article");

  if (!article) return;

  const clone = article.cloneNode(true);

  const etaForCodes = estimateSnippetReadingTime(clone);

  const etaForTexts = estimateRegularTextReadingTime(clone);

  const totalETA = etaForCodes + etaForTexts;

  const eta = document.querySelector(".eta");

  if (eta != null) eta.lastElementChild.textContent = `زمان مطالعه ${totalETA} دقیقه`;

}

function estimateRegularTextReadingTime(article) {
  var numberOfWords = 0;
  const texts = article.innerText.trim().split(/\n|\s/);
  texts.forEach(line => {if (line.length > 0) numberOfWords++;});

  return Math.max(1, Math.ceil(numberOfWords / 200));
}

function estimateSnippetReadingTime(article) {
  var numberOfWords = 0;
  article.querySelectorAll("pre").forEach(child => {
    const text = child.innerText.trim().split(/\n|\s/);
    text.forEach(line => {if (line.length > 0) numberOfWords++;});
    //remove pre (code snippet) to make sure it won't be calculated for regular text.
    child.remove();
  });

  return Math.max(1, Math.ceil(numberOfWords / 100));
}

function applySEOConfigurations() {
  estimateTotalReadingTime();
  applyCanonical();
}

export {applySEOConfigurations};

