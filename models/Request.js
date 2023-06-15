import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Request = sequelize.define(
  "request",
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

export default Request;
