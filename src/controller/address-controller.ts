import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import {
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from "../model/address-model";
import { AddressService } from "../service/address-service";

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAddressRequest = req.body as CreateAddressRequest;
      const contact_id = Number(req.params.contactId);
      request.contact_id = contact_id;
      const response = await AddressService.create(req.user!, request);

      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        contact_id: Number(req.params.contactId),
        address_id: Number(req.params.addressId),
      };
      const response = await AddressService.get(req.user!, request);
      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const reqId: GetAddressRequest = {
        contact_id: Number(req.params.contactId),
        address_id: Number(req.params.addressId),
      };
      const request = req.body as UpdateAddressRequest;

      const response = await AddressService.update(req.user!, request, reqId);

      res.status(200).json({
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
  static async delete(req: UserRequest, res: Response, next: NextFunction){
    try {
      const reqId: GetAddressRequest = {
        address_id: Number(req.params.addressId),
        contact_id: Number(req.params.contactId),
      }
      const response = await AddressService.delete(req.user!, reqId)

      res.status(200).json({
        data: response
      })

    } catch (e) {
      next(e)
      
    }
  }
  static async list(req: UserRequest, res: Response, next: NextFunction){
    try {
      const request = {
        contact_id: Number(req.params.contactId),
        page: req.query.page? Number(req.query.page):1, 
        size: req.query.size? Number(req.query.size):10, 
      }

      const response = await AddressService.list(req.user!,request.contact_id,request)
      res.status(200).json(response)

      
    } catch (e) {
      next(e)
      
    }
  }
}
