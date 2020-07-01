const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post("", multer(storage).single("image"), (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.id }, post).then(() => {
    res.status(200).json({ message: "Post updated!" });
  });
});

router.get("", (req, res, next) => {
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

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  });
});

module.exports = router;
