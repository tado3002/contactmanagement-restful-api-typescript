import supertest from "supertest";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { ListAddressRequest, UpdateAddressRequest } from "../src/model/address-model";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  it("should be able to create address to a contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "jl. buyut sateri",
        city: "Pasuruan",
        provience: "East Java",
        postal_code: "67184",
        country: "Indonesia",
      });
    expect(response.status).toBe(200);
    expect(response.body.data.country).toBe("Indonesia");
  });
  it("should reject to create address to a contact if token is wrong", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "salah")
      .send({
        street: "jl. buyut sateri",
        city: "Pasuruan",
        provience: "East Java",
        postal_code: "67184",
        country: "Indonesia",
      });
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
  it("should reject to create address to a contact if contact is not found", async () => {
    const response = await supertest(web)
      .post(`/api/contacts/${1}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "jl. buyut sateri",
        city: "Pasuruan",
        provience: "East Java",
        postal_code: "67184",
        country: "Indonesia",
      });
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
  it("should reject to create address to a contact if input is blank", async () => {
    const contact = await ContactTest.get()
    const response = await supertest(web)
      .post(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN", "test")
      .send({
        street: "",
        city: "Pasuruan",
        provience: "East Java",
        postal_code: "67184",
        country: "Indonesia",
      });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to get address", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .get(`/api/contacts/${address!.contact_id}/addresses/${address!.id}`)
      .set("X-API-TOKEN", "test");

    expect(getAddress.status).toBe(200);
    expect(getAddress.body.data.id).toBe(address!.id);
    expect(getAddress.body.data.street).toBe(address!.street);
    expect(getAddress.body.data.city).toBe(address!.city);
  });
  it("should reject to get address if token is wrong", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .get(`/api/contacts/${address!.contact_id}/addresses/${address!.id}`)
      .set("X-API-TOKEN", "salah");

    expect(getAddress.status).toBe(401);
    expect(getAddress.body.errors).toBeDefined();
  });
  it("should reject to get address if contact_id not found", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .get(`/api/contacts/${address!.contact_id + 1}/addresses/${address!.id}`)
      .set("X-API-TOKEN", "test");

    expect(getAddress.status).toBe(404);
    expect(getAddress.body.errors).toBeDefined();
  });
  it("should reject to get address if address_id not found", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .get(`/api/contacts/${address!.contact_id}/addresses/${address!.id + 1}`)
      .set("X-API-TOKEN", "test");

    expect(getAddress.status).toBe(404);
    expect(getAddress.body.errors).toBeDefined();
  });
});

describe("PATCH /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
    await AddressTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  const newAddress: UpdateAddressRequest = {
    street: "jl jalan",
    city: "jomokerto",
    provience: "Jawa selatan",
    postal_code: "67182",
    country: "Australia",
  };

  it("should be able to update address", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .patch(`/api/contacts/${address!.contact_id}/addresses/${address!.id}`)
      .set("X-API-TOKEN", "test")
      .send(newAddress);

    expect(getAddress.status).toBe(200);
    expect(getAddress.body.data.id).toBe(address!.id);
    expect(getAddress.body.data.street).toBe(newAddress.street);
    expect(getAddress.body.data.city).toBe(newAddress.city);
  });
  it("should reject to get address if token is wrong", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .patch(`/api/contacts/${address!.contact_id}/addresses/${address!.id}`)
      .set("X-API-TOKEN", "salah")
      .send(newAddress);

    expect(getAddress.status).toBe(401);
    expect(getAddress.body.errors).toBeDefined();
  });
  it("should reject to get address if contact_id not found", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .patch(
        `/api/contacts/${address!.contact_id + 1}/addresses/${address!.id}`,
      )
      .set("X-API-TOKEN", "test")
      .send(newAddress);

    expect(getAddress.status).toBe(404);
    expect(getAddress.body.errors).toBeDefined();
  });
  it("should reject to get address if address_id not found", async () => {
    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .patch(`/api/contacts/${address!.contact_id}/addresses/${1}`)
      .set("X-API-TOKEN", "test")
      .send(newAddress);

    expect(getAddress.status).toBe(404);
    expect(getAddress.body.errors).toBeDefined();
  });
  it("should reject to update address if input is blank", async () => {
    let updateData = newAddress;
    updateData.street = "";

    const address = await AddressTest.get();
    const getAddress = await supertest(web)
      .patch(`/api/contacts/${address!.contact_id}/addresses/${address!.id}`)
      .set("X-API-TOKEN", "test")
      .send(updateData);

    expect(getAddress.status).toBe(400);
    expect(getAddress.body.errors).toBeDefined();
  });
});

describe("DELETE api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await AddressTest.deleteAll();
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  it("should be able to delete address", async () => {
    await AddressTest.create()
    const address = await AddressTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${address!.contact_id}/addresses/${address!.id}`)
      .set("X-API-TOKEN", "test");
    expect(response.status).toBe(200);
  });
  it("should reject to delete address if address not found", async () => {
    await AddressTest.create();
    const address = await AddressTest.get();
    const response = await supertest(web)
      .delete(
        `/api/contacts/${address!.contact_id}/addresses/${address!.id+1}`,
      )
      .set("X-API-TOKEN", "test");
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/contactId/addresses", ()=>{
  beforeEach(async()=>{
    await UserTest.create()
    await ContactTest.create()
    await AddressTest.create()
  })
  afterEach(async()=>{
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it("should be able to get address list", async()=>{
    const contact = await ContactTest.get()
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}/addresses`)
      .set("X-API-TOKEN","test")
    expect(response.status).toBe(200)
  })


})






