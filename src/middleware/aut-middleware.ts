import { Response, NextFunction } from "express";
import { prismaClient } from "../application/database";
import { UserRequest } from "../type/user-request";

export const authMiddleware = async (
  request: UserRequest,
  response: Response,
  next: NextFunction,
)=> 
  {
  const token = request.get("X-API-TOKEN");

  //jika token ada
  if (token) {
    //cek data user berdasarkan token
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });
    //jika user ada, lanjutkan
    if (user) {
      request.user = user;
      next();
      return;
    }
  }

  //kembalikan unauthorized
  response
    .status(401)
    .json({
      errors: "unauthorized",
    })
    .end();
};
