import { Request, Response } from "express";
import { db } from "../db";
import { MysqlError } from "mysql";
import bcrypt from "bcryptjs";

export const register = (req: Request, res: Response): void => {
  // EXISTING USER CHECK
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(
    query,
    [req.body.email, req.body.username],
    (err: MysqlError | null, data: any) => {
      if (err) return res.json(err);

      if (data.length) return res.status(409).json("User already exists!");

      // HASH THE PASSWORD
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      // CREATE A NEW USER
      const query =
        "INSERT INTO users(`username`, `email`,`password`) VALUES (?)";

      const values = [req.body.username, req.body.email, hashedPassword];

      db.query(query, [values], (err: MysqlError | null, data: any) => {
        if (err) return res.json(err);

        return res.status(200).json("User has been created successfully");
      });
    }
  );
};

export const login = (req: Request, res: Response): void => {
  res.json();
};

export const logout = (req: Request, res: Response): void => {
  res.json();
};
