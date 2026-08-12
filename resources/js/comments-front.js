function switchToLiveComments() {
  const staticComments = document.getElementById("static-comments");
  const liveComments = document.querySelector(".giscus");

  window.addEventListener("message", event => {

    if (event.origin !== 'https://giscus.app')
      return;

    if (event.data && event.data.giscus && event.data.giscus.discussion) {

      if (staticComments) {
        staticComments.style.display = 'none';
      }

      if (liveComments) {
        liveComments.style.display = 'block';
      }

    }

  });

  setTimeout(function () {
    if (liveComments && liveComments.querySelector('iframe')) {

      if (staticComments)
        staticComments.style.display = 'none';

      liveComments.style.display = 'block';
    }

  }, 6000);

}


export {switchToLiveComments}
