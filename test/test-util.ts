import { Address, User } from "@prisma/client";
import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import { CreateAddressRequest } from "../src/model/address-model";

export class UserTest {
  static async delete() {
    await prismaClient.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }
  static async create() {
    await prismaClient.user.create({
      data: {
        username: "test",
        name: "test",
        password: await bcrypt.hash("test", 10),
        token: "test",
      },
    });
  }
  static async get(): Promise<User> {
    const user = await prismaClient.user.findFirst({
      where: {
        username: "test",
      },
    });
    if (!user) throw new Error("user not found");

    return user;
  }
}

export class ContactTest {
  static async deleteAll() {
    await prismaClient.contact.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    const data = {
      first_name: "tado",
      last_name: "sti",
      phone: "082148539123",
      email: "muh.murtadlo",
      username: "test",
    };

    await prismaClient.contact.create({
      data,
    });
  }

  static async get() {
    const contact = await prismaClient.contact.findFirst({
      where: {
        username: "test",
      },
    });

    if (!contact) throw new Error("contact is not found");

    return contact;
  }

  static async createWithParam(data) {
    await prismaClient.contact.create({
      data: data,
    });
  }
}

export class AddressTest {
  static async deleteAll() {
    await prismaClient.address.deleteMany({
      where: {
        contact: {
          username: "test",
        },
      },
    });
  }
  static async create() {
    const contact = await ContactTest.get();
    const addressRequest: CreateAddressRequest = {
      contact_id: contact.id,
      street: "test",
      city: "Pasuruan",
      provience: "East Java",
      country: "Indonesia",
      postal_code: "67184",
    };
    const address = await prismaClient.address.create({
      data: addressRequest,
    });
    return address
  }
  static async get() {
    const contact = await ContactTest.get();

    const address = await prismaClient.address.findFirst({
      where: {
        contact: {
          username: contact.username,
          id: contact.id,
        },
      },
    });
    if (!address) throw new Error("adress not found");
    return address;
  }
}
