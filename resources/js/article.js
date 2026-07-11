import {
  createSampleHeader,
  createDropMenu,
  createSnippetSelector,
  createCodeWrap,
  createCodeTableView,
} from "./ui.js";

const keyword =
  /(?<!([^\s,(}]{1}|\/\/.*))(public|private|protected|void|return|static|instanceof|for|while|do|if|else|switch|case|override|fun|var|val|companion|data|in|infix|tailrec|inline|noinline|crossinline|reified|false|true|null|class|short|byte|int|long|double|float|boolean|throw|throws|try|catch|finally|final|static|interface|enum|abstract|import|this|super|new|package|yield|default|extends|implements|def|elif|function)(?![\w\d]|[^\s)\{\(;]{1})/g;
const string = /(?<!\/\/.*)(["']([^+]*)["'])|(["'](@\+.*)["'])/g;
const className =
  /((?<![^\s./-<,(]|(\/\/.*))([A-Z]{1}[\w\d]*)(?!([^\s.,>:("]){1}))/g;
const digit = /(?<![^\s,(]|(\w\s))\d+(?![\w\d]|[^\s),;]{1})/g;
const annotation = /(?<![^\s]{1})@[A-Z]{1}[a-zA-Z\d]*/g;
const comment = /(?<!(http{1}.*))\/\/.*/g;
const shellCommands =
  /(?<!([^\s,(}]{1}|\/\/.*))(echo|ls|cd|rm|cp|mv|mkdir|dd|fdisk|chmod|mount|umount|mkfs|mk2fs|mkfs.ext4|mkfs.ntfs|mkfs.ext3|mkfs.vfat)(?![\w\d]|[^\s)\{\(;]{1})/g;

const pseudo = /(?<!([^\s,(}]{1}|\/\/.*))(function|for|while|if|else|int|double|long|short|float|true|false|boolean|return|class)(?![\w\d]|[^\s)\{\(;]{1})/g;

const codeContainerList = document.querySelectorAll(".sample");

const languages = /(Java)|(Kotlin)|(Gradle)|(XML)|(Shell)|(PseudoCode)|(JavaScript)|(Python)/g;

function createCodeViews() {

  for (var i = 0; i < codeContainerList.length; i++) {
    let codeContainer = codeContainerList[i];

    let header = createSampleHeader();
    let copyButton = header.firstChild;

    let snippetContainer = codeContainer.querySelector(".snippet-container");

    //intented to wrap codes for every languages.
    let codeSnippetList = snippetContainer.querySelectorAll(".snippet");

    updateActiveSnippet(codeSnippetList);

    let dropMenuContainer = createDropMenu(dropMenuContainer => {

      const btDropMenu = document.createElement("button");
      btDropMenu.classList.add("bt-drop-menu");

      const dropMenu = document.createElement("div");
      dropMenu.classList.add("drop-menu-options");

      btDropMenu.addEventListener("click", e => {
        e.stopPropagation();
        dropMenu.classList.toggle("show");
      });

      if (codeSnippetList.length > 1) {
        document.addEventListener("click", e => {
          e.stopPropagation();
          dropMenu.classList.remove("show");
        });
        dropMenuContainer.appendChild(dropMenu);
        dropMenuContainer.appendChild(btDropMenu);
      }

      //iterate through snippets to generate requirement code snippets for multiple languages.
      for (var j = 0; j < codeSnippetList.length; j++) {

        let snippet = codeSnippetList[j];

        let snippetLang = findSnippetLanguage(snippet);

        //Parameters: name, id, lambda expression
        createSnippetSelector(
          i,
          snippetLang + i + "" + j,
          (inputSnippetSelector, lblSnippetSelector) => {
            //listen when programming language changed.
            inputSnippetSelector.addEventListener("change", function () {

              if (this.checked) {

                updateActiveSelector(dropMenu, lblSnippetSelector);
                updateActiveSnippet(codeSnippetList, snippet);

                copyButton.onclick = function () {
                  let text = collectTextCodes(snippet.firstChild);
                  navigator.clipboard.writeText(text);
                  toggleCopyMessage();
                };

                btDropMenu.innerHTML = snippetLang;
                dropMenu.classList.remove("show");

              }

            });

            if (codeSnippetList.length > 1) {
              dropMenu.appendChild(inputSnippetSelector);
              dropMenu.appendChild(lblSnippetSelector);
            } else {
              lblSnippetSelector.style.color = "#fafafa";
              dropMenuContainer.appendChild(lblSnippetSelector);
            }

            lblSnippetSelector.innerHTML = snippetLang;

            snippet.id = snippetLang + i;

            if (j === 0) {
              updateActiveSelector(dropMenu, lblSnippetSelector);
              updateActiveSnippet(codeSnippetList, snippet);
              inputSnippetSelector.checked = true;
              btDropMenu.innerHTML = snippetLang;
              copyButton.onclick = function () {
                const text = collectTextCodes(snippet.firstChild);
                navigator.clipboard.writeText(text);
                toggleCopyMessage();
              }
            }
          }
        );

        styleSnippet(snippet, snippetLang === "Text", snippetLang === "PseudoCode");
      }
    });

    codeContainer.insertBefore(dropMenuContainer, snippetContainer);

    codeContainer.insertBefore(header, dropMenuContainer);
  }
}

function updateActiveSelector(dropMenu, current) {

  const labels = dropMenu.querySelectorAll("label");

  for (var i = 0; i < labels.length; i++) {
    labels[i].style.display = "block";
  }
  if (dropMenu.children.length > 0)
    current.style.display = "none";
}

function toggleCopyMessage() {

  let copyMessage = document.querySelector(".copy-message");
  copyMessage.classList.toggle("showMessage");
  setTimeout(() => {
    copyMessage.classList.toggle("showMessage");
  }, 3000);
}

function findSnippetLanguage(snippet) {
  let snippetClassNames = snippet.className.split(" ");
  let languageIndex = snippetClassNames.findIndex((el) => el.match(languages));

  return snippetClassNames[languageIndex] ? snippetClassNames[languageIndex] : "Text";
}

function updateActiveSnippet(codeSnippetList, currentSnippet) {
  for (var i = 0; i < codeSnippetList.length; i++) {
    codeSnippetList[i].style.display = "none";
  }
  if (currentSnippet)
    currentSnippet.style.display = "block";
}

function styleSnippet(snippet, isSimpleText, isPseudoCode) {

  const codeLines = snippet.innerHTML.split("\n");
  const codeViewContents = createCodeViewContents(codeLines, isSimpleText, isPseudoCode);

  snippet.innerHTML = "";
  snippet.appendChild(codeViewContents);

}

function createCodeViewContents(codeLines, isSimpleText, isPseudoCode) {
  var codeWrap = createCodeWrap();

  createCodeTableView(codeWrap, (table, tBody) => {

    for (var lineIndex = 0; lineIndex < codeLines.length; lineIndex++) {

      let line = codeLines[lineIndex];

      if (isSimpleText) {
        line = styleAsText(line);
      } else if (isPseudoCode) {
        line = styleAsPseudo(line);
      } else {
        line = styleAsCode(line);
      }

      insertLine(tBody, line, lineIndex);

    }

    table.appendChild(tBody);
  });

  return codeWrap;
}

function styleAsText(textLine) {
  textLine = styleSensitiveWords(textLine, "*", "text");
  return textLine;
}

function styleAsPseudo(textLine) {
  textLine = styleSensitiveWords(textLine, pseudo, "pseudo");
  return textLine;
}

function styleAsCode(textLine) {
  textLine = styleSensitiveWords(textLine, string, "string");
  textLine = styleSensitiveWords(textLine, keyword, "keyword");
  textLine = styleSensitiveWords(textLine, className, "class-name");
  textLine = styleSensitiveWords(textLine, digit, "digit");
  textLine = styleSensitiveWords(textLine, annotation, "annotation");
  textLine = styleSensitiveWords(textLine, comment, "comment");
  textLine = styleSensitiveWords(textLine, shellCommands, "shell-commands");
  return textLine;
}

function styleSensitiveWords(text, regex, styleClassName) {
  return text.replaceAll(regex, function (word) {
    return `<span class=\"${styleClassName}\">${word}</span>`;
  });
}

//create a row to insert code line
function insertLine(tBody, line, lineIndex) {
  var row = tBody.insertRow(0);

  var col0 = row.insertCell(0);
  col0.classList.add("code-line-number");
  col0.innerHTML = lineIndex + 1;

  var col1 = row.insertCell(0);
  col1.classList.add("code");
  col1.innerHTML = line;

  row.appendChild(col0);
  row.appendChild(col1);

  tBody.appendChild(row);
}

function collectTextCodes(codeViewContents) {
  const tBody = codeViewContents.querySelector("tbody");
  const rows = tBody.rows;
  let text = "";
  for (var i = 0; i < rows.length; i++) {
    var codeLine = rows[i].cells[1];
    text += codeLine.innerHTML + "\n";
  }

  text = text.replaceAll(/\&lt;/g, "<");
  text = text.replaceAll(/\&gt;/g, ">");
  text = text.replaceAll(/<\/span>/g, "");
  text = text.replaceAll(/<span class="(keyword|string)">/g, "");
  text = text.replaceAll(
    /<span class="(class-name|digit|annotation|comment)">/g,
    "",
  );

  return text;
}

export {createCodeViews};
