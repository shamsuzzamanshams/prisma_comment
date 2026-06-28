import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";




const router = Router();

router.post("/register", userController.registerUser);




router.get("/me",

	// 	(req: Request, res: Response, next: NextFunction) => {



	// 	const { accesstoken } = req.cookies;



	// 	const verifiedToken = jwtUtils.verifiToken(accesstoken, config.jwt_access_secret);


	// 	if (!verifiedToken.success) {
	// 		throw new Error(verifiedToken.error);
	// 	}


	// 	const { name, email, id, role } = verifiedToken.data as JwtPayload;
	// 	const requiredRole = [Role.ADMIN, Role.USER, Role.AUTHOR];

	// 	if (!requiredRole.includes(role)) {
	// 		return res.status(403).json({
	// 			success: false,
	// 			statusCode: httpStatus.FORBIDDEN,
	// 			message: "Forbidden. You don't have permission to access this resources"
	// 		})
	// 	};

	// 	req.user = {
	// 		email,
	// 		name,
	// 		id,
	// 		role
	// 	};

	// 	next();







	// }, 

	auth(Role.ADMIN, Role.USER, Role.AUTHOR),

	userController.getMyProfile);

router.put("/my-profile", auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.updateMyProfile);

export const userRoute = router;