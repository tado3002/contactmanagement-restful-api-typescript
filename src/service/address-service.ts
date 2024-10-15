import { User } from "@prisma/client";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  ListAddressRequest,
  toAddressResponse,
  UpdateAddressRequest,
} from "../model/address-model";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { AddressValidation } from "../validation/address-validation";
import { ResponseError } from "../error/response-error";
import { PageableAddresses } from "../model/page";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    let createRequest = Validation.validate(AddressValidation.CREATE, request);
    await ContactService.checkContactMustExist(
      user.username,
      createRequest.contact_id,
    );

    const address = await prismaClient.address.create({
      data: createRequest,
    });
    return toAddressResponse(address);
  }
  static async checkAddressMustExist(contact_id:number, address_id: number){
    const address = await prismaClient.address.findUnique({
      where:{
        contact_id,
        id: address_id
      }
    })

    if(!address) throw new ResponseError(404, "Address not found")
    return address
  }
  static async get(
    user: User,
    request: GetAddressRequest,
  ): Promise<AddressResponse> {
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExist(
      user.username,
      request.contact_id,
    );
    const response = await this.checkAddressMustExist(getRequest.contact_id, getRequest.address_id)
    return toAddressResponse(response);
  }
  static async update(
    user: User,
    request: UpdateAddressRequest,
    requestId: GetAddressRequest,
  ): Promise<AddressResponse> {
    const reqId = Validation.validate(AddressValidation.GET, requestId);
    const updateRequest = Validation.validate(
      AddressValidation.UPDATE,
      request,
    );
    await ContactService.checkContactMustExist(user.username, reqId.contact_id);
    const address = await this.checkAddressMustExist(reqId.contact_id, reqId.address_id)

    if (updateRequest.street) address!.street = updateRequest.street;
    if (updateRequest.city) address!.city = updateRequest.city;
    if (updateRequest.provience) address!.provience = updateRequest.provience;
    if (updateRequest.country) address!.country = updateRequest.country;
    if (updateRequest.postal_code)
      address!.postal_code = updateRequest.postal_code;

    const response = await prismaClient.address.update({
      where: {
        id: reqId.address_id,
        contact_id: reqId.contact_id,
      },
      data: address,
    });

    return toAddressResponse(response);
  }
  static async delete(
    user: User,
    request: GetAddressRequest,
  )
  : Promise<AddressResponse> 
{
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactMustExist(
      user.username,
      getRequest.contact_id,
    );
    await this.checkAddressMustExist(getRequest.contact_id, getRequest.address_id)

    const deleteAddress = await prismaClient.address.delete({
      where: {
        id: getRequest.address_id,
        contact_id: getRequest.contact_id
      }
    });
    return toAddressResponse(deleteAddress);
  }
  static async list(user: User, contact_id: number, request: ListAddressRequest): Promise<PageableAddresses<AddressResponse>>{
    const requestValidate = Validation.validate(AddressValidation.LIST, request)
    await ContactService.checkContactMustExist(user.username, contact_id) 

    const skip = (requestValidate.page-1)*(requestValidate.size)
    const addresses = await prismaClient.address.findMany({
      where: {
        contact_id
      },
      take: requestValidate.size,
      skip

    })

    if(!addresses) throw new ResponseError(404,"Addresses not found")
    const total_address = await prismaClient.address.count({
      where: {
        contact_id
      }
    })
    const data = addresses.map(address=>toAddressResponse(address))

    return {
      addresses: data,
      paging: {
        current_page: requestValidate.page,
        total_page: total_address,
        size: requestValidate.page
      }
    }
  }
}
