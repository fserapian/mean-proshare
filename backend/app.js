const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

app = express();

mongoose
  .connect("mongodb://localhost:27017/meanpro", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db"))
  .catch(() => console.log("Connection failed"));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    console.log(createdPost);
    res
      .status(201)
      .json({ postId: createdPost._id, message: "Post added successfully" });
  }); // Save the requested post to the database
});

app.get("/api/posts", (req, res, next) => {
  // const posts = [
  //   {
  //     id: "hfdsashgsa",
  //     title: "First Post",
  //     content: "This is the first post",
  //   },
  //   {
  //     id: "fsdkgfsdff",
  //     title: "Second Post",
  //     content: "This is the second post",
  //   },
  //   {
  //     id: "fhdsgfsdir",
  //     title: "Third Post",
  //     content: "This is the third post",
  //   },
  // ];
  Post.find().then((documents) => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  });
});

module.exports = app;
