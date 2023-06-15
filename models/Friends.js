import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Friends = sequelize.define(
  "friends",
  {
    user_id: {
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

export default Friends;
