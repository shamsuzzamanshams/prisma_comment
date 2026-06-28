import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: ILoginUser) => {

	const { email, password } = payload;

	const user = await prisma.user.findFirstOrThrow({
		where: { email }
	})

	const isPasswordMatched = await bcrypt.compare(password, user.password);

	if (!isPasswordMatched) {
		throw new Error("Password Is Incorrect");
	}

	const jwtpayload = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role
	}

	// const accessToken = jwt.sign(jwtpayload, config.jwt_access_secret,
	// 	{
	// 		expiresIn: config.jwt_access_expires_in
	// 	} as SignOptions);

	const accessToken = jwtUtils.createToken(
		jwtpayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions
	)

	// const refreshToken = jwt.sign(jwtpayload, config.jwt_refresh_secret,
	// 	{
	// 		expiresIn: config.jwt_refresh_expires_in
	// 	} as SignOptions);

	const refreshToken = jwtUtils.createToken(
		jwtpayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions
	)




	return {
		accessToken,
		refreshToken
	};

}

export const authService = {
	loginUser,
}