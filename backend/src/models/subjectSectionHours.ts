import { Section, Subject } from ".";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class SubjectSectionHours extends Model {}

SubjectSectionHours.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    totalHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Section,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "subject_section_hours",
    timestamps: false,
    underscored: true,
  }
);

SubjectSectionHours.belongsTo(Subject, {
  foreignKey: "subjectId",
  as: "subject",
  onDelete: "cascade",
});

SubjectSectionHours.belongsTo(Section, {
  foreignKey: "sectionId",
  as: "section",
});
