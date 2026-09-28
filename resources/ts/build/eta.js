async function estimateCourseReadingTime(courseItem, subjectPaths, intervalId) {
    let courseETA = 0;
    for (const path of subjectPaths) {
        const pageETA = await estimateSinglePageReadingTime(path);
        courseETA += pageETA;
    }
    const etaBadge = courseItem.querySelector(".badge-data");
    etaBadge.innerHTML = '' + courseETA;
    clearInterval(intervalId);
}
async function estimateSinglePageReadingTime(path) {
    let totalETA = 0;
    try {
        const pageResponse = await fetch(path, {
            headers: {
                method: "GET",
                "Content-Type": "text/html"
            }
        });
        const text = await pageResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const article = doc.querySelector("article");
        const textETA = estimateRegularTextReadingTime(article);
        const snippetETA = estimateSnippetReadingTime(article);
        totalETA = textETA + snippetETA;
    }
    catch (err) {
        console.error(err);
    }
    return totalETA;
}
function estimateRegularTextReadingTime(article) {
    var numberOfWords = 0;
    const texts = article.innerText.trim().split(/\n|\s/);
    texts.forEach((line) => {
        if (line.length > 0)
            numberOfWords++;
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
export { estimateCourseReadingTime, estimateSinglePageReadingTime };
//# sourceMappingURL=eta.js.map