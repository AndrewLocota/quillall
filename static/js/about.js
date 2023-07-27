window.onload = function () {
  // Prevent scrolling
  document.body.style.overflow = "hidden";
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0;

  // After 2 seconds, allow scrolling
  setTimeout(function () {
    document.body.style.overflow = "auto";
  }, 2000);
};

// Initialize ScrollMagic controller
var controller = new ScrollMagic.Controller();

var items = document.querySelectorAll("li");
var aboutBox = document.querySelector(".about-box");

// Create a scene for each item
items.forEach(function (item, index) {
  new ScrollMagic.Scene({
    triggerElement: item, // trigger animation when this element is in view
    duration: "100%", // animate for the duration of 100% of the viewport height
  })
    .setClassToggle(item, "show") // add class 'show' to item
    .on("enter", function () {
      // When the item enters the viewport, update the about box content
      aboutBox.textContent = "Content for item " + (index + 1);
    })
    .addTo(controller); // assign this scene to our ScrollMagic Controller
});

// Create a scene for the first ul element
new ScrollMagic.Scene({
  triggerElement: "ul:first-of-type", // trigger animation when the first ul is in view
  duration: "200%", // animate for the duration of 200% of the viewport height
})
  .setClassToggle(".about-box", "fixed-position") // add class 'fixed-position' to .about-box
  .addTo(controller); // assign this scene to our ScrollMagic Controller

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
