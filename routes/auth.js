import express from "express";
import multer from "multer";
import {
  activateUser,
  addProfileCover,
  changePassword,
  deleteUser,
  forgetPassword,
  login,
  register,
  updateUser,
  validateResetCode,
} from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/user");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "+" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  register
);
router.patch("/activate", activateUser);
router.post("/login", login);
router.patch("/update", userAuth, updateUser);
router.delete("/", userAuth, deleteUser);
router.post("/forgetPassword", forgetPassword);
router.post("/validatePassword", validateResetCode);
router.patch("/changePassword", changePassword);
router.patch(
  "/addImg",
  userAuth,
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  addProfileCover
);

export default router;
