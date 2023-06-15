import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const UserFollowing = sequelize.define(
  "userfollowing",
  {
    user_id: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "users",
        key: "id",
      },
    },
    following_id: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default UserFollowing;
