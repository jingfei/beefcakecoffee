(function() {
  const menu_list = document.querySelectorAll(".menu_list");
  for(var i=0; i<menu_list.length; ++i) menu_list[i].addEventListener("mouseover",changePhoto);
  for(var i=0; i<menu_list.length; ++i) menu_list[i].addEventListener("mouseout",recoverPhoto);
})();

function changePhoto(e) {
  if(e.target.tagName.toUpperCase() !== "LI") return;
  imgContent = e.currentTarget.parentElement.parentElement.querySelector(".imgContent");
  imgContent.classList.add("getPicture");
  imgContent.style.backgroundImage = "url(/images/story_2.jpg)";
}

function recoverPhoto(e) {
  if(e.target.tagName.toUpperCase() !== "LI") return;
  img = e.currentTarget.parentElement.parentElement.querySelector(".imgContent");
  imgContent.classList.remove("getPicture");
  imgContent.style.backgroundImage = "";
}

