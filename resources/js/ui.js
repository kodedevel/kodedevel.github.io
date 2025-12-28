/*
  Views which appear in sidebar.
 */

//create list view for a course to show its content links inside sidebar
function createCourseListView(courseData) {
  var parent = document.createElement("div");

  var btExpand = createExpandableButton(courseData);

  var subjectListContainer = document.createElement("div");
  subjectListContainer.classList.add("subject-list-container");
  subjectListContainer.id = courseData.id;

  var unorderedList = document.createElement("ul");

  var urls = courseData.urls;
  for (var i = 0; i < urls.length; i++) {
    var item = createListItemView(urls[i]);
    unorderedList.appendChild(item);
  }

  subjectListContainer.appendChild(unorderedList);

  parent.appendChild(btExpand);
  parent.appendChild(subjectListContainer);

  return parent;
}

//create an expandable button for every courses which contain links
function createExpandableButton(courseData) {
  var btExpand = document.createElement("button");
  btExpand.classList.add("md-bt-expandable");
  btExpand.dataset.target = courseData.id;

  const icon = document.createElement("span");
  icon.classList.add("material-symbols-outlined");
  icon.innerHTML = "arrow_drop_down";
  icon.style.transform = "rotate(90deg)";
  icon.style.transition = "transform 200ms ease-in-out";
  const text = document.createElement("span");
  text.innerText = courseData.title;

  btExpand.appendChild(icon);
  btExpand.appendChild(text);

  btExpand.addEventListener("click", function () {
    const l = document.getElementById(btExpand.dataset.target);

    if (!courseData.isExpanded) {
      icon.style.transform = "rotate(0deg)";
      l.style.maxHeight = l.scrollHeight + "px";
    } else {
      icon.style.transform = "rotate(90deg)";
      l.style.maxHeight = "0";
    }

    courseData.reverseExpandStatus();
  });

  return btExpand;
}

//creates item for every url related to course for showing in sidebar
function createListItemView(link) {
  var item = document.createElement("li");

  var anchor = document.createElement("a");
  anchor.href = link.href;
  anchor.innerHTML = link.subject;
  item.appendChild(anchor);

  return item;
}

/*
  Views for code styling usable in article.js
*/

function createSampleHeader() {
  var codeHead = document.createElement("div");
  codeHead.classList.add("sample-head");

  var copyButton = document.createElement("button");
  copyButton.classList.add("md-bt", "md-bt-light", "material-symbols-outlined");
  copyButton.style.cursor = "copy";
  copyButton.innerHTML = "content_copy";

  codeHead.appendChild(copyButton);

  return codeHead;
}

function createSnippetToggler(buildToggleButtons) {
  var snippetToggler = document.createElement("div");
  snippetToggler.classList.add("snippet-toggler");

  buildToggleButtons(snippetToggler);

  return snippetToggler;
}

function createSnippetToggleButton(name, id, appendable) {
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

export {
  createCourseListView,
  createSampleHeader,
  createSnippetToggler,
  createSnippetToggleButton,
  createCodeWrap,
  createCodeTableView,
  createDot,
};
