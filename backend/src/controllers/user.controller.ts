import { Request, Response } from "express";
import { UserService } from "../services";
import { Student, User } from "../models";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../db";
import { Op } from "sequelize";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService(User);
  }

  private options = {
    attributes: [
      "id",
      "name",
      "role",
      "email",
      [sequelize.fn("COUNT", "student.id"), "studentsCount"],
    ],
    include: [
      {
        model: Student,
        as: "student",
        attributes: [],
      },
    ],
    where: { role: "MENTOR" },
    group: ["user.id"],
  };

  // getPaged(req: Request, res: Response) {
  //   this.userService.getAll(this.options).then((users) => {
  //     res.status(200).json(users);
  //   });
  // }

  getAll(req: Request, res: Response) {
    this.userService.getAll(this.options).then((users) => {
      res.status(200).json(users);
    });
  }

  getById(req: Request, res: Response) {
    const { id } = req.params;
    this.userService.get(id, this.options).then((user) => {
      if (user) {
        Student.findAll({
          where: {
            mentorId: {
              [Op.or]: [null, id],
            },
          },
          order: [["mentorId", "ASC"]],
        }).then((students) => {
          let studentId: any = [];
          students.forEach((s) => studentId.push(s.dataValues));
          let data = { ...user.dataValues, students };
          res.status(200).json(data);
        });
      } else
        res.status(404).json({
          message: `User id:${id} does not exists`,
        });
    });
  }

  async post(req: Request, res: Response) {
    const { name, email, password, studentId } = req.body;

    this.userService
      .find({ where: { email } })
      .then((user) => {
        if (user)
          return res.status(409).send("User Already Exist. Please Login");
      })
      .catch((err) => res.status(400).json(err));

    let encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role: "MENTOR",
    });

    const t = await sequelize.transaction();

    User.create(user.dataValues, { transaction: t })
      .then((user) => {
        delete user.dataValues.password;
        if (studentId.length > 0)
          Student.update(
            { mentorId: user.dataValues.id },
            { where: { id: studentId }, transaction: t }
          )
            .then((upS) => {
              t.commit();
              res.status(201).json(user);
            })
            .catch((err) => {
              t.rollback();
              res.status(400).json(err);
            });
      })
      .catch((err) => {
        t.rollback();
        res.status(400).json(err);
      });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    this.userService
      .find({ where: { email } })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.dataValues.password).then((checked) => {
            if (checked) {
              const token = jwt.sign(
                {
                  userId: user.dataValues.id,
                  email,
                  role: user.dataValues.role,
                },
                process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "",
                {
                  expiresIn: "2h",
                }
              );

              user.dataValues.token = token;
              delete user.dataValues.password;

              res.status(200).json(user);
            } else {
              res.status(401).send("Invalid Credentials");
            }
          });
        } else res.status(401).send("Invalid Credentials");
      })
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.userService.get(req.params.id).then(async (user) => {
      if (user) {
        let updatedUser = new User({
          ...user.dataValues,
          ...data,
        });

        const t = await sequelize.transaction();

        Student.findAll({ where: { mentorId: req.params.id } }).then(
          (students) => {
            console.clear();

            let studentId: any[] = [];
            students.forEach((student) => {
              studentId.push(student.dataValues.id);
            });
            studentId = studentId.filter((id) => !data.studentId.includes(id));

            Student.update(
              { mentorId: null },
              { where: { id: studentId }, transaction: t }
            ).then(() => {
              User.update(updatedUser.dataValues, {
                where: { id: req.params.id },
                transaction: t,
              })
                .then((user) => {
                  delete updatedUser.dataValues.password;
                  if (data.studentId.length > 0)
                    Student.update(
                      { mentorId: updatedUser.dataValues.id },
                      { where: { id: data.studentId }, transaction: t }
                    )
                      .then((upS) => {
                        t.commit();
                        res.status(201).json(user);
                      })
                      .catch((err) => {
                        t.rollback();
                        res.status(400).json(err);
                      });
                })
                .catch((err) => {
                  t.rollback();
                  res.status(400).json(err);
                });
            });
          }
        );
      } else
        res.status(404).json({
          message: `User id:${req.params.id} does not exists`,
        });
    });
  }

  delete(req: Request, res: Response) {
    this.userService.get(req.params.id).then((user) => {
      if (user) {
        this.userService
          .delete(req.params.id)
          .then((user) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `User id:${req.params.id} does not exists`,
        });
    });
  }
}
