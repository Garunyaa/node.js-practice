const cluster = require("cluster");
const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

const numOfWorkers = require("os").availableParallelism();
// console.log("Num of workers:", numOfWorkers);

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);
  for (let i = 0; i < numOfWorkers; i++) {
    cluster.fork();
  }
} else {
  console.log(`Worker ${process.pid} started`);
  

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.get("/slow-pages", (req, res) => {
  for (let i = 0; i < 5000000000; i++) {}
  res.send("Slow page");
});
