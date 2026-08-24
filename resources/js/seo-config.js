import {estimateRegularTextReadingTime, estimateSnippetReadingTime} from "./base.js"

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



function applyOnDisplayPersianDates() {
  const datePublishedEl = document.getElementById("publish-date");

  if (datePublishedEl && datePublishedEl.dateTime != null) {

    const datePublished = new Date(datePublishedEl.dateTime.trim());
    datePublishedEl.dateTime = datePublished.toISOString();

    if (!isNaN(datePublished.getTime())) {
      datePublishedEl.textContent = " " + toPersianDate(datePublished);
    }
  }

  const dateModifiedEl = document.getElementById("lastmod-date");

  if (dateModifiedEl && dateModifiedEl.dateTime != null) {

    const dateModified = new Date(dateModifiedEl.dateTime.trim());
    dateModifiedEl.dateTime = dateModified.toISOString();

    if (!isNaN(dateModified.getTime()))
      dateModifiedEl.textContent = " " + toPersianDate(dateModified);

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
