(function() {
  console.log("admin");
  const carets = document.querySelectorAll(".caret-down");
  for(var i=0; i<carets.length; ++i)
    carets[i].addEventListener("click",expandCaret);
})();

function expandCaret() {
  var cont = this.parentElement.querySelector(".content");
  if(cont.style.display === "block") {
    cont.style.display = "none";
    this.style.backgroundColor = "";
    checkIfHidePanel();
  }
  else {
    cont.style.display = "block";
    this.style.backgroundColor = "#b8b8b8";
    querySelector("#editor-panel").style.display = "block";
  }
}

function checkIfHidePanel() {
  var contents = document.querySelectorAll(".block .content");
  var allHide = true;
  for(var i=0; i<contents.length; ++i)
    if(contents.style.display === "block") allHide=false;
  if(allHide) document.querySelector("#editor-panel").style.diaply = "";
}

