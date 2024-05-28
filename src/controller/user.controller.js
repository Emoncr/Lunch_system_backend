import bcrypt from "bcrypt";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/JwtHelper.js";

const prisma = new PrismaClient();

// ----------- USER SING UP CONTROLLER -------------//
export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const result = await prisma.User.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImg: true,
      },
    });
    const { password, otp, ...rest } = result;
    res.status(200).json(successResponse("User created successfully", rest));
  } catch (error) {
    next(error);
  }
};

// ----------- USER SING IN CONTROLLER -------------//
export const singIn = async (req, res, next) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImg: true,
        password: true,
        role: true,
      },
    });
    if (!user) {
      return res
        .status(400)
        .json(errorResponse(400, "User not found with this email"));
    }
    const isMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json(errorResponse(400, "Authentication failed"));
    }
    const { password, ...rest } = user;
    console.log(user);
    const token = generateToken({
      email: user.email,
      id: user.id,
      role: user.role,
    });
    const expirationDuration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //FOR 7 DAYS

    res
      // SETTIING COOKIES
      .cookie("token", token, {
        expires: expirationDuration,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json(successResponse("User logged in successfully", rest));
  } catch (error) {
    console.log(error);
    next(error);
  }
};
