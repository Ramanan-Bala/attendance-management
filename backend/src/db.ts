import { Sequelize } from "sequelize";

import dotenv from "dotenv";
import path from "path";
dotenv.config();

export const sequelize = new Sequelize(
  "attendance-management",
  process.env.DBUSER ? process.env.DBUSER : "",
  process.env.PASSWORD ? process.env.PASSWORD : "",
  {
    dialect: "sqlite",
    storage: path.join(__dirname + "/db/db.sqlite"),
    logging: false,
  }
);
