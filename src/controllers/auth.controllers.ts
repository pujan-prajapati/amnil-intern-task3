import { Request, Response } from "express";
import * as asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse";
import * as authServices from "../services/auth.services";
import { validateId } from "../utils/validateId";

// register user
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, phone } = req.body;

    const user = await authServices.registerUser(
      username,
      email,
      password,
      phone
    );

    res
      .status(201)
      .json(new ApiResponse(201, user, "User created successfully"));
  }
);

// login user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authServices.loginUser(
    email,
    password
  );

  const options = {
    secure: true,
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// logout user
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
    message: "User logged out successfully",
  });
});

// get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { users, totalUsers } = await authServices.getAllUsers();

  res
    .status(200)
    .json(
      new ApiResponse(200, { users, totalUsers }, "Users fetched successfully")
    );
});

// get user by id
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateId(id);

  const findUser = await authServices.getUserById(id);

  res
    .status(200)
    .json(new ApiResponse(200, findUser, "User fetched successfully"));
});

// delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateId(id);

  await authServices.deleteUser(id);
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

// update user info
export const updateUserPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateId(id);
    const { oldPassword, newPassword } = req.body;

    await authServices.updateUserPassword(id, oldPassword, newPassword);

    res.status(200).json(new ApiResponse(200, null, "Password updated"));
  }
);
