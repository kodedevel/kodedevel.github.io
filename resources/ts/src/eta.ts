async function estimateCourseReadingTime(courseItem: HTMLElement, subjectPaths: string[], intervalId: number) {

  let courseETA = 0;

  for (const path of subjectPaths) {

    const pageETA = await estimateSinglePageReadingTime(path);
    courseETA += pageETA;

  }

  const etaBadge = courseItem.querySelector(".badge-data")! as HTMLElement;
  etaBadge.innerHTML = '' + courseETA;

  clearInterval(intervalId);

}

async function estimateSinglePageReadingTime(path: string): Promise<number>{
  
  let totalETA = 0;

  try{
    
    const pageResponse = await fetch(path, {
        headers: {
          method: "GET",
          "Content-Type": "text/html"
        }
      });

      const text = await pageResponse.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const article = doc.querySelector("article") as Node;

      const textETA = estimateRegularTextReadingTime(article);
      const snippetETA = estimateSnippetReadingTime(article);

      totalETA = textETA + snippetETA;

  }catch(err){
    console.error(err);    
  }

  return totalETA
}

function estimateRegularTextReadingTime(article: Node) {
  var numberOfWords = 0;
  const texts = (article as HTMLElement).innerText.trim().split(/\n|\s/);
  texts.forEach((line) => {
    if (line.length > 0) numberOfWords++;
  });

  return Math.max(1, Math.ceil(numberOfWords / 250));
}

function estimateSnippetReadingTime(article: Node) {

  var numberOfWords = 0;

  const containers = (article as HTMLElement).querySelectorAll(".snippet-container");

  containers.forEach(container => {
    const snippet = container.firstElementChild! as HTMLElement;
    const text = snippet.innerText.split(/[\s\n]/g);
    text.forEach(word => {

      if (word.length > 0)
        numberOfWords++;
    });
  });


  return Math.ceil(numberOfWords / 100);
}


export {
    estimateCourseReadingTime,
    estimateSinglePageReadingTime
}