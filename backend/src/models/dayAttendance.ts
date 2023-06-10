import { Student } from ".";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class DayAttendance extends Model {}

DayAttendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Student,
        key: "id",
      },
    },
    isAbsent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isOd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reason: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "day_attendance",
    timestamps: false,
    underscored: true,
  }
);

DayAttendance.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
  onDelete: "cascade",
});
