import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Section extends Model {}

Section.init(
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
      unique: { name: "section", msg: "Section must be unique!" },
    },
  },
  {
    sequelize,
    modelName: "section",
    timestamps: false,
  }
);
