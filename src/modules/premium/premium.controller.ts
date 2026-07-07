import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendRespinse";
import httpstatus from "http-status";
import { premiumService } from "./premium.service";

const getPremiumcontent = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{


	const result = await premiumService.getPremiumContentFromDB();



	sendResponse(res,{
		success: true,
		statusCode: httpstatus.OK,
		message: "Premium content retrive successfully",
		data: result
	})
})

export const premiumController = {
	getPremiumcontent,
}