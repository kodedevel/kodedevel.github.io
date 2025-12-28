import { createDot } from "./ui.js";

const sliderWrapper = document.querySelector(".slider-wrapper");

const slides = document.querySelectorAll(".slide");
const totalNumberOfSlides = slides.length;

let currentIndex = 0;

function initSlider() {
  const btNext = document.querySelector(".next");
  btNext.addEventListener("click", slideNext);

  const btPrev = document.querySelector(".prev");
  btPrev.addEventListener("click", slidePrev);

  createDots();
  setInterval(slidePrev, 4000);
}

function updateSlider() {
  const slideWidth = slides[0].clientWidth;

  //since the direction is rtl so the currentIndex is positive to transform images correctly.
  const offset = currentIndex * slideWidth;

  sliderWrapper.style.transform = `translateX(${offset}px)`;

  updateDots();
}

function slideNext() {
  currentIndex = currentIndex > 0 ? currentIndex - 1 : totalNumberOfSlides - 1;
  updateSlider();
}

function slidePrev() {
  currentIndex = currentIndex < totalNumberOfSlides - 1 ? currentIndex + 1 : 0;
  updateSlider();
}

function createDots() {
  const sliderDotsWrapper = document.querySelector(".slider-dots-wrapper");

  for (var i = 0; i < totalNumberOfSlides; i++) {
    const dot = createDot();
    dot.dataset.index = i;

    dot.addEventListener("click", () => {
      currentIndex = dot.dataset.index;
      updateSlider();
    });

    sliderDotsWrapper.appendChild(dot);
  }

  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");

  dots.forEach((dot, index) => {
    if (index === currentIndex) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

export { initSlider };
