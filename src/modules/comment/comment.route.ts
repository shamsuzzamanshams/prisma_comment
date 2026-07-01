import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";


const router = Router();


router.post("/", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.createComment);

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.get("/:commentId", commentController.getcommentById);

router.patch("/:commentId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.updateCommentById);

router.patch("/:commentId/moderate", auth(Role.ADMIN), commentController.updateCommentByModarator);

router.delete("/:commentId", auth(Role.ADMIN, Role.AUTHOR, Role.USER), commentController.deleteComment);


export const commentRoute = router;