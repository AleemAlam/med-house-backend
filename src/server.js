const express = require("express");
const connect = require("./config/db");
const userController = require("./controllers/user.controller");
const postController = require("./controllers/post.controller");
const commentController = require("./controllers/comment.controller");
var bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/uploads"));

app.use("/users", userController);
app.use("/post", postController);
app.use("/comment", commentController);

const start = async () => {
  await connect();

  app.listen(process.env.PORT || 3300, () => {
    console.log(`Port is listening on 3300`);
  });
};

start();
