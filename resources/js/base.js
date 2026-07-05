//loads Ui Components into documents
function initUiComponents() {
  var path = window.location.pathname;

  //check if the file path origins from learn
  if (path.match(/post\/.+\.html$/g)) {
    initSubjectItems();
  }

  initDialog();
  initSidebar();
}

const header = document.querySelector("header");
const dialog = document.querySelector(".dialog");

function initSidebar() {

  displaySidebarInfo();
  toggleSidebar();


  const courseContainer = document.querySelector(".list-container");

  const listCourses = courseContainer.children;

  for (var i = 0; i < listCourses.length; i++) {
    const btExpand = listCourses[i].querySelector(".md-bt-expandable");

    const posts = document.getElementById(btExpand.dataset.target);

    btExpand.addEventListener("click", function () {

      if (isExpanded(btExpand)) {
        collapse(btExpand, posts);
      } else {
        collapseAll(listCourses);
        expand(btExpand, posts);
      }
    });
  }
}


function initSubjectItems() {

  const subjectContainer = document.querySelector(".subject-container");

  if (subjectContainer === null) return;

  const listItems = subjectContainer.children;


  for (var i = 0; i < listItems.length; i++) {

    const itemHead = listItems[i].querySelector(".md-bt-expandable");
    const itemContent = document.getElementById(itemHead.dataset.target);

    itemHead.addEventListener("click", function () {

      if (isExpanded(itemHead)) {
        collapse(itemHead, itemContent);
      } else {
        collapseAll(listItems);
        expand(itemHead, itemContent);
      }

    });
  }
}

function expand(btExpand, content) {
  btExpand.classList.add("expanded");
  btExpand.classList.add("expand");
  content.style.maxHeight = content.scrollHeight + "px";
}

function collapse(btExpand, content) {
  btExpand.classList.remove("expanded");
  btExpand.classList.remove("expand");
  content.style.maxHeight = 0;
}

function collapseAll(list) {

  for (var i = 0; i < list.length; i++) {

    const btExpand = list[i].querySelector(".md-bt-expandable");
    btExpand.classList.remove("expanded");
    btExpand.classList.remove("expand");
    const content = document.getElementById(btExpand.dataset.target);
    content.style.maxHeight = 0;

  }
}

function isExpanded(element) {
  return element.classList.contains("expanded");
}

function showNavbarBrand() {
  const sidebarNavBrand = document.querySelector(".navbar-brand");
  sidebarNavBrand.style.opacity = 1;
}

function hideNavbarBrand() {
  const sidebarNavBrand = document.querySelector(".navbar-brand");
  sidebarNavBrand.style.opacity = 0;
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const btShowSidebar = document.getElementById("bt_show_sidebar");
  const btHideSidebar = document.getElementById("bt_hide_sidebar");

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

function displaySidebarInfo() {
  fetch("http://127.0.0.1:4000/resources/json/list-posts.json", {
    method: "GET"
  }).then(response => response.json()).then(function (json) {

    const sidebarInfo = document.querySelector(".sidebar-info");

    const totalNumberOfSubjects = sidebarInfo.firstElementChild;
    totalNumberOfSubjects.dataset.count = json.length;

    const totalNumberOfPosts = sidebarInfo.lastElementChild;

    var postCounter = 0;

    for (var i = 0; i < json.length; i++) {
      var metadata_list = json[i].metadata_list;
      postCounter += metadata_list.length;
    }


    totalNumberOfPosts.dataset.count = postCounter;

  }).catch(e => console.log(e));
}


const scrollButtonContainer = document.querySelector(".scroll-top-container");

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
  var keepHidden = JSON.parse(localStorage.getItem(KEY_VISIBILITY_STATUS));

  if (keepHidden != null) {
    if (keepHidden) {
      return;
    }
  }

  setTimeout(showDialog, 10000);

  var btClose = document.getElementById("bt-close-dialog");

  btClose.onclick = function () {
    hideDialog();
  };

  var checkboxStatus = document.getElementById("status");

  var btConfirm = document.getElementById("bt-confirm");
  btConfirm.onclick = function () {
    keepHidden = checkboxStatus.checked;

    localStorage.setItem(KEY_VISIBILITY_STATUS, JSON.stringify(keepHidden));
    hideDialog();
  };
}

export {initUiComponents, scrollTopVisibility};
