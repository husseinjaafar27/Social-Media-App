import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const SavedPost = sequelize.define(
  "savedPosts",
  {
    user_id: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "users",
        key: "id",
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "posts",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default SavedPost;
