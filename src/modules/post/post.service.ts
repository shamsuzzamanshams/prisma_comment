
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

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
	const transactionResult = await prisma.$transaction(
		async (tx) => {
			const totalPost = await tx.post.count();

			const totalPublishedPost = await tx.post.count({
				where: {
					status: PostStatus.PUBLISHED
				}
			});
			const totalDraftPost = await tx.post.count({
				where: {
					status: PostStatus.DRAFT
				}
			});
			const totalArchivePost = await tx.post.count({
				where: {
					status: PostStatus.ARCHIVE
				}
			});

			const totalComment = await tx.comment.count();

			const totalapprovedComment = await tx.comment.count({
				where: {
					status: CommentStatus.APPRIVED
				}
			});

			const totalRejectedComment = await tx.comment.count({
				where: {
					status: CommentStatus.REJECT
				}
			});

			const totalPostViewsAggregate = await tx.post.aggregate({
				_sum: {
					views: true
				}
			});

			const totalPostViews = totalPostViewsAggregate._sum.views;

			return {
				totalPost,
				totalPublishedPost,
				totalDraftPost,
				totalArchivePost,
				totalComment,
				totalapprovedComment,
				totalRejectedComment,
				totalPostViews
			}
		}
	)

	return transactionResult;
};

const getMyPostFromDB = async (authorId: string) => {

	const result = await prisma.post.findMany({
		where: {
			authorId
		},
		orderBy: {
			createdAt: "desc"
		},
		include: {
			comment: true,
			author: {
				omit: {
					password: true
				}
			},
			_count: {
				select: {
					comment: true
				}
			}
		}
	})

	return result;

};

const getPostByIDFromDB = async (postId: string) => {

	const transactionResult = await prisma.$transaction(
		async (tx) => {
			await tx.post.update({
				where: {
					id: postId
				},
				data: {
					views: {
						increment: 1
					}
				}
			});

			// throw new Error("Fake Error");

			const post = await tx.post.findUniqueOrThrow({
				where: {
					id: postId
				},
				include: {
					author: {
						omit: {
							password: true
						}
					},
					comment: {
						where: {
							status: "APPRIVED"
						}
					},
					_count: {
						select: {
							comment: true
						}
					}
				}
			});
			return post;
		}
	);

	return transactionResult;

};

const updatePostIntoDB = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
	const post = await prisma.post.findUniqueOrThrow({
		where: {
			id: postId
		}
	});
	if (!isAdmin && post.authorId !== authorId) {
		throw new Error("You are not owner of the post");
	}

	const result = await prisma.post.update({
		where: {
			id: postId
		},
		data: payload,
		include: {
			author: {
				omit: {
					password: true
				}
			},
			comment: true
		}
	})
	return result;
};

const deletePostIntoDB = async (postId: string, authorId: string, isAdmin: boolean) => {
	const post = await prisma.post.findUniqueOrThrow({
		where: {
			id: postId
		}
	});

	if (!isAdmin && post.authorId !== authorId) {
		throw new Error("You are not owner of the post");
	};

	await prisma.post.delete({
		where: {
			id: postId
		}
	})
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