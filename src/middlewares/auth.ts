import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
	namespace Express {
		interface Request {
			user?: {
				email: string;
				name: string;
				id: string;
				role: Role
			}
		}
	}
}

export const auth = (...requiredRole: Role[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies.accesstoken ? req.cookies.accesstoken
			:
			req.headers.authorization?.startsWith("Bearer") ?
				req.headers.authorization?.split(" ")[1] 
				: req.headers.authorization

		if (!token) {
			throw new Error("You are not logged in. please log in access resource");
		}
		const verifiedToken = jwtUtils.verifiToken(token, config.jwt_access_secret);

		if (!verifiedToken.success) {
			throw new Error(verifiedToken.error);
		}

		const { name, email, id, role } = verifiedToken.data as JwtPayload;

		if (requiredRole.length && !requiredRole.includes(role)) {
			throw new Error("Forbidden. You don't have permission to access this resources");
		}

		const user = await prisma.user.findUnique({
			where: {
				id,
				email,
				name,
				role
			}
		})

		if (!user) {
			throw new Error("User not found. please log in again");
		}

		if (user.activeStatus === "BLOCKED") {
			throw new Error("Your account is blocked. please contact support");
		}

		req.user = {
			email,
			name,
			id,
			role
		}

		next();
	})


}