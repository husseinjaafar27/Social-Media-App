import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Search = sequelize.define(
  "search",
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

export default Search;
