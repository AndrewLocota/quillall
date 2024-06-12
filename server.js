const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/save-email", (req, res) => {
  const email = req.body.email;

  if (!email) {
    console.error("No email provided");
    return res.status(400).send({ message: "No email provided" });
  }

  // Define the path to the log file
  const logFilePath = path.join(__dirname, "emails.txt");

  // Append the email to the log file with a newline
  fs.appendFile(logFilePath, `${email}\n`, (err) => {
    if (err) {
      console.error("Failed to save email:", err);
      return res.status(500).send({ message: "Failed to save email." });
    } else {
      res.status(200).send({ message: "Email saved successfully!" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
