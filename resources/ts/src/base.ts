import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@7.5.0/dist/fuse.mjs";
import { FuseResult } from "fuse.js";
import { CourseMeta, Meta } from "./backend/model/pages-meta.js"
import { animatePendingOperation } from "./animation.js";
import { createSearchResultItem } from "./ui.js";
import { estimateCourseReadingTime } from "./eta.js";


//loads Ui Components into documents
const scrollButtonContainer = document.querySelector(".scroll-top-container")! as HTMLElement;

const allCourses = await getAllCourses();

async function getAllCourses() {
  const response = await fetch("/resources/json/metadata.json", {
    method: 'GET',
    headers: {
      "Content-Type": 'application/json'
    }
  });

  const json = await response.json();

  return json.courses;
}

function getCoursePaths(): string[][] {

  let coursePaths: string[][] = [];

  allCourses.forEach((course: any) => {
    let paths: string[] = [];
    course.metadata_list.forEach((subject: any) => {
      paths = paths.concat(subject.path);
    });

    coursePaths.push(paths);
  });

  return coursePaths;
}

function initUiComponents() {

  initSearch();

  scrollButtonContainer.addEventListener("click", _ => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  initDialog();
  initSidebar();
}

const header = document.querySelector("header")!;
const dialog = document.querySelector(".dialog")! as HTMLElement;

function initSidebar() {

  toggleSidebar();

  const courseContainer = document.querySelector(".sidebar-list");

  if (courseContainer) {

    const listCourses: NodeList = courseContainer.querySelectorAll('.sidebar-item');

    let coursePaths = getCoursePaths();

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

      estimateCourseReadingTime(courseItem, subjectPaths, intervalId);

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

function getAllPagesMeta(): Meta[] {

  const allSubjects: Meta[] = []

  allCourses.forEach((course: CourseMeta) => {
    course.metadata_list.forEach((subject: any) => {
      allSubjects.push(subject);
    });
  });

  return allSubjects;
}

const allPagesMetadata = getAllPagesMeta();


function search(query: string): FuseResult<Meta>[] {

  const fuse = new Fuse(allPagesMetadata, {
    keys: [{
      name: "title",
      weight: 0.8
    }, {
      name: "description",
      weight: 0.2
    }],
    includeScore: true,
    threshold: 0.3
  });

  const result: FuseResult<Meta>[] = fuse.search(query);

  return result;
}


function initSearch() {

  const searchContainer = document.querySelector('search') as HTMLElement | null;


  if (!searchContainer) return;

  const searchField = searchContainer?.querySelector('.search-field') as HTMLInputElement;
  const btClear = searchContainer?.querySelector('.md-bt-clear') as HTMLButtonElement;

  const searchResultContainer = document.querySelector(".search-result-container");

  window.addEventListener("click", () => {
    clearSearchResult(searchResultContainer!);
  })

  btClear.onclick = () => {
    searchField.value = "";
    clearSearchResult(searchResultContainer!);
  }

  let timeoutId: ReturnType<typeof setTimeout>;

  searchField?.addEventListener("input", event => {

    const userInput = (event.target as HTMLInputElement).value

    clearSearchResult(searchResultContainer!);
    clearTimeout(timeoutId);

    if (userInput.length > 0) {

      timeoutId = setTimeout(() => {

        const result = search(userInput);

        if (result.length == 0) {
          const emptySearchResultItem = createSearchResultItem("نتیجه ای یافت نشد", "#");
          searchResultContainer?.appendChild(emptySearchResultItem);
        } else {

          result.forEach((result: FuseResult<Meta>) => {
            const meta = result.item;
            const resultItemUi = createSearchResultItem(meta.title!, meta.path!);
            searchResultContainer?.appendChild(resultItemUi);
          })

        }

      }, 400);

    }
  });



}


function clearSearchResult(searchResultContainer: Element) {
  while (searchResultContainer!.firstChild) {
    const element = searchResultContainer!.lastChild!
    searchResultContainer!.removeChild(element)
  }
}

export { initUiComponents, scrollTopVisibility};
