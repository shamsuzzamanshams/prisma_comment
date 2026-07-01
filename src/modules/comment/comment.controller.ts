import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createComment = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

});

const getCommentByAuthorId = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

});

const getcommentById = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

});

const updateCommentById = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

});

const updateCommentByModarator = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

});

const deleteComment = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

});

export const commentController = {
	createComment,
	getCommentByAuthorId,
	getcommentById,
	updateCommentById,
	updateCommentByModarator,
	deleteComment
};