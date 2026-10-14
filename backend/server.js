import express from "express";
import { paragraph_Generator } from "./controllers/wordControllers.js";
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/paragraph", paragraph_Generator);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
