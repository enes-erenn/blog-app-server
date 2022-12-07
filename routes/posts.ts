import express from "express";
import { addPost } from "../controllers/post";

const router = express.Router();

router.get("/add", addPost);

export default router;
