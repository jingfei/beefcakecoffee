(function() {
  document.getElementsByClassName("navbar-nav")[0].addEventListener("mouseover", hoverMenuIn);
  document.getElementsByClassName("navbar-nav")[0].addEventListener("mouseleave", hoverMenuOut);
  document.getElementsByClassName("navbar-nav")[0].addEventListener("mouseout", hoverMenuOut);
  document.getElementsByClassName("navbar-nav")[0].addEventListener("mouseenter", hoverMenuIn);
})();

$(window).bind("scroll", function() {
  var offset = $(document).scrollTop(),
      nav = document.getElementsByClassName("navbar-default")[0],
      navbarH = document.getElementById("navbar-collapse").offsetHeight,
      container = document.getElementsByClassName("container-fluid")[1];
  if(offset < container.offsetTop - navbarH) {
    nav.classList.remove("navbar-fixed-top");
  } else {
    nav.classList.add("navbar-fixed-top");
  }
});

const menu = [
  ["首頁", "home"],
  ["品牌故事", "story"],
  ["最新消息", "news"],
  ["猛男菜單", "menu"],
  ["堅持品質", "quality"],
  ["訓練課程", "training"],
  ["場地租借", "venue"],
  ["分店資訊", "about"],
  ["訂購咖啡", "order"]
];

function hoverMenuIn(e) {
  if(e.target.tagName.toUpperCase() !== "A") return;
  var text = e.target.innerHTML;
  for(item in menu) text = text.replace(menu[item][0], menu[item][1]);
  e.target.innerHTML = text;
}

function hoverMenuOut(e) {
  if(e.target.tagName.toUpperCase() !== "A") return;
  var text = e.target.innerHTML;
  for(item in menu) text = text.replace(menu[item][1], menu[item][0]);
  e.target.innerHTML = text;
}

