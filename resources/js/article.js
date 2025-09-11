import {createSampleHeader, createSnippetToggler, createSnippetToggleButton, createCodeWrap, createCodeTableView} from './ui.js';

const keyword = /(?<!([^\s,(}]{1}|\/\/.*))(public|private|protected|void|return|static|instanceof|for|while|do|if|else|switch|case|override|fun|var|val|companion|data|in|infix|tailrec|inline|noinline|crossinline|reified|false|true|null|class|short|byte|int|long|double|float|boolean|throw|throws|try|catch|finally|final|static|interface|enum|abstract|import|this|super|new|package|yield|default|extends|implements)(?![\w\d]|[^\s)\{\(;]{1})/g;
const string = /(?<!\/\/.*)(["']([^+]*)["'])|(["'](@\+.*)["'])/g;
const className = /((?<![^\s./-<,(]|(\/\/.*))([A-Z]{1}[\w\d]*)(?!([^\s.,>:("]){1}))/g;
const digit = /(?<![^\s,(]|(\w\s))\d+(?![\w\d]|[^\s),;]{1})/g;
const annotation = /(?<![^\s]{1})@[A-Z]{1}[a-zA-Z\d]*/g;
const comment = /(?<!(http{1}.*))\/\/.*/g;
const shellCommands = /(?<!([^\s,(}]{1}|\/\/.*))(ls|cd)(?![\w\d]|[^\s)\{\(;]{1})/g;

const codeContainerList = document.querySelectorAll('.sample');

const languages = /(Java)|(Kotlin)|(Gradle)|(XML)|(Shell)/g;

function createCodeViews() {

  for (var i = 0; i < codeContainerList.length; i++) {
    let codeContainer = codeContainerList[i];

    let header = createSampleHeader();
    let copyButton = header.firstChild;

    let snippetContainer = codeContainer.querySelector('.snippet-container');

    //intented to wrap codes for every languages.
    let codeSnippetList = snippetContainer.querySelectorAll('.snippet');

    hideAllSnippets(codeSnippetList);

    let snippetToggler = createSnippetToggler((snippetToggler) =>{

      //iterate through snippets to generate requirement code snippets for multiple languages.
      for(var j = 0; j<codeSnippetList.length; j++){

        let snippet = codeSnippetList[j];

        let snippetLang = findSnippetLanguage(snippet);

        //Parameters: name, id, lambda expression
        createSnippetToggleButton( i, (snippetLang + i + "" + j), (snippetToggleButton, snippetToggleLabel) => {
          //listen when syntax of language changed.
          snippetToggleButton.addEventListener('change', function(event) {

            if(this.checked){
              hideAllSnippets(codeSnippetList);
              //this.style.display = 'none';
              showSnippet(snippet);

              copyButton.onclick = function(){
                let text = collectTextCodes(snippet.firstChild);
                navigator.clipboard.writeText(text);
                $('.copy-message').animate({bottom: "0px"}, 512);
                $('.copy-message').delay(3000).animate({bottom: "-128px"}, 512);
              }

            }
          });


          if(codeSnippetList.length > 1) snippetToggler.appendChild(snippetToggleButton);


          if(codeSnippetList.length <= 1)   snippetToggleLabel.style.color = '#fafafa';

          snippetToggleLabel.innerHTML = snippetLang;
          snippetToggler.appendChild(snippetToggleLabel);

          snippet.id = snippetLang + i;

          if(j === 0) {
            showSnippet(snippet);
            snippetToggleButton.checked = true;
          }

        });

        let codeLines = snippet.innerHTML.split('\n');
        let codeViewContents = createCodeViewContents(codeLines);
        
        snippet.innerHTML = '';
        snippet.appendChild(codeViewContents);

        if(j === 0){
          copyButton.onclick = function(){
            let text = collectTextCodes(snippet.firstChild);
            navigator.clipboard.writeText(text);
            $('.copy-message').animate({bottom: "0px"}, 512);
            $('.copy-message').delay(3000).animate({bottom: "-128px"}, 512);
          }
        }

      }
    });

    codeContainer.insertBefore(snippetToggler, snippetContainer);

    codeContainer.insertBefore(header, snippetToggler);

  }

}

function findSnippetLanguage(snippet){
  let snippetClassNames = snippet.className.split(" ");
  let languageIndex = snippetClassNames.findIndex(el => el.match(languages));

  return snippetClassNames[languageIndex];
}

function showSnippet(syntaxWrapper){
  syntaxWrapper.style.display = 'block';
}

function hideAllSnippets(syntaxWrapperList){
  for(var i = 0; i<syntaxWrapperList.length; i++){
    syntaxWrapperList[i].style.display = 'none';
  }
}

function createCodeViewContents(codeLines) {
  var codeWrap = createCodeWrap();

  createCodeTableView(codeWrap, (table, tBody) => {

    for (var lineIndex = 0; lineIndex < codeLines.length; lineIndex++) {
      let line = codeLines[lineIndex];
      line = styleAllSensitiveWords(line);
      insertLine(tBody, line, lineIndex);
    }

    table.appendChild(tBody);

  });


  return codeWrap;
}

function styleAllSensitiveWords(textLine) {
  textLine = styleSensitiveWords(textLine, string, "string");
  textLine = styleSensitiveWords(textLine, keyword, "keyword");
  textLine = styleSensitiveWords(textLine, className, "class-name");
  textLine = styleSensitiveWords(textLine, digit, "digit")
  textLine = styleSensitiveWords(textLine, annotation, "annotation")
  textLine = styleSensitiveWords(textLine, comment, "comment");
  textLine = styleSensitiveWords(textLine, shellCommands, "shell-commands")
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
  col0.classList.add('code-line-number');
  col0.innerHTML = lineIndex + 1;

  var col1 = row.insertCell(0);
  col1.classList.add('code');
  col1.innerHTML = line;

  row.appendChild(col0);
  row.appendChild(col1);

  tBody.appendChild(row);
}

function collectTextCodes(codeViewContents) {
  const tBody = codeViewContents.querySelector('tbody');
  const rows = tBody.rows;
  let text = "";
  for (var i = 0; i < rows.length; i++) {
    var codeLine = rows[i].cells[1];
    text += codeLine.innerHTML + "\n";
  }

  text = text.replaceAll(/\&lt;/g, "<");
  text = text.replaceAll(/\&gt;/g, ">");
  text = text.replaceAll(/<\/span>/g, "");
  text = text.replaceAll(/<span class="(keyword|string)">/g, "")
  text = text.replaceAll(/<span class="(class-name|digit|annotation|comment)">/g, "")

  return text;
}

export {createCodeViews};
