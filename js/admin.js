var expandFirst = false;

(function() {
  const carets = document.querySelectorAll(".block > div");
  for(var i=0; i<carets.length; ++i)
    carets[i].addEventListener("click",expandBlock);
})();

bkLib.onDomLoaded(function() {
  var editors = new nicEditor({
    fullPanel: true,
    iconsPath: '/images/nicEditorIcons.gif',
    onSave: function(content, id, instance){
      alert('save button clicked for element '+id+' = '+content);
    }
  });
  editors.setPanel('editor-panel');
  editors.addInstance('editor-content-1');
  editors.addInstance('editor-content-2');
  editors.addEvent('focus', function() {
    document.querySelector("#editor-panel").style.display = "block";
  });
  editors.addEvent('blur', function() {
    document.querySelector("#editor-panel").style.display = "";
  });
  
  editorNew = new nicEditor({iconsPath: '/images/nicEditorIcons.gif'}).panelInstance('editor-new');
    // buttonList : [
    //   'bold','italic','underline','strikethrough',
    //   'left','center','right','justify',
    //   'ol', 'ul',
    //   'indent', 'outdent',
    //   'forecolor', 'bgcolor',
    //   'subscript','superscript',
    //   'removeformat', 'hr'
    // ],
  //   fullPanel: true,
  //   iconsPath: '/images/nicEditorIcons.gif'
  // }).panelInstance('editor');
});

function expandBlock(e) {
  if(!expandFirst) {
    document.querySelector("#editor-new").parentElement.querySelector(".content > div").style.width= "100%";
    expandFirst = true;
  }
  var block = e.currentTarget.parentElement;
  var cont = block.querySelector(".content");
  if(e.currentTarget === cont) return;
  var caret = block.querySelector(".caret-down");
  if(cont.style.display === "block") {
    cont.style.display = "none";
    if(caret) caret.style.backgroundColor = "";
  }
  else {
    cont.style.display = "block";
    if(caret) caret.style.backgroundColor = "#b8b8b8";
  }
}

function checkIfHidePanel() {
  var contents = document.querySelectorAll(".block .content");
  var allHide = true;
  for(var i=1; i<contents.length; ++i)
    if(contents[i].style.display === "block") allHide=false;
  if(allHide) document.querySelector("#editor-panel").style.display = "";
}

function test() {
  console.log(nicEditors.findEditor('editor-content-1').getContent());
}

