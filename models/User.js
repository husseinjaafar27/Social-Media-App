import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const User = sequelize.define(
  "users",
  {
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue: "default.png",
    },
    cover: {
      type: DataTypes.STRING,
      defaultValue: "default.png",
    },
    gender: {
      type: DataTypes.ENUM(["Male", "Female"]),
    },
    year_of_birthday: {
      type: DataTypes.DATEONLY,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    bio: {
      type: DataTypes.STRING,
    },
    otherName: {
      type: DataTypes.STRING,
    },
    job: {
      type: DataTypes.STRING,
    },
    workplace: {
      type: DataTypes.STRING,
    },
    highSchool: {
      type: DataTypes.STRING,
    },
    college: {
      type: DataTypes.STRING,
    },
    currentCity: {
      type: DataTypes.STRING,
    },
    hometown: {
      type: DataTypes.STRING,
    },
    relationship: {
      type: DataTypes.ENUM([
        "Single",
        "In a relationship",
        "Married",
        "Divorced",
      ]),
    },
    instagram: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

export default User;
