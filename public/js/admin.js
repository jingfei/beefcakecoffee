var expandFirst = false;

(function() {
  const carets = document.querySelectorAll(".block > div");
  for(var i=0; i<carets.length; ++i)
    carets[i].addEventListener("click",expandBlock);
  document.querySelector("#newPost").addEventListener("click",newPost);
})();

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

function newPost() {
  var title = document.querySelector("#title-new").value;
  var content = nicEditors.findEditor('editor-new').getContent();
  var params = "title="+title+"&content="+content;
  console.log(params);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(this.responseText === "success") location.reload();
      console.log("response:");
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", "/newpost", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("Content-length", params.length);
  xhttp.setRequestHeader("Connection", "close");
  xhttp.send(params)
}

function updateId(id) {
  var title = document.querySelector("#title-"+id).value;
  var content = nicEditors.findEditor('editor-content-'+id).getContent();
  var params = "title="+title+"&content="+content;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(this.responseText === "success") location.reload();
      console.log("response:");
      console.log(this.responseText);
    }
  };
  xhttp.open("PUT", "/updatepost/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("Content-length", params.length);
  xhttp.setRequestHeader("Connection", "close");
  xhttp.send(params)
}

function deleteId(id) {
  if(!confirm('確定要刪除此文章？')) return;
  var params = "_method=delete";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(this.responseText === "success") location.reload();
    }
  };
  xhttp.open("DELETE", "/deletepost/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("Content-length", params.length);
  xhttp.setRequestHeader("Connection", "close");
  xhttp.send()
  
}

