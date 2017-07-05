var expandFirst = false;

(function() {
  const addButton = document.querySelector("#addButton").addEventListener("click", expandBlock);
  const carets = document.querySelectorAll(".block > div");
  for(var i=2; i<carets.length; ++i)
    carets[i].addEventListener("click",expandBlock);
  document.querySelector("#newPost").addEventListener("click",newPost);
  document.querySelector("#clearNewPost").addEventListener("click",clearNewPost);
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

function newPost() {
  var title = document.querySelector("#title-new").value;
  var content = nicEditors.findEditor('editor-new').getContent();
  if(title.length === 0 || content.length === 0) {
    alert("請填入標題及內容");
    return;
  }
  var params = "title="+title+"&content="+content;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(this.responseText.includes("success")) location.reload();
      else {
        alert("新增發生錯誤，請聯絡管理員");
        console.log("response:");
        console.log(this.responseText);
      }
    }
  };
  xhttp.open("POST", "/newpost", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(params)
}

function updateId(id) {
  var title = document.querySelector("#title-"+id).value;
  var content = nicEditors.findEditor('editor-content-'+id).getContent();
  var params = "title="+title+"&content="+content;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(this.responseText.includes("success")) location.reload();
      else {
        alert("更新發生錯誤，請聯絡管理員");
        console.log("response:");
        console.log(this.responseText);
      }
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
      if(this.responseText.includes("success")) location.reload();
      else {
        alert("刪除發生錯誤，請聯絡管理員");
        console.log("response:");
        console.log(this.responseText);
      }
    }
  };
  xhttp.open("DELETE", "/deletepost/"+id, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.setRequestHeader("Content-length", params.length);
  xhttp.setRequestHeader("Connection", "close");
  xhttp.send()
  
}

function clearNewPost() {
  if(!confirm("確認清除目前新文章內容？")) return;
  document.querySelector("#title-new").value = '';
  nicEditors.findEditor('editor-new').setContent('');
}

