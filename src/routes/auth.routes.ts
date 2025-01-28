import * as express from "express";
import * as authControllers from "../controllers/auth.controllers";

const router = express.Router();

router.route("/registerUser").post(authControllers.registerUser);
router.route("/loginUser").post(authControllers.loginUser);
router.route("/logoutUser").post(authControllers.logoutUser);

router.route("/:id").put(authControllers.updateUserPassword);

router.route("/:id").delete(authControllers.deleteUser);

router.route("/").get(authControllers.getAllUsers);
router.route("/:id").get(authControllers.getUserById);

export { router as authRouter };
