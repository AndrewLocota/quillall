$(function () {
  fetch("demographics.json")
    .then((response) => response.json())
    .then((demographics) => {
      $("#demographic-input").autocomplete({
        source: demographics,
      });
    })
    .catch((error) => console.error("Error:", error));

  const editor = new EditorJS({
    holder: "article-input",
    tools: {
      paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      // ... other tools
    },
  });

  var clearAllButton = $("#clear-all");
  var demographicList = $("#demographic-list");

  fetch("demographics.json")
    .then((response) => response.json())
    .then((demographics) => {
      $("#demographic-input").autocomplete({
        source: demographics,
      });

      $(".ui-helper-hidden-accessible").remove();

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
              $("#demographic-list-wrapper").addClass("invisible");
            }
          });

        li.append(remove);
        demographicList.append(li);
        clearAllButton.addClass("show");
        $("#demographic-list-wrapper").removeClass("invisible");
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
    $("#demographic-list-wrapper").addClass("invisible");
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
    updateDemographicsWrapper(); // Call function here when all demographics are cleared
  });

  $("#submit-article").click(function () {
    editor
      .save()
      .then((outputData) => {
        var article = outputData.blocks
          .map((block) => block.data.text)
          .join("\n");
        var demographics = [];
        $("#demographic-list li").each(function () {
          demographics.push($(this).find(".demographic-text").text());
        });

        if (!article.trim()) {
          $(this).addClass("shake");
          setTimeout(() => $(this).removeClass("shake"), 350);
          return;
        }

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
          body: JSON.stringify({
            article: article,
            demographics: demographics,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Response from server:", data);

            data.rewritten_texts.forEach(function (rewritten_text, index) {
              var textarea = $("<textarea>")
                .attr("id", "response-textarea-" + index)
                .addClass("response-textarea")
                .val(rewritten_text);
              $("#response-container").append(textarea);
            });

            $("#response-container").show();
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            $("#fixed-part").hide();
            $("#article-input").removeClass("loading frosted-glass pop-out");
            $(".loader").hide();
            $("#article-input").hide();
            $(".response-textarea").show();
          });
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  });

  $("#refresh-page").click(function () {
    location.reload();
  });
});
