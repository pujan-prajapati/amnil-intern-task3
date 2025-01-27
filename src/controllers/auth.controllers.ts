import { Request, Response } from "express";
import { Auth } from "../entity/auth.entity";
import * as asyncHandler from "express-async-handler";
import * as bcryptjs from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";

// register user
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, phone } = req.body;

    const findUser = await Auth.findOneBy({ email });
    if (findUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = Auth.create({
      username,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  }
);

// login user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const findUser = await Auth.findOneBy({
    email,
  });
  if (findUser) {
    const isPasswordMatch = await bcryptjs.compare(password, findUser.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = await generateAccessToken(findUser.id);
    const refreshToken = await generateRefreshToken(findUser.id);

    const options = {
      secure: true,
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User logged in successfully",
        data: { user: findUser, accessToken, refreshToken },
      });
  } else {
    throw new Error("Invalid credentials");
  }
});

// logout user
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({
    message: "User logged out successfully",
  });
});

// get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const [users, totalUsers] = await Auth.findAndCount();

  res.status(200).json({
    message: "Users fetched successfully",
    users,
    totalUsers,
  });
});

// get user by id
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const findUser = await Auth.findOne({ where: { id } });
  if (!findUser) {
    throw new Error("User not found");
  }

  res.status(200).json({
    message: "User fetched successfully",
    user: findUser,
  });
});

// delete user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const findUser = await Auth.findOne({ where: { id } });
  if (!findUser) {
    throw new Error("User not found");
  }

  await Auth.delete(findUser.id);

  res.status(200).json({
    message: "User deleted successfully",
    user: findUser,
  });
});

// update user info
export const updateUserPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const findUser = await Auth.findOne({ where: { id } });
    if (!findUser) {
      throw new Error("User not found");
    }

    const isOldPasswordMatch = await bcryptjs.compare(
      oldPassword,
      findUser.password
    );
    if (!isOldPasswordMatch) {
      throw new Error("Invalid old password");
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

    findUser.password = hashedNewPassword;

    await findUser.save();

    res.status(200).json({
      message: "User password updated successfully",
      user: findUser,
    });
  }
);
