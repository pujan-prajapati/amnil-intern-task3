import * as express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  updateUserPassword,
} from "../controllers/auth.controllers";

const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").post(logoutUser);

router.route("/:id").put(updateUserPassword);

router.route("/:id").delete(deleteUser);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById);

export { router as authRouter };
