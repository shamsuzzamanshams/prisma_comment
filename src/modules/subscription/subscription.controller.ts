import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendRespinse";
import httpstatus from "http-status";

const createCheckoutSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.id;

	const result = await subscriptionService.createCheckoutSession(userId as string);

	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		message: "Checkout completed successfully",
		data: result
	})
});

const handlewebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const event = req.body as Buffer;
	const signature = req.headers['stripe-signature']!;

	await subscriptionService.handleWebhookIntoDB(event, signature as string);

	sendResponse(res, {
		success: true,
		statusCode: 200,
		message: "webhook trigger successfully",
		data: null
	})
});

const getSubscriptionStatus = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.user?.id

		const result = await subscriptionService.getSubscriptionStatus(userId as string);

		sendResponse(res, {
			success: true,
			statusCode: httpstatus.OK,
			message: "Subscription status retrived successfully",
			data: result
		})
	}
)

export const subscriptionController = {
	createCheckoutSession,
	handlewebhook,
	getSubscriptionStatus
}