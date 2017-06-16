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
  }
  else {
    cont.style.display = "block";
    this.style.backgroundColor = "#b8b8b8";
  }
}

