import { Contact, User } from "@prisma/client";
import { prismaClient } from "../application/database";
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactValidation } from "../validation/contact-validation";
import { Validation } from "../validation/validation";
import { ResponseError } from "../error/response-error";
import { PageableContacts } from "../model/page";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request,
    );

    const record = {
      ...createRequest,
      ...{ username: user.username },
    };

    const contact = await prismaClient.contact.create({
      data: record,
    });

    return toContactResponse(contact);
  }

  static async checkContactMustExist(
    username: string,
    id: number,
  ): Promise<Contact> {
    const contact = await prismaClient.contact.findUnique({
      where: {
        id,
        username,
      },
    });
    if (!contact) throw new ResponseError(404, "Contact not found");

    return contact;
  }

  static async getById(user: User, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExist(user.username, id);

    return toContactResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest,
    id: number,
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(
      ContactValidation.UPDATE,
      request,
    );

    const contact = await this.checkContactMustExist(user.username, id);

    if (updateRequest.first_name) contact.first_name = updateRequest.first_name;
    if (updateRequest.last_name) contact.last_name = updateRequest.last_name;
    if (updateRequest.email) contact.email = updateRequest.email;
    if (updateRequest.phone) contact.phone = updateRequest.phone;

    const response = await prismaClient.contact.update({
      where: {
        id: id,
        username: user.username,
      },
      data: contact,
    });

    return toContactResponse(response);
  }

  static async delete(user: User, id: number): Promise<ContactResponse> {
    const contact = await this.checkContactMustExist(user.username, id);
    const response = await prismaClient.contact.delete({
      where: {
        id: contact.id,
        username: contact.username,
      },
    });
    return toContactResponse(response);
  }

  static async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<PageableContacts<ContactResponse>> {
    const contactSearchRequest = Validation.validate(
      ContactValidation.SEARCH,
      request,
    );
    const skip = (contactSearchRequest.page - 1) * contactSearchRequest.size;

    let filters = [];
    //jika ada nama
    if (contactSearchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: contactSearchRequest.name,
            },
          },
          {
            last_name: {
              contains: contactSearchRequest.name,
            },
          },
        ],
      });
    }
    //jika ada email
    if (contactSearchRequest.email) {
      filters.push({
        email: {
          contains: contactSearchRequest.email,
        },
      });
    }
    //jika ada phone
    if (contactSearchRequest.phone) {
      filters.push({
        phone: {
          contains: contactSearchRequest.phone,
        },
      });
    }

    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters,
      },
      take: contactSearchRequest.size,
      skip: skip,
    });

    if (!contacts) throw new ResponseError(404, "Contact not found");

    const totalContact = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters,
      },
    });

    return {
      contacts: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: request.page,
        total_page: Math.ceil(totalContact / request.size),
        size: request.size,
      },
    };
  }
}
