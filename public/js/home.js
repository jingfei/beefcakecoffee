var bgHeight;
var disableTop = false;

(function() {
  window.scrollTo(0,0);
  bgHeight = $("#big-img").height();
})();

$(window).bind("scroll", function() {
  if(disableTop) return;

  var offset = $(document).scrollTop(),
      opacity = 0;

  if(offset < bgHeight - 250) {
    opacity = 1-offset/(bgHeight-250);
    $("#big-img").css("opacity",opacity);
    document.getElementById("big-img").style.opacity = opacity;
    document.getElementsByClassName("navbar-default")[0].style.opacity = 1-opacity;
  } else {
    document.getElementById("big-img").style.display = "none";
    document.getElementsByClassName("navbar-default")[0].style.marginTop = "";
    disableTop = true;
  }
});

function scrollToMain() {
  var body = $("html, body");
  body.stop().animate({scrollTop: bgHeight-245}, '500', 'swing');
}
