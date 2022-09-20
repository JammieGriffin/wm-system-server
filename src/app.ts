import express from "express";
import {routes} from "./routes";
import bodyParser from "body-parser";
import {PORT} from "../const"
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin:"*"
}));


app.listen(PORT, async () => {
  console.log(`App is running at ${PORT}`);
  routes(app);
});

