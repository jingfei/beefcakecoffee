var bgHeight;
var disableTop = false;

(function() {
  window.scrollTo(0,0);
  bgHeight = $("#big-img").height();
  console.log(bgHeight);
})();

$(window).bind("scroll", function() {
  var offset = $(document).scrollTop(),
      opacity = 0;
  console.log(offset);
  if(disableTop) return;
  if(offset < bgHeight - 250) {
    document.getElementById("big-img").style.visibility = "visible";
    opacity = 1-offset/(bgHeight-250);
    $("#big-img").css("opacity",opacity);
    document.getElementsByClassName("navbar-default")[0].style.zIndex = "-1";
  } else if (offset < bgHeight - 245) {
    document.getElementById("big-img").style.visibility = "hidden";
    document.getElementsByClassName("navbar-default")[0].style.zIndex = "100";
  } else {
    document.getElementById("big-img").style.display = "none";
    document.getElementsByClassName("navbar-default")[0].style.marginTop = "0";
    disableTop = true;
  }
});

function scrollToMain() {
  var body = $("html, body");
  body.stop().animate({scrollTop: bgHeight-245}, '500', 'swing');
}
