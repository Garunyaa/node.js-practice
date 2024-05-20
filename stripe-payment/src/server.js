import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "../src/routes/routes.js";
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", paymentRoutes)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});