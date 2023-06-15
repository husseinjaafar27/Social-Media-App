import express, { urlencoded, json } from "express";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import postRoute from "./routes/post.js";

import sequeliz from "./database.js";

import "./associations.js";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(json());

// routes
app.use("/", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
