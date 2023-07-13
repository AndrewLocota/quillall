window.onload = function () {
  // Prevent scrolling
  document.body.style.overflow = "hidden";

  // After 2 seconds, allow scrolling
  setTimeout(function () {
    document.body.style.overflow = "auto";
  }, 2000);
};

var items = document.querySelectorAll("li");

function isItemInView(item) {
  var rect = item.getBoundingClientRect();
  var windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2;
}

function callbackFunc() {
  for (var i = 0; i < items.length; i++) {
    if (isItemInView(items[i])) {
      items[i].classList.add("show");
    }
  }
}

// listen for events
window.addEventListener("load", callbackFunc);
window.addEventListener("resize", callbackFunc);
window.addEventListener("scroll", callbackFunc);

document.querySelector(".navbar").classList.add("hidden");
window.addEventListener("scroll", function () {
  // remove the hidden class when user starts scrolling
  document.querySelector(".navbar").classList.remove("hidden");
  document.querySelector("#loading").classList.remove("hidden");
});

window.addEventListener("wheel", function (e) {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (e.deltaY > 0) {
      // The user is trying to scroll down at the end of the page.
      // Now we display the navbar and the loader.
      document.querySelector(".navbar").style.bottom = "0px";
      document.querySelector("#loading").style.bottom = "130px";

      // You can also redirect the user here:
      setTimeout(function () {
        window.location.href = "/templates/QuillAll.html";
      }, 3000);
    }
  } else {
    // if not, hide the navbar and the loader
    document.querySelector(".navbar").style.bottom = "-200px";
    document.querySelector("#loading").style.bottom = "-200px";
  }
});

window.addEventListener("scroll", function () {
  var scrollPosition = window.pageYOffset,
    blurValue = Math.min(scrollPosition / 100, 6); // Change these values to adjust blur effect
  document.querySelector(".stretchy-header").style.filter =
    "blur(" + blurValue + "px)";
});

window.addEventListener("scroll", function () {
  var main = document.querySelector("main");
  var symbols = document.querySelector("#symbols");
  var headerHeight = document.querySelector("header").offsetHeight;

  if (window.pageYOffset > headerHeight) {
    main.classList.add("slide-in");
    main.classList.remove("slide-out");
    symbols.classList.add("symbols-slide-in");
    symbols.classList.remove("symbols-slide-out");
  } else {
    main.classList.remove("slide-in");
    main.classList.add("slide-out");
    symbols.classList.remove("symbols-slide-in");
    symbols.classList.add("symbols-slide-out");
  }
});
