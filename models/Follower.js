import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Follower = sequelize.define(
  "followers",
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

export default Follower;
