import {animatePendingOperation} from "./animation.js"

//loads Ui Components into documents
const scrollButtonContainer = document.querySelector(".scroll-top-container")! as HTMLElement;

function initUiComponents() {

  scrollButtonContainer.addEventListener("click", _ => {
    window.scrollTo({top: 0, behavior: "smooth"});
  });

  initDialog();
  (() => initSidebar())();
}

const header = document.querySelector("header")!;
const dialog = document.querySelector(".dialog")! as HTMLElement;

async function initSidebar() {

  toggleSidebar();

  const courseContainer = document.querySelector(".sidebar-list");

  if (courseContainer) {

    const listCourses: NodeList = courseContainer.querySelectorAll('.sidebar-item');

    let coursePaths = await getCoursePaths();

    for (var i = 0; i < listCourses.length; i++) {

      const courseItem = listCourses[i] as HTMLElement;
      const subjectPaths = coursePaths[i];

      const badgeData = courseItem.querySelector('.badge-data')!;
      const intervalId = animatePendingOperation(badgeData);

      const btExpand = courseItem.querySelector(".md-bt-expandable")! as HTMLElement;
      const posts = document.getElementById(btExpand.dataset.target!)!;

      btExpand.addEventListener("click", function () {

        if (isExpanded(btExpand)) {
          collapse(btExpand, posts);
        } else {
          collapseAll(listCourses);
          expand(btExpand, posts);
        }
      });

      estimateCoursesReadingTime(courseItem, subjectPaths, intervalId);

    }
  }
}


function expand(btExpand: HTMLElement, content: HTMLElement) {
  btExpand.classList.add("expanded");
  btExpand.classList.add("expand");
  content.style.maxHeight = content.scrollHeight + "px";
}

function collapse(btExpand: HTMLElement, content: HTMLElement) {
  btExpand.classList.remove("expanded");
  btExpand.classList.remove("expand");
  content.style.maxHeight = '0';
}

function collapseAll(list: NodeList) {

  for (var i = 0; i < list.length; i++) {

    const btExpand = (list[i] as HTMLElement).querySelector(".md-bt-expandable")! as HTMLElement;
    btExpand.classList.remove("expanded");
    btExpand.classList.remove("expand");
    const content = document.getElementById(btExpand.dataset.target!)! as HTMLElement;
    content.style.maxHeight = '0';

  }
}

function isExpanded(element: Element) {
  return element.classList.contains("expanded");
}

function showNavbarBrand() {
  const sidebarNavBrand = document.querySelector(".navbar-brand")! as HTMLElement;
  sidebarNavBrand.style.opacity = '1';
}

function hideNavbarBrand() {
  const sidebarNavBrand = document.querySelector(".navbar-brand")! as HTMLElement;
  sidebarNavBrand.style
  sidebarNavBrand.style.opacity = '0';
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");

  if (sidebar == null) return

  const btShowSidebar = document.getElementById("bt_show_sidebar")!;
  const btHideSidebar = document.getElementById("bt_hide_sidebar")!;

  btShowSidebar.addEventListener("click", function () {
    sidebar.classList.remove("hide");
    sidebar.classList.add("show");
    hideNavbarBrand();
  });

  btHideSidebar.addEventListener("click", function () {
    sidebar.classList.remove("show");
    sidebar.classList.add("hide");
    showNavbarBrand();
  });

}


async function getCoursePaths(): Promise<string[][]> {
  const response = await fetch("/resources/json/metadata.json", {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  });

  const json = await response.json();

  const courses = json.courses;

  let coursePaths: string[][] = [];

  courses.forEach((course: any) => {
    let paths: string[] = [];
    course.metadata_list.forEach((subject: any) => {
      paths = paths.concat(subject.path);
    });

    coursePaths.push(paths);
  });

  return coursePaths;
}

async function estimateCoursesReadingTime(courseItem: HTMLElement, subjectPaths: string[], intervalId: number) {

  let courseETA = 0;

  for (const path of subjectPaths) {
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
      const article = doc.querySelector("article") as Node;

      const textETA = estimateRegularTextReadingTime(article);
      const snippetETA = estimateSnippetReadingTime(article);

      courseETA += (textETA + snippetETA);

    } catch (err) {
      console.error(err);
    }
  }

  const etaBadge = courseItem.querySelector(".badge-data")! as HTMLElement;
  etaBadge.innerHTML = '' + courseETA;

  clearInterval(intervalId);

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


let currentScrollY = 0;

var scrollTopVisibility = function () {
  if (window.scrollY == 0) {
    scrollButtonContainer.style.visibility = "hidden";
  } else {
    if (window.scrollY < currentScrollY) {
      if (document.documentElement.scrollTop > header.offsetHeight)
        scrollButtonContainer.style.visibility = "visible";
    } else {
      scrollButtonContainer.style.visibility = "hidden";
    }
  }

  currentScrollY = window.scrollY;
};

//codes for dialog
const KEY_VISIBILITY_STATUS = "dialog-visibility-status-key";

function hideDialog() {
  dialog.classList.remove("show");
  dialog.classList.add("hide");
}

function showDialog() {
  dialog.classList.remove("hide");
  dialog.classList.add("show");
}

function initDialog() {
  //localStorage.removeItem(KEY_VISIBILITY_STATUS);
  let keepHidden = JSON.parse(localStorage.getItem(KEY_VISIBILITY_STATUS)!);

  if (keepHidden != null) {
    if (keepHidden) {
      return;
    }
  }

  setTimeout(showDialog, 10000);

  const btClose = document.getElementById("bt-close-dialog")!;

  btClose.onclick = function () {
    hideDialog();
  };

  var checkboxStatus = document.getElementById("status") as HTMLInputElement;

  var btConfirm = document.getElementById("bt-confirm") as HTMLButtonElement;
  btConfirm.onclick = function () {
    keepHidden = checkboxStatus.checked;

    localStorage.setItem(KEY_VISIBILITY_STATUS, JSON.stringify(keepHidden));
    hideDialog();
  };
}

export {initUiComponents, scrollTopVisibility, estimateRegularTextReadingTime, estimateSnippetReadingTime};
