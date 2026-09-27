/*
  Views for code styling usable in article.js
*/
function createSampleHeader() {
    var codeHead = document.createElement("div");
    codeHead.classList.add("sample-head");
    var copyButton = document.createElement("button");
    copyButton.classList.add("md-bt", "md-bt-light", "material-symbols-outlined");
    copyButton.innerHTML = "content_copy";
    codeHead.appendChild(copyButton);
    return codeHead;
}
function createDropMenu(create) {
    var dropMenuContainer = document.createElement("div");
    dropMenuContainer.classList.add("drop-menu-container");
    create(dropMenuContainer);
    return dropMenuContainer;
}
function createSnippetSelector(name, id, appendable) {
    let snippetToggleButton = document.createElement("input");
    snippetToggleButton.classList.add("snippet-toggle-button");
    snippetToggleButton.type = "radio";
    snippetToggleButton.id = id;
    snippetToggleButton.name = name;
    let snippetToggleLabel = document.createElement("label");
    snippetToggleLabel.htmlFor = snippetToggleButton.id;
    appendable(snippetToggleButton, snippetToggleLabel);
}
function createCodeWrap() {
    var codeWrap = document.createElement("div");
    codeWrap.classList.add("code-wrap");
    return codeWrap;
}
function createCodeTableView(codeWrap, callback) {
    var table = document.createElement("table");
    var tBody = table.createTBody();
    tBody.classList.add("code-body");
    callback(table, tBody);
    codeWrap.appendChild(table);
}
//for slider in main page
function createDot() {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    return dot;
}
function createSearchResultItem(title, url) {
    const resultItem = document.createElement("div");
    resultItem.classList.add('search-result-item');
    const anchor = document.createElement("a");
    anchor.href = url;
    const text = document.createElement("span");
    text.innerHTML = title;
    anchor.appendChild(text);
    resultItem.appendChild(anchor);
    return resultItem;
}
export { 
//createCourseListView,
createSampleHeader, createDropMenu, createSnippetSelector, createCodeWrap, createCodeTableView, createDot, createSearchResultItem };
//# sourceMappingURL=ui.js.map