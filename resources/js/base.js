import {createCourseListView} from './ui.js';

const courseDataRepo = [
  "/resources/json/java-links.json",
  "/resources/json/kotlin-links.json",
  "/resources/json/android-links.json",
  "/resources/json/linux-links.json",
  "/resources/json/web-links.json",
  "/resources/json/blog-links.json"
]

const header = document.querySelector('header');
const footer = document.querySelector("footer");
const dialog = document.querySelector('.dialog');

class CourseData {
  isExpanded = false;
  constructor(id, title, urls) {
    this.id = id;
    this.title = title;
    this.urls = urls;
  }

  reverseExpandStatus() {
    this.isExpanded = !this.isExpanded;
  }
}


//loads Ui Components into documents
function loadAllUiComponents() {

  loadComponent("/ui-components/header-contents.html", header, () => {

    //container is already loaded
    const container = document.getElementById("article_container");

    prepareSidebarAnim();

    loadJsonUrls((result) => {
      const data = new CourseData(
        result.id, result.title, result.links
      );

      const listView = createCourseListView(data);

      container.appendChild(listView);

    });

  });

  loadComponent("/ui-components/footer-contents.html", footer);

  loadComponent("/ui-components/dialog-contents.html", dialog, () => {
        initDialog();
  });

}

function prepareSidebarAnim() {
  const sidebar = document.getElementById('sidebar');

  if (sidebar != null) {
    sidebar.addEventListener('show.bs.offcanvas', function () {
      $("#brand").hide('slow');
    });
    sidebar.addEventListener('hide.bs.offcanvas', function () {
      $("#brand").show('slow');
    });
  }
}


async function loadComponent(path, parent, callback) {

  callback = callback || 0;
  const req = await fetch(path);

  await req.text().then(
    (text) => {
      parent.insertAdjacentHTML('beforeend', text);
      if (callback != 0)
        callback();

    }).catch((e) => console.log(e));
}

//retrieve data stored in json files inside path: /resources/json
async function loadJsonUrls(onRetrieveJSONListener) {

  for (var i = 0; i < courseDataRepo.length; i++) {

    const url = courseDataRepo[i];

    const req = await fetch(url)
    await req.json().then(
      (result) =>
        onRetrieveJSONListener(result)
    ).catch(e => console.log(e));
  }
}


const scrollButtonContainer = document.querySelector('.scroll-top-container')

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
}

const KEY_VISIBILITY_STATUS = 'dialog-visibility-status-key';

function hideDialog(){
    dialog.classList.remove('show');
    dialog.classList.add('hide');
}

function showDialog(){
    dialog.classList.remove('hide');
    dialog.classList.add('show');
}

function initDialog(){
    //localStorage.removeItem(KEY_VISIBILITY_STATUS);
    var keepHidden = JSON.parse(localStorage.getItem(KEY_VISIBILITY_STATUS));

    if(keepHidden != null){
        if(keepHidden) {
            return;
        }
    }

    showDialog();

    var btClose = document.getElementById('bt-close-dialog');

    btClose.onclick = function(){ hideDialog(); }

    var checkboxStatus = document.getElementById('status');

    var btConfirm = document.getElementById('bt-confirm');
    btConfirm.onclick = function(){

        keepHidden = checkboxStatus.checked;

        localStorage.setItem(KEY_VISIBILITY_STATUS, JSON.stringify(keepHidden));
        hideDialog();

    }

}

export {loadAllUiComponents, scrollTopVisibility};
