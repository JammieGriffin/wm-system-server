import express, { NextFunction } from "express";
import { routes } from "./routes";
import bodyParser from "body-parser";
import checkAuth from "./middleware";
import { PORT } from "../const";
const cors = require("cors");
const app = express();

app.use(express.json());
app.all("/*",checkAuth)
app.use(
  cors({
    origin: "*",
  })
);

app.listen(PORT, async () => {
  console.log(`App is running at ${PORT}`);
  routes(app);
});
