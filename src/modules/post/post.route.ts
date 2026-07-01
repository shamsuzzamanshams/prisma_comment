import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.createPost);

router.get("/", postController.getAllPost);

router.get("/stats", auth(Role.ADMIN), postController.getPoststatas);

router.get("/my-posts", postController.getMyPost);

router.get("/:postId", postController.getPostById);

router.patch("/:postId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.updatePost);

router.delete("/:postId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), postController.deletePost);


export const postRoute = router;