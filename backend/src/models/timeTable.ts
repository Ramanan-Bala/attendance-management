import { Year } from "./year";
import { Subject } from "./subject";
import { Section } from "./section";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class TimeTable extends Model {}
TimeTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day: {
      type: DataTypes.STRING,
      allowNull: false,
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
    period1SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    period2SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    period3SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    period4SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    period5SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    period6SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    period7SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    period8SubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "time_table",
    timestamps: false,
    underscored: true,
  }
);

TimeTable.belongsTo(Year, {
  foreignKey: "yearId",
  as: "year",
  onDelete: "cascade",
});

TimeTable.belongsTo(Section, {
  foreignKey: "sectionId",
  as: "section",
  onDelete: "cascade",
});

TimeTable.belongsTo(Subject, {
  foreignKey: "period1SubjectId",
  as: "period1Subject",
  onDelete: "cascade",
});
TimeTable.belongsTo(Subject, {
  foreignKey: "period2SubjectId",
  as: "period2Subject",
  onDelete: "cascade",
});
TimeTable.belongsTo(Subject, {
  foreignKey: "period3SubjectId",
  as: "period3Subject",
  onDelete: "cascade",
});
TimeTable.belongsTo(Subject, {
  foreignKey: "period4SubjectId",
  as: "period4Subject",
  onDelete: "cascade",
});
TimeTable.belongsTo(Subject, {
  foreignKey: "period5SubjectId",
  as: "period5Subject",
  onDelete: "cascade",
});
TimeTable.belongsTo(Subject, {
  foreignKey: "period6SubjectId",
  as: "period6Subject",
  onDelete: "cascade",
});
TimeTable.belongsTo(Subject, {
  foreignKey: "period7SubjectId",
  as: "period7Subject",
  onDelete: "cascade",
});
TimeTable.belongsTo(Subject, {
  foreignKey: "period8SubjectId",
  as: "period8Subject",
  onDelete: "cascade",
});
