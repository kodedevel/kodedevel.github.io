let subjectItemHeads = document.querySelectorAll(".subject-item-head");

function prepareSubjectItems() {

  for (var i = 0; i < subjectItemHeads.length; i++) {
    var itemHead = subjectItemHeads[i];
    itemHead.firstChild.innerHTML = "arrow_left";

    itemHead.addEventListener("click", function () {

      var content = this.nextElementSibling;
      var itemHeadExpandLabel = this.firstElementChild;

      var isExpanded = this.classList.contains("expanded");

      if (!isExpanded) {
        removeExpand();
        this.classList.add("expanded");
        content.style.maxHeight = content.scrollHeight + "px";
        itemHeadExpandLabel.style.transform = "rotate(-90deg)";

      } else {
        removeExpand();
      }

    });
  }
}

function removeExpand() {
  subjectItemHeads.forEach(el => {
    el.classList.remove("expanded");
    var itemHeadExpandLabel = el.firstElementChild;

    itemHeadExpandLabel.style.transform = "rotate(0deg)";
    let content = el.nextElementSibling;
    content.style.maxHeight = null;
  });
}

export {prepareSubjectItems}; 
