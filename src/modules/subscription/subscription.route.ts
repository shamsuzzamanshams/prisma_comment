import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.post(
	"/checkout",
	auth(Role.ADMIN, Role.AUTHOR, Role.USER),
	subscriptionController.createCheckoutSession);

route.post("/webhook", subscriptionController.handlewebhook);

route.get(
	"/status",
	auth(Role.ADMIN, Role.AUTHOR, Role.USER),
	subscriptionController.getSubscriptionStatus);


export const subscriptionRoute = route;