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

let subjectItemHeads = document.querySelectorAll(".subject-item-head");

function initSubjectItems() {
  for (var i = 0; i < subjectItemHeads.length; i++) {
    var itemHead = subjectItemHeads[i];

    itemHead.addEventListener("click", function () {

      var isExpanded = this.classList.contains("expanded");

      if (!isExpanded) {
        expand(this);
      } else {
        collapseAll();
      }
    });
  }
}

function expand(element) {
  collapseAll();
  element.classList.add("expanded");
  element.classList.add("expand");
  var content = element.nextElementSibling;
  content.style.maxHeight = content.scrollHeight + "px";
}

function collapseAll() {
  subjectItemHeads.forEach((el) => {
    el.classList.remove("expanded");
    el.classList.remove("expand");
    let content = el.nextElementSibling;
    content.style.maxHeight = 0;
  });
}

const header = document.querySelector("header");
const dialog = document.querySelector(".dialog");

function initSidebar() {

  displaySidebarInfo();
  toggleSidebar();


  const courseContainer = document.querySelector(".list-container");

  const topicList = courseContainer.children;

  for (var i = 0; i < topicList.length; i++) {
    const btExpand = topicList[i].querySelector("button");

    const topic = document.getElementById(btExpand.dataset.target);

    btExpand.addEventListener("click", function () {
      switchExpandState(btExpand);
      topic.style.maxHeight = isExpanded(btExpand)
        ? topic.scrollHeight + "px"
        : 0;
      btExpand.classList.toggle("expand");
    });
  }
}

function displaySidebarInfo() {
  fetch("https://kodedevel.ir/resources/json/list-posts.json", {
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

function switchExpandState(element) {
  if (!isExpanded(element)) {
    element.classList.add("expanded");
  } else {
    element.classList.remove("expanded");
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
