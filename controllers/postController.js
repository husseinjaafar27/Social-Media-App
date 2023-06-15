import fs from "fs";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import SavedPost from "../models/SavedPost.js";
import User from "../models/User.js";

export const create = async (req, res) => {
  const { id } = req.user;
  const { type, text, background } = req.body;
  try {
    const post = await Post.create({
      user_id: id,
      type,
      text,
      image: req.file ? req.file.filename : null,
      background,
    });
    return res.status(200).json({ message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: { model: User, attributes: ["id"] },
    });
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.body;
  try {
    const post = await Post.findByPk(id);

    return res.status(200).json({ post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.user;
  const { post } = req.params;
  try {
    const getPost = await Post.findOne({ where: { id: post, user_id: id } });
    if (!getPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (getPost.image !== "default.png") {
      if (fs.existsSync("uploads/post/" + getPost.image))
        fs.unlinkSync("uploads/post/" + getPost.image);
    }
    await Post.destroy({
      where: { id: post, user_id: id },
    });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const comment = async (req, res) => {
  const { id } = req.user;
  const { post } = req.params;
  const { comment, image } = req.body;
  try {
    const getPost = await Post.findByPk(post);
    if (!getPost) return res.status(404).json({ message: "Post not found" });
    await Comment.create({
      post_id: getPost.id,
      comment,
      image,
      comment_By: id,
    });
    const q = await Comment.findAll({
      where: { post_id: post },
      include: {
        model: Post,
        include: { model: User, attributes: ["id"] }, // This attribute for User
        attributes: ["id"], // This attriition for Post
      },
    });
    return res.status(200).json(q);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const savePost = async (req, res) => {
  const { id } = req.user;
  const { post } = req.params;
  try {
    const checkPost = await Post.findByPk(post);
    if (!checkPost) {
      return res.status(404).json({ message: "No post found" });
    }
    const check = await SavedPost.findOne({
      where: { user_id: id, post_id: post },
    });

    if (!check) {
      await SavedPost.create({ user_id: id, post_id: post });
      return res.status(200).json({ message: "Post saved successfully" });
    } else {
      await SavedPost.destroy({ where: { user_id: id, post_id: post } });
      return res.status(200).json({ message: "Post unsaved successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
