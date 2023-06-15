import express from "express";

import {
  acceptRequest,
  addRemoveFriend,
  followUnfollow,
  getAllProfile,
  getProfile,
  rejectRequest,
  unfriend,
  updateProfile,
} from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.get("/:id", getProfile);
router.get("/", getAllProfile);
router.patch("/updateProfile", userAuth, updateProfile);
router.post("/addFriend/:friend", userAuth, addRemoveFriend);
router.post("/followUnfollow/:follow", userAuth, followUnfollow);
router.post("/acceptRequest/:accept", userAuth, acceptRequest);
router.post("/rejectRequest/:reject", userAuth, rejectRequest);
router.post("/unfriend/:friend", userAuth, unfriend);

export default router;
