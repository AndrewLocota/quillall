window.onload = function () {
  // Prevent scrolling
  document.body.style.overflow = "hidden";

  // After 2 seconds, allow scrolling
  setTimeout(function () {
    document.body.style.overflow = "auto";
  }, 2000);
};

var items = document.querySelectorAll("li");
var targetPosition;

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

      // Check if the first "ul" element has just received the "show" class
      if (
        items[i] === document.querySelector("ul li:first") &&
        !targetPosition
      ) {
        // Store the current scroll position as the target position
        targetPosition = window.pageYOffset;
      }
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

    // Check if 'slide-in' class is present
    if (main.classList.contains("slide-in")) {
      // Animate the 'about-box' to the top
      $(".about-box")
        .addClass("fixed-position")
        .stop()
        .animate({ top: "0" }, 450, "linear");
    }
  } else {
    main.classList.remove("slide-in");
    main.classList.add("slide-out");
    symbols.classList.remove("symbols-slide-in");
    symbols.classList.add("symbols-slide-out");

    // Check if 'slide-out' class is present
    if (main.classList.contains("slide-out")) {
      // Animate the 'about-box' to its original position
      $(".about-box")
        .removeClass("fixed-position")
        .stop()
        .animate({ top: "48%" }, 500, "linear"); // replace '10px' with the actual original top position of the 'about-box'
    }
  }
});
