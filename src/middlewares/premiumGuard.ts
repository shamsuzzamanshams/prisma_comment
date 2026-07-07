import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { SubcriptionStatus } from "../../generated/prisma/enums";

export const subscriptionGuard = () => {
	return catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const userId = req.user?.id;

			const subscription = await prisma.subcription.findUnique({
				where: {
					userId
				}
			});

			if (!subscription) {
				throw new Error("Please subscribe to get access to premium content")
			}

			if (subscription?.status !== SubcriptionStatus.ACTIVE) {
				throw new Error("Please subscribe again!!!!!!!")
			}

			next();
		}
	)
}