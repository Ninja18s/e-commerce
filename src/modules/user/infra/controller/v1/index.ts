import express from "express";
import userControllerV1 from "./user.controller";
import validatePayload from "@utils/validator";
import {
  loginSchema,
  updateUserSchema,
  userSchema,
} from "@user/validator/user.validator";
import authMiddleware from "@utils/auth.middleware";

const router = express.Router();

router
  .route("/login")
  .post(
    validatePayload(loginSchema),
    userControllerV1.login.bind(userControllerV1)
  );
router
  .route("/register")
  .post(
    validatePayload(userSchema),
    userControllerV1.registerUser.bind(userControllerV1)
  );
router
  .route("/:id")
  .get(authMiddleware(), userControllerV1.getUserById.bind(userControllerV1));
router
  .route("/")
  .post(authMiddleware(), userControllerV1.getUsers.bind(userControllerV1))
  .patch(
    authMiddleware(),
    validatePayload(updateUserSchema),
    userControllerV1.updateUser.bind(userControllerV1)
  )
  .get(authMiddleware(), userControllerV1.myProfile.bind(userControllerV1));

export { router as userRouteV1 };
