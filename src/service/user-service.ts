import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  CreateUserRequest,
  LoginUserRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { User } from "@prisma/client";

export class UserService {
  //registrasi user
  static async register(request: CreateUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request,
    );

    //mencari total user dengan username yg sama dg request
    const totalUserWithSameUsername = await prismaClient.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    //jika total user > 0, maka return errror: status code 400
    if (totalUserWithSameUsername != 0) {
      throw new ResponseError(400, "username already exists");
    }

    //hashing password request
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    //tambahkan ke database
    const user = await prismaClient.user.create({
      data: registerRequest,
    });

    //return dalam format user response
    return toUserResponse(user);
  }

  //user login
  static async login(request: LoginUserRequest): Promise<UserResponse> {
    //validasi input username dan password
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    //cek username ke database
    let user = await prismaClient.user.findUnique({
      where: {
        username: loginRequest.username,
        //tidak termasuk password, karena password sudah dihash
      },
    });

    //jika username tidak ada, kembalikan error 401
    if (!user) throw new ResponseError(401, "username or password is wrong");

    //komparasi input password dg password yg terenkripsi
    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    //jika password tidak sama, kembalikan error 401
    if (!isPasswordValid)
      throw new ResponseError(401, "username or password is wrong");

    //tambahkan token ke data user di database
    user = await prismaClient.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        //buat token menggunakan uuid
        token: uuid(),
      },
    });

    const response = toUserResponse(user);
    //tambahkan token ke user response
    response.token = user.token!;
    return response;
  }

  static async get(user: User): Promise<UserResponse> {
    return toUserResponse(user);
  }

  static async update(
    user: User,
    request: UpdateUserRequest,
  ): Promise<UserResponse> {
    //validasi
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);
    if (updateRequest.name) user.name = updateRequest.name;
    if (updateRequest.password)
      user.password = await bcrypt.hash(updateRequest.password, 10);
    //update data user di database
    const result = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });
    return toUserResponse(result);
  }
  static async logout(user: User): Promise<UserResponse> {
    const result = await prismaClient.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });
    return toUserResponse(result);
  }
}
