import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Subject extends Model {}

Subject.init(
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
      unique: { name: "name", msg: "Subject name must be unique!" },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { name: "code", msg: "Subject code must be unique!" },
    },
  },
  {
    sequelize,
    modelName: "subject",
    timestamps: false,
  }
);
