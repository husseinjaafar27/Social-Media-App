import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import User from "../models/User.js";
import Code from "../models/Code.js";
import { validateEmail, validateUsername } from "../helpers/validation.js";
import { sendMailPassword } from "../helpers/email.js";
import { generateCode } from "../helpers/generateCode.js";

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.expiresIn,
  });
  return token;
};

export const register = async (req, res) => {
  const {
    first_name,
    last_name,
    username,
    email,
    password,
    gender,
    year_of_birthday,
  } = req.body;
  try {
    if (
      !first_name ||
      !last_name ||
      !password ||
      !gender ||
      !year_of_birthday
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let profile, cover;
    if (req.files.profile)
      profile = req.files ? req.files["profile"][0].filename : "default.png";
    if (req.files["cover"])
      cover = req.files ? req.files["cover"][0].filename : "default.png";

    const checkEmail = await User.findOne({ where: { email: email } });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "The email is not valid" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be greater than or equal to 6" });
    }

    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      first_name,
      last_name,
      username: newUsername,
      email,
      password: hashedPassword,
      gender,
      year_of_birthday,
      picture: profile,
      cover: cover,
    });
    const token = signToken(newUser.id);
    const code = generateCode(5);
    await new Code({
      code,
      user: newUser.id,
    }).save();
    sendMailPassword(newUser.email, newUser.fullName, code);
    return res.status(200).json({
      message:
        "User created successfully! Your verified code is sent to your email address",
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const activateUser = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        message: "invalid email address",
      });
    }
    const Dbcode = await Code.findOne({ where: { user: user.id } });
    if (!Dbcode) {
      return res.status(404).json({ message: "Code not found" });
    }
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    if (user.verified == 1) {
      return res.status(401).json({
        message: "Your account is already verified",
      });
    }
    user.verified = true;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Your account has been verified" });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "Email is not exists" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    if (user.isVerified == 0) {
      const code = generateCode(5);
      await new Code({
        code,
        user: newUser.id,
      }).save();
      sendMailPassword(newUser.email, newUser.fullName, code);
    }
    const token = signToken(user.id);
    return res.status(200).json({
      message: "login successfully",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const updateUser = async (req, res) => {
  const { first_name, last_name, gender, year_of_birthday } = req.body;
  const { id } = req.user;
  try {
    const user = await User.findByPk(id);
    if (first_name || last_name) {
      user.first_name = first_name ? first_name : user.first_name;
      user.last_name = last_name ? last_name : user.last_name;
      let tempUsername = first_name + last_name;
      let newUsername = await validateUsername(tempUsername);
      user.username = newUsername;
    }
    user.gender = gender ? gender : user.gender;
    user.year_of_birthday = year_of_birthday
      ? year_of_birthday
      : user.year_of_birthday;
    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findOne({ where: { id: id } });

    if (user.picture !== "default.png") {
      if (fs.existsSync("uploads/user/" + user.picture))
        fs.unlinkSync("uploads/user/" + user.picture);
    }
    if (user.cover !== "default.png") {
      if (fs.existsSync("uploads/user/" + user.cover))
        fs.unlinkSync("uploads/user/" + user.cover);
    }
    await User.destroy({ where: { id: user.id } });
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        message: "invalid email address",
      });
    }
    await Code.destroy({ where: { user: user.id } });
    const code = generateCode(5);
    await new Code({
      code,
      user: user.id,
    }).save();
    sendMailPassword(user.email, user.fullName, code);
    return res.status(200).json({
      message: "Email reset code has been sent to your email",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({
        message: "Invalid email address",
      });
    }
    const Dbcode = await Code.findOne({ where: { user: user.id } });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    return res
      .status(200)
      .json({ message: "You can now change your password" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;

    if (!email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ where: { email: email } });
    if (password.length <= 6) {
      return res
        .status(404)
        .json({ message: "Password must be greater than or equal to 6" });
    }
    if (password !== passwordConfirm) {
      return res
        .status(404)
        .json({ message: "Password and passwword confrim must be the same" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addProfileCover = async (req, res) => {
  const { id } = req.user;
  try {
    let profile, cover;
    const user = await User.findByPk(id);
    if (req.files.profile) {
      profile = req.files ? req.files["profile"][0].filename : "default.png";
      user.picture = profile;
    }
    if (req.files["cover"]) {
      cover = req.files ? req.files["cover"][0].filename : "default.png";
      user.cover = cover;
    }
    const updated = await user.save();
    return res
      .status(200)
      .json({ message: "User updated successfully", updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
