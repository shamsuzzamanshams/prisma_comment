import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendRespinse";
import httpStatus from "http-status";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const id = req.user?.id;

	const payload = req.body;

	const result = await postService.createPostIntoDB(payload, id as string);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Post Created Successfully",
		data: result
	})
});

const getAllPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await postService.getAllPostFromDB();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Retrived All Post Successfully",
		data: result
	})
});

const getPoststatas = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

const getMyPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const postId = req.params.postId

	if (!postId) {
		throw new Error("Post id required in params");
	};

	const result = await postService.getPostByIDFromDB(postId as string);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Retrived All Post Successfully",
		data: result
	})
});

const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

});

export const postController = {
	createPost,
	getAllPost,
	getPoststatas,
	getMyPost,
	getPostById,
	updatePost,
	deletePost
}