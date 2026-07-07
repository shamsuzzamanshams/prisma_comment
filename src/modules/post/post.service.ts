
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { postWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostquery, IUpdatePostPayload } from "./post.interface";

const createPostIntoDB = async (payload: ICreatePostPayload, userId: string) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id: userId
		},
		include: {
			subcription: true
		}
	})
	if (payload.isPremium && user.subcription?.status !== "ACTIVE") {
		throw new Error("You are not premium user. so you can not create premiun post");
	}
	const result = await prisma.post.create({
		data: {
			...payload,
			authorId: userId
		}
	})
	return result;
};




const getAllPostFromDB = async (query: IPostquery) => {

	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder ? query.sortOrder : "desc";

	const tags = query.tags ? JSON.parse(query.tags as string) : null;

	const tagsArray = Array.isArray(tags) ? tags : [];


	const andConditions: postWhereInput[] = []
	if (query.searchTerm) {
		andConditions.push({
			OR: [
				{
					title: {
						contains: query.searchTerm,
						mode: "insensitive"
					}
				},
				{
					content: {
						contains: query.searchTerm,
						mode: "insensitive"
					}
				}
			]
		})
	}

	if (query.title) {
		andConditions.push({
			title: query.title
		})
	}
	if (query.content) {
		andConditions.push({
			content: query.content
		})
	}
	if (query.tags) {
		andConditions.push({
			tags: {
				hasSome: tagsArray
			}
		})
	}

	andConditions.push({
		isPremium: false
	})





	const post = await prisma.post.findMany(

		{
			// dynamic searching, filtaring
			// where: {
			// 	AND: [

			// 		query.searchTerm ? {
			// 			OR: [
			// 				{
			// 					title: {
			// 						contains: query.searchTerm,
			// 						mode: "insensitive"
			// 					}
			// 				},
			// 				{
			// 					content: {
			// 						contains: query.searchTerm,
			// 						mode: "insensitive"
			// 					}
			// 				}
			// 			]
			// 		} : {},

			// 		query.title ? { title: query.title } : {},

			// 		query.content ? { content: query.content } : {}
			// 	]
			// },

			where: {
				AND: andConditions

			},

			// dynamic pagination
			take: limit,
			skip: skip,

			// dynamic sorting
			orderBy: {
				[sortBy]: sortOrder
			},
			// filtaring / exact match
			// where: {
			// 	AND: [
			// 		{
			// 			title: "i am game developer"
			// 		},
			// 		{
			// 			content: "Content of the post goes here."
			// 		},
			// 		// {
			// 		// 	tags:{
			// 		// 		has: ""
			// 		// 	}
			// 		// }
			// 	]
			// },

			// searching / partial match
			// where: {
			// 	OR: [
			// 		{
			// 			content: {
			// 				contains: "game",
			// 				mode: "insensitive"
			// 			}
			// 		},
			// 		{
			// 			title: {
			// 				contains: "Game",
			// 				mode: "insensitive"
			// 			}
			// 		}
			// 	]
			// },

			// filtaring and searching
			// where: {
			// 	AND: [
			// 		{
			// 			OR: [
			// 				{
			// 					content: {
			// 						contains: "game",
			// 						mode: "insensitive"
			// 					}

			// 				},
			// 				{
			// 					title: {
			// 						contains: "Game",
			// 						mode: "insensitive"
			// 					}
			// 				}
			// 			]
			// 		},
			// 		{
			// 			title: "i am game developer"
			// 		},
			// 		{
			// 			content: "game"
			// 		}
			// 	]
			// },
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

	const totalPostCount = await prisma.post.count({
		where: {
			AND: andConditions
		}
	})
	return {
		data: post,
		meta: {
			page: page,
			limit: limit,
			total: totalPostCount,
			totalPage: Math.ceil(totalPostCount / limit)

		}
	}
};

const getPostStatasFromDB = async () => {
	const transactionResult = await prisma.$transaction(
		async (tx) => {
			// const totalPost = await tx.post.count();

			// const totalPublishedPost = await tx.post.count({
			// 	where: {
			// 		status: PostStatus.PUBLISHED
			// 	}
			// });
			// const totalDraftPost = await tx.post.count({
			// 	where: {
			// 		status: PostStatus.DRAFT
			// 	}
			// });
			// const totalArchivePost = await tx.post.count({
			// 	where: {
			// 		status: PostStatus.ARCHIVE
			// 	}
			// });

			// const totalComment = await tx.comment.count();

			// const totalapprovedComment = await tx.comment.count({
			// 	where: {
			// 		status: CommentStatus.APPRIVED
			// 	}
			// });

			// const totalRejectedComment = await tx.comment.count({
			// 	where: {
			// 		status: CommentStatus.REJECT
			// 	}
			// });

			// const totalPostViewsAggregate = await tx.post.aggregate({
			// 	_sum: {
			// 		views: true
			// 	}
			// });

			// const totalPostViews = totalPostViewsAggregate._sum.views;

			// return {
			// 	totalPost,
			// 	totalPublishedPost,
			// 	totalDraftPost,
			// 	totalArchivePost,
			// 	totalComment,
			// 	totalapprovedComment,
			// 	totalRejectedComment,
			// 	totalPostViews
			// }

			const [
				totalPost,
				totalPublishedPost,
				totalDraftPost,
				totalArchivePost,
				totalComment,
				totalapprovedComment,
				totalRejectedComment,
				totalPostViewsAggregate

			] =
				await Promise.all([
					await tx.post.count(),
					await tx.post.count({
						where: {
							status: PostStatus.PUBLISHED
						}
					}),
					await tx.post.count({
						where: {
							status: PostStatus.DRAFT
						}
					}),
					await tx.post.count({
						where: {
							status: PostStatus.ARCHIVE
						}
					}),
					await tx.comment.count(),
					await tx.comment.count({
						where: {
							status: CommentStatus.APPRIVED
						}
					}),
					await tx.comment.count({
						where: {
							status: CommentStatus.REJECT
						}
					}),
					await tx.post.aggregate({
						_sum: {
							views: true
						}
					})


				]);
			return {
				totalPost,
				totalPublishedPost,
				totalDraftPost,
				totalArchivePost,
				totalComment,
				totalapprovedComment,
				totalRejectedComment,
				totalPostViews: totalPostViewsAggregate._sum.views
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
					id: postId,
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
					id: postId,
					isPremium: false
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