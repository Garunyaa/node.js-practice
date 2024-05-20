const express = require("express");
const dotenv = require("dotenv");
const { Worker } = require("worker_threads");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const worker = new Worker("./worker-thread.js");

app.get('/', (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Home page");
});

app.get('/slow-page', (req, res) => {
    worker.on("message", (j) => {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(`Slow page ${j}`);
    })
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});