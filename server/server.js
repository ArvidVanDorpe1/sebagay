import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import Userrouter from "./rest/users.js";
import Authrouter from "./rest/auth.js";
import { connectToMongo } from "./database/conn.js";

//app init
const app = express();

//config init
dotenv.config();

//middleware config
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes config
app.use("/api/users", Userrouter);
app.use("/api/auth", Authrouter);

//db config
connectToMongo(process.env.MONGO_URL);

//app config
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`\u001b[1;34m API Server luistert op poort ${port}`);
});
