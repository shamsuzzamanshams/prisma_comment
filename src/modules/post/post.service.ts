import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";

const createPostIntoDB = async (payload: ICreatePostPayload, userId: string) => {
	const result = await prisma.post.create({
		data: {
			...payload,
			authorId: userId
		}
	})
	return result;
};

const getAllPostFromDB = async () => {
	const post = await prisma.post.findMany(
		{
			include: {
				author: {
					omit: {
						password: true
					}
				},
				comment: true
			}
		}
	);
	return post
};

const getPostStatasFromDB = async () => {

};

const getMyPostFromDB = async () => {

};

const getPostByIDFromDB = async (postId: string) => {

	const result = await prisma.post.findUniqueOrThrow({
		where: {
			id: postId
		},
	})

	const updatePostView = await prisma.post.update({
		where: {
			id: postId
		},
		data: {
			views: {
				increment: 1
			}
		},
		include: {
			author: {
				omit: {
					password: true
				}
			},
			comment: true
		}
	});
	return updatePostView;

};

const updatePostIntoDB = async () => {

};

const deletePostIntoDB = async () => {

};

export const postService = {
	createPostIntoDB,
	getAllPostFromDB,
	getPostStatasFromDB,
	getMyPostFromDB,
	getPostByIDFromDB,
	updatePostIntoDB,
	deletePostIntoDB
};