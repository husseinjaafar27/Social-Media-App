import express from "express";
import multer from "multer";

import userAuth from "../middlewares/userAuth.js";
import {
  comment,
  create,
  deletePost,
  getPost,
  getPosts,
  savePost,
} from "../controllers/postController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/post");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "+" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post("/create", userAuth, upload.single("image"), create);
router.get("/", getPosts);
router.get("/:id", getPost);
router.delete("/:post", userAuth, deletePost);
router.post("/comment/:post", userAuth, comment);
router.post("/save/:post", userAuth, savePost);

export default router;
