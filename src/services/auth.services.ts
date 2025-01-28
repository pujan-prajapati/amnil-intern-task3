import { Auth } from "../entity/auth.entity";
import * as bcryptjs from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";

// register user
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  phone: string
) => {
  const existingUser = await Auth.findOneBy({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = Auth.create({
    username: username,
    email: email,
    password: hashedPassword,
    phone: phone,
  });

  await user.save();
  return user;
};

// login user
export const loginUser = async (email: string, password: string) => {
  const user = await Auth.findOneBy({ email });
  if (!user) {
    throw new Error("invalid credentials");
  }

  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("invalid credentials");
  }

  const accessToken = await generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
};

// get all users
export const getAllUsers = async () => {
  const [users, totalUsers] = await Auth.findAndCount();
  return { users, totalUsers };
};

// get user by id
export const getUserById = async (id: string) => {
  const user = await Auth.findOneBy({ id });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// delete user
export const deleteUser = async (id: string) => {
  const user = await Auth.findOneBy({ id });
  if (!user) {
    throw new Error("User not found");
  }

  await Auth.delete(user.id);
  return user;
};

// update password
export const updateUserPassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await Auth.findOneBy({ id });
  if (!user) {
    throw new Error("User not found");
  }

  const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);
  if (!isOldPasswordMatch) {
    throw new Error("Invalid old password");
  }

  const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

  user.password = hashedNewPassword;
  user.save();

  return user;
};
