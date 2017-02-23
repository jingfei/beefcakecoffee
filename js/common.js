(function() {
  
})();

$(window).bind("scroll", function() {
  var offset = $(document).scrollTop();

  if(offset <= 0) {
    document.getElementsByClassName("navbar-default")[0].removeClass("navbar-fixed-top");
  } else if (offset > 100) {
    var bigimg = document.getElementById("big-img");
    if(bigimg && bigimg.style.display!="none") return;
    document.getElementsByClassName("navbar-default")[0].addClass("navbar-fixed-top");
  }
});

function scrollToMain() {
  var body = $("html, body");
  body.stop().animate({scrollTop: bgHeight-245}, '500', 'swing');
}

Element.prototype.removeClass = function(name) {
  if(!this.hasClass(name)) return this;
  this.className = this.className.replace(new RegExp('(?:^|\\s)' + name + '(?:\\s|$)'), ' ');
  return this;
};

Element.prototype.addClass = function(name) {
  if(this.hasClass(name)) return this;
  this.className += (" "+name);
  return this;
};

Element.prototype.hasClass = function(name) {
  if(this.className.indexOf(name) !== -1) return true;
  else return false;
};

