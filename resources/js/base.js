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
    itemHead.firstChild.innerHTML = "arrow_left";

    itemHead.addEventListener("click", function () {
      console.log("clicked");
      var content = this.nextElementSibling;
      var itemHeadIcon = this.firstElementChild;

      var isExpanded = this.classList.contains("expanded");

      if (!isExpanded) {
        removeExpand();
        this.classList.add("expanded");
        content.style.maxHeight = content.scrollHeight + "px";
        itemHeadIcon.classList.add("expand");
      } else {
        removeExpand();
      }
    });
  }
}

function removeExpand() {
  subjectItemHeads.forEach((el) => {
    el.classList.remove("expanded");
    var itemHeadIcon = el.firstElementChild;

    itemHeadIcon.classList.remove("expand");
    let content = el.nextElementSibling;
    content.style.maxHeight = 0;
  });
}

const header = document.querySelector("header");
const dialog = document.querySelector(".dialog");

function initSidebar() {
  toggleSidebar();

  const courseContainer = document.querySelector(".list-container");

  //structure: <div><button></button><div class="subject-list-container"></div></div>
  const topicList = courseContainer.children;

  for (var i = 0; i < topicList.length; i++) {
    const btExpand = topicList[i].querySelector("button");
    const btExpandIcon = btExpand.firstElementChild;

    const topic = document.getElementById(btExpand.dataset.target);

    btExpand.addEventListener("click", function () {
      switchExpandState(btExpand);
      topic.style.maxHeight = isExpanded(btExpand)
        ? topic.scrollHeight + "px"
        : 0;
      btExpandIcon.classList.toggle("expand");
    });
  }
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

  showDialog();

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
