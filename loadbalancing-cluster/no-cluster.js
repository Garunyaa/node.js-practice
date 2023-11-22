const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.get("/slow-page", (req, res) => {
  for (let i = 0; i < 5000000000; i++) {}
  res.send("Slow page");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
