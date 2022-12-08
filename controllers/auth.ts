import { Request, Response } from "express";
import { db } from "../db";
import { MysqlError } from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../types/types";

export const register = (req: Request, res: Response): void => {
  // EXISTING USER CHECK
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(
    query,
    [req.body.email, req.body.username],
    (err: MysqlError | null, data: User[]) => {
      if (err) return res.json(err);

      if (data.length) {
        return res.status(409).json("User already exists!");
      }

      // HASH THE PASSWORD
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      // CREATE A NEW USER
      const query =
        "INSERT INTO users(`username`, `email`,`password`) VALUES (?)";

      const values = [req.body.username, req.body.email, hashedPassword];

      db.query(query, [values], (err: MysqlError | null, data: User[]) => {
        if (err) return res.json(err);

        return res.status(200).json("User has been created successfully");
      });
    }
  );
};
export const login = (req: Request, res: Response): void => {
  // EXISTING USER CHECK
  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [req.body.email], (err: MysqlError | null, data: User[]) => {
    if (err) return res.json(err);

    if (data.length === 0) return res.status(404).json("User not found!");

    // PASSWORD CHECK
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isPasswordCorrect)
      return res.status(400).json("Wrong email or password!");

    const token = jwt.sign({ id: data[0].id }, "auth_jwt_key");

    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(other);
  });
};

export const logout = (req: Request, res: Response): void => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out");
};
