import { Request, Response } from "express";
import { MysqlError } from "mysql";
import { db } from "../db";
import { verify } from "../utils/jwt";

export const getPosts = (req: Request, res: Response): void => {
  const query = req.query.category
    ? "SELECT * FROM posts WHERE category=?"
    : "SELECT * FROM posts";

  db.query(query, [req.query.category], (err: MysqlError | null, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const getPost = (req: Request, res: Response): void => {
  const query =
    "SELECT p.id, `username`, `title`, `desc`, p.img , u.img AS image , `category`, `date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  db.query(query, [req.params.id], (err: MysqlError | null, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const addPost = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.access_token;
  const secret = process.env.JWT_SEC;

  if (!token || !secret) {
    res.status(401).send("Not authenticated!");
    return;
  }

  // Decrypting token
  const verification = await verify(token, secret);

  // Checking token exp if is it valid
  if (verification.exp > new Date().getTime()) {
    const query =
      "INSERT INTO posts(`title`, `desc`, `img`, `category`, `date`, `uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.category,
      req.body.date,
      verification.id,
    ];

    db.query(query, [values], (err: MysqlError | null, data) => {
      if (err) return res.status(403).json(err);

      return res.status(200).json("Post has been created!");
    });
  } else {
    return res.status(403).json("Token is not valid!");
  }
};

export const deletePost = (req: Request, res: Response): void => {
  /* 
  const token = req.cookies.access_token;

  if (!token) {
    res.status(401).send("Not authenticated!");
    return;
  }

  jwt.verify(
    token,
    "jwtkey",
    (err: JsonWebTokenError | null, userInfo: any) => {
      if (err) return res.status(403).json("Token is not valid!");

      const postId = req.params.id;

      const query = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

      db.query(query, [postId, userInfo.id], (err: MysqlError | null, data) => {
        if (err)
          return res.status(403).json("You can delete only your own posts.");

        return res.status(200).json("Post has been deleted!");
      });
    }
  );
  */
};
export const updatePost = (req: Request, res: Response): void => {
  /*
  const token = req.cookies.access_token;

  if (!token) {
    res.status(401).send("Not authenticated!");
    return;
  }

  jwt.verify(
    token,
    "jwtkey",
    (err: JsonWebTokenError | null, userInfo: any) => {
      if (err) return res.status(403).json("Token is not valid!");

      const postId = req.params.id;

      const query =
        "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `category`=?) WHERE `id` = ? AND `uid` = ?";

      const values = [
        req.body.title,
        req.body.desc,
        req.body.img,
        req.body.category,
        userInfo.id,
      ];

      db.query(
        query,
        [...values, postId, userInfo.id],
        (err: MysqlError | null, data) => {
          if (err) return res.status(403).json(err);

          return res.status(200).json("Post has been updated!");
        }
      );
    }
  );*/
};
