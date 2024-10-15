import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import {
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from "../model/contact-model";
import { ContactService } from "../service/contact-service";

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest;
      const response = await ContactService.create(req.user!, request);

      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getById(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      const response = await ContactService.getById(req.user!, contactId);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      const request = req.body as UpdateContactRequest;
      const response = await ContactService.update(
        req.user!,
        request,
        contactId,
      );

      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = Number(req.params.contactId);
      await ContactService.delete(req.user!, contactId);

      res.status(200).json({
        data: "OK",
      });
    } catch (e) {
      next(e);
    }
  }
  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchContactRequest = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
      };

      const response = await ContactService.search(req.user!, request);

      res.status(200).json({
        data: response.contacts,
        paging: response.paging
      });
    } catch (e) {
      next(e);
    }
  }
}
