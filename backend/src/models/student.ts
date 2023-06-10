import { User } from "./user";
import { Year } from "./year";
import { Section } from ".";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Student extends Model {}

Student.init(
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
    },
    rollNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Roll No must be unique!", name: "rollNo" },
    },
    studentMobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentMobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Reg No must be unique!", name: "regNo" },
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Section,
        key: "id",
      },
    },
    yearId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Year,
        key: "id",
      },
    },
    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "student",
    timestamps: false,
    underscored: true,
  }
);

Student.belongsTo(Section, {
  foreignKey: "sectionId",
  as: "section",
  onDelete: "cascade",
});

Student.belongsTo(Year, {
  foreignKey: "yearId",
  as: "year",
  onDelete: "cascade",
});

Student.belongsTo(User, {
  foreignKey: "mentorId",
  as: "mentor",
});

User.hasMany(Student, {
  foreignKey: "mentorId",
  as: "student",
});
