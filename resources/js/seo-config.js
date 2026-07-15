function estimateTotalReadingTime() {
  const article = document.querySelector("article");

  if (!article) return;

  const clone = article.cloneNode(true);

  const etaForCodes = estimateSnippetReadingTime(clone);

  const etaForTexts = estimateRegularTextReadingTime(clone);

  const totalETA = etaForCodes + etaForTexts;

  const eta = document.querySelector(".eta");

  if (eta != null)
    eta.lastElementChild.textContent = `زمان مطالعه ${totalETA} دقیقه`;
}

function estimateRegularTextReadingTime(article) {
  var numberOfWords = 0;
  const texts = article.innerText.trim().split(/\n|\s/);
  texts.forEach((line) => {
    if (line.length > 0) numberOfWords++;
  });

  return Math.max(1, Math.ceil(numberOfWords / 250));
}

function estimateSnippetReadingTime(article) {

  var numberOfWords = 0;

  const containers = article.querySelectorAll(".snippet-container");

  containers.forEach(container => {
    const snippet = container.firstElementChild;
    const text = snippet.innerText.split(/[\s\n]/g);
    text.forEach(word => {

      if (word.length > 0)
        numberOfWords++;
    });
  });


  return Math.ceil(numberOfWords / 100);
}

function applyOnDisplayPersianDates() {
  const publishDateEl = document.getElementById("publish-date");

  if (publishDateEl && publishDateEl.dateTime != null) {
    const publishDate = new Date(publishDateEl.dateTime.trim());

    if (!isNaN(publishDate.getTime()))
      publishDateEl.textContent = " " + toPersianDate(publishDate);
  }

  const lastmodDateEl = document.getElementById("lastmod-date");

  if (lastmodDateEl && lastmodDateEl.dateTime != null) {
    const lastmodDate = new Date(lastmodDateEl.dateTime.trim());

    if (!isNaN(lastmodDate.getTime()))
      lastmodDateEl.textContent = " " + toPersianDate(lastmodDate);
  }
}

function toPersianDate(gregorianDate) {
  const calendarFormatter = new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return calendarFormatter.format(gregorianDate);
}

function applySEOConfigurations() {
  estimateTotalReadingTime();
  applyOnDisplayPersianDates();
}

export {applySEOConfigurations};
