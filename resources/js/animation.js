export function animatePendingOperation(parent) {
  const dots = parent.querySelectorAll('.dot');

  let currentIndex = 0;
  let previousIndex = dots.length - 1;

  return window.setInterval(() => {

    scaleDotDown(dots[previousIndex]);
    scaleDotUp(dots[currentIndex]);

    previousIndex = currentIndex;

    if (currentIndex === dots.length - 1) {
      currentIndex = 0;
    } else {
      previousIndex = currentIndex;
      currentIndex++;
    }
  }, 300);
}

function scaleDotUp(dot) {
  dot.style.scale = '2';
}

function scaleDotDown(dot) {
  dot.style.scale = '1';
}
