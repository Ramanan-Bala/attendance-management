import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Year extends Model {}

Year.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: "year", msg: "Year must be unique!" },
    },
  },
  {
    sequelize,
    modelName: "year",
    timestamps: false,
  }
);
