function scrollToMain() {
  var body = $("html, body");
  body.stop().animate({scrollTop: bgHeight-245}, '500', 'swing');
}

const homeBacks = document.querySelectorAll('.homeBack.pureBack');
const homeBacksReverse = document.querySelectorAll('.homeBack.reverseBack');

function checkBackground() {
  homeBacks.forEach(homeBack => {
    const scrollTop = window.scrollY;
    const scrollBottom = window.scrollY + window.innerHeight;
    const isScrolled = scrollBottom > homeBack.offsetTop && scrollTop < homeBack.offsetTop + homeBack.offsetHeight;
    if (isScrolled) {
      let opacity = (scrollBottom - homeBack.offsetTop) / homeBack.offsetHeight;
      opacity = opacity - .7 < 0 ? 0 : opacity - .7;
      homeBack.firstElementChild.style.opacity = opacity * .5;
    } 
  });
}

function checkBackgroundReverse() {
  homeBacksReverse.forEach(homeBack => {
    const scrollTop = window.scrollY;
    const scrollBottom = window.scrollY + window.innerHeight;
    const isScrolled = scrollBottom > homeBack.offsetTop && scrollTop < homeBack.offsetTop + homeBack.offsetHeight;
    if (isScrolled) {
      let opacity = (scrollBottom - homeBack.offsetTop) / homeBack.offsetHeight;
      opacity = opacity - .7 < 0 ? 0 : opacity - .7;
      homeBack.firstElementChild.style.opacity = 1 - opacity * .2;
    } 
  });
}

window.addEventListener('scroll', checkBackground);
window.addEventListener('scroll', checkBackgroundReverse);

