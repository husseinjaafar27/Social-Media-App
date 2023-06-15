import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Post = sequelize.define(
  "posts",
  {
    user_id: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "users",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM(["profilePicture", "coverPicture", "post"]),
    },
    text: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    background: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

export default Post;
