import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Comment = sequelize.define(
  "comments",
  {
    post_id: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "posts",
        key: "id",
      },
    },
    comment: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    comment_By: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

export default Comment;
