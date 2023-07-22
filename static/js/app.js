$(function () {
  fetch("/demographics.json")
    .then((response) => response.json())
    .then((demographics) => {
      $("#demographic-input").autocomplete({
        source: demographics,
      });
    })
    .catch((error) => console.error("Error:", error));
});

var clearAllButton = $("#clear-all");
var demographicList = $("#demographic-list");
var demographicsData;

fetch("/demographics.json")
  .then((response) => response.json())
  .then((demographics) => {
    $("#demographic-input").autocomplete({
      source: demographics,
    });

    setInterval(function () {
      let randomIndex1, randomIndex2;
      do {
        randomIndex1 = Math.floor(Math.random() * demographics.length);
        randomIndex2 = Math.floor(Math.random() * demographics.length);
      } while (randomIndex1 === randomIndex2);

      let example1 = demographics[randomIndex1];
      let example2 = demographics[randomIndex2];
      $("#demographic-input").attr(
        "placeholder",
        `e.g. ${example1}, ${example2}...`
      );
    }, 3500);
  })
  .catch((error) => console.error("Error:", error));

$("#add-demographic").click(function (event) {
  event.stopPropagation();

  var input = $("#demographic-input");
  var demographics = input.val().split(",");
  input.val("");

  demographics.forEach(function (demographic) {
    demographic = demographic.trim();

    if (demographic) {
      var li = $("<li>").addClass("demographic-item");

      var demographicText = $("<span>")
        .addClass("demographic-text")
        .text(demographic);
      li.append(demographicText);

      var remove = $("<span>")
        .text("X")
        .addClass("remove-demographic")
        .click(function () {
          li.remove();
          if (!demographicList.hasChildNodes()) {
            clearAllButton.removeClass("show");
          }
        });

      li.append(remove);
      demographicList.append(li);
      clearAllButton.addClass("show");
    }
  });
});

$("#demographic-input").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
    $("#add-demographic").click();
  }
});

$("#clear-all").click(function () {
  demographicList.empty();
  clearAllButton.removeClass("show");
});

$("#submit-article").click(function () {
  var article = $("#article-input").val();
  var demographics = [];
  $("#demographic-list li").each(function () {
    demographics.push($(this).find(".demographic-text").text());
  });

  console.log("Sending data:", {
    article: article,
    demographics: demographics,
  });

  $("#article-input").addClass("frosted-glass pop-out");
  $("#article-input").addClass("loading");
  $(".loader").show();

  fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ article: article, demographics: demographics }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data);

      data.rewritten_texts.forEach(function (rewritten_text, index) {
        var textarea = $("<textarea>")
          .attr("id", "response-textarea-" + index)
          .addClass("response-textarea")
          .val(rewritten_text);
        // Append the new textarea to the #response-container
        $("#response-container").append(textarea);
      });

      $("#response-container").show(); // Show the response container
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      $("#fixed-part").hide(); // Hide the textarea and the submit button
      $("#article-input").removeClass("loading frosted-glass pop-out");
      $(".loader").hide();
      $("#article-input").hide(); // Hide the article input
      $(".response-textarea").show();
    });
});

$("#article-input").on("input", function () {
  let inputLength = $(this).val().length;
  let remaining = 4000 - inputLength;
  if (remaining < 0) {
    $(this).css("color", "red");
  } else {
    $(this).css("color", "black");
  }
  $("#counter").text(`${inputLength}/4000`);
});

$("#article-input").click(function () {
  // If there are any response textareas, remove them and show the article input
  if ($(".response-textarea").length > 0) {
    $(".response-textarea").show();
    $("response-item").addClass("pop-out");
    $("#article-input").hide();
  }
});

$("#refresh-page").click(function () {
  location.reload();
});
