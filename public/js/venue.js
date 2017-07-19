(function() {
  const vip = document.querySelectorAll(".VIP1,.VIP2");
  for(var i=0; i<vip.length; ++i) vip[i].addEventListener("mouseover",changePhoto);
  for(var i=0; i<vip.length; ++i) vip[i].addEventListener("mouseout",recoverPhoto);
})();

function changePhoto(e) {
  vip = e.target.classList.contains("VIP1") ? 1 : e.target.classList.contains("VIP2") ? 2 : 0;
  if(vip === 1) {
    const vip1 = document.querySelectorAll(".VIP1");
    for(var i=0; i<vip1.length; ++i) vip1[i].classList.add("vip-hover");
    document.querySelector("#origin-img").classList.remove("active");
    document.querySelector("#VIP1").classList.add("active");
    document.querySelector("#VIP2").classList.remove("active");
  }
  else if(vip === 2) {
    const vip2 = document.querySelectorAll(".VIP2");
    for(var i=0; i<vip2.length; ++i) vip2[i].classList.add("vip-hover");
    document.querySelector("#origin-img").classList.remove("active");
    document.querySelector("#VIP1").classList.remove("active");
    document.querySelector("#VIP2").classList.add("active");
  }
}

function recoverPhoto(e) {
  const vip = document.querySelectorAll(".vip-hover");
  for(var i=0; i<vip.length; ++i) vip[i].classList.remove("vip-hover");
  document.querySelector("#origin-img").classList.add("active");
  document.querySelector("#VIP1").classList.remove("active");
  document.querySelector("#VIP2").classList.remove("active");
}

