import supertest from "supertest";
import { UserTest, ContactTest } from "./test-util";
import { web } from "../src/application/web";





describe("POST api/contacts", () => {
  beforeEach(async () => await UserTest.create());
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should create a new contact", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "tado",
        last_name: "STI",
        email: "muh.murtadlo23@gmail.com",
        phone: "082412842",
      });
    expect(response.status).toBe(200);
    expect(response.body.data.first_name).toBe("tado");
  });
  it("should reject to create a new contact if token is wrong", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "salah")
      .send({
        first_name: "tado",
        last_name: "STI",
        email: "muh.murtadlo23@gmail.com",
        phone: "082412842",
      });
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
  it("should reject to create a new contact if first_name is blank", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        last_name: "STI",
        email: "muh.murtadlo23@gmail.com",
        phone: "082412842",
      });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("should reject to create a new contact if email is invalid", async () => {
    const response = await supertest(web)
      .post("/api/contacts")
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "tado",
        last_name: "STI",
        email: "muh.murtadlo23",
        phone: "082412842",
      });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  it("should be able to get contact by id", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(contact.id);
    expect(response.body.data.first_name).toBe(contact.first_name);
    expect(response.body.data.last_name).toBe(contact.last_name);
    expect(response.body.data.phone).toBe(contact.phone);
  });

  it("should reject to get contact by id if contact id is not found", async () => {
    const response = await supertest(web)
      .get("/api/contacts/3")
      .set("X-API-TOKEN", "test");
    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
  it("should reject to get contact by id if token is wrong", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .get(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "salah");
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH api/contacts/:contactsId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should able to update a contact", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .patch(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "tado",
        phone: "082146796695",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.first_name).toBe("tado");
    expect(response.body.data.phone).toBe("082146796695");
  });

  it("should reject to update a contact if input is blank", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .patch(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test")
      .send({
        first_name: "",
        phone: "",
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });

  it("should be able to delete contact if contact id found", async () => {
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("OK");
  });
  it("should reject to delete contact if contact id not found", async () => {
    const response = await supertest(web)
      .delete(`/api/contacts/3`)
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(404);
    expect(response.body.errors).toBeDefined();
  });
  it("should reject to delete contact if token is wrong", async () => {
    await ContactTest.create();
    const contact = await ContactTest.get();
    const response = await supertest(web)
      .delete(`/api/contacts/${contact.id}`)
      .set("X-API-TOKEN", "salah");

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await ContactTest.create();
  });
  afterEach(async () => {
    await ContactTest.deleteAll();
    await UserTest.delete();
  });
  const createReq = {
    first_name: "tado",
    last_name: "sti",
    phone: "082148539123",
    email: "muh.murtadlo",
    username: "test",
  };
  it("should be able to get contacts", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.paging.size).toBe(10);
    expect(response.body.paging.current_page).toBe(1);
    expect(response.body.paging.total_page).toBe(1);
  });
  it("should be able to get contacts by name", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({
        name: "sti",
      });
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].last_name).toBe("sti");
  });
  it("should reject to get contacts by name if name query is blank", async () => {
    const response = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({
        name: "",
      });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to get contacts by phone", async () => {
    const createReqWithNewName = createReq;
    createReqWithNewName.phone = "081330329363";
    await ContactTest.createWithParam(createReqWithNewName);
    const response = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({
        phone: createReqWithNewName.phone,
      });
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].phone).toBe(createReqWithNewName.phone);
    expect(response.body.paging.size).toBe(10);
  });
  it("should be able to get contacts by email, size is 5, and total page is 4", async () => {
    const createReqWithNewName = createReq;
    createReqWithNewName.email = "tado.userfighter@gmail.com";
    for (let i = 0; i < 20; i++) {
      await ContactTest.createWithParam(createReqWithNewName);
    }
    const response = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({
        email: createReqWithNewName.email,
        size: 5,
      });
    expect(response.status).toBe(200);
    expect(response.body.data[0].email).toBe(createReqWithNewName.email);
    expect(response.body.paging.size).toBe(5);
    expect(response.body.paging.total_page).toBe(4);
  });
  it("should reject to get contacts by email if email is invalid", async () => {
    const createReqWithNewName = createReq;
    createReqWithNewName.email = "ewwefwef";
    await ContactTest.createWithParam(createReqWithNewName);
    const response = await supertest(web)
      .get("/api/contacts")
      .set("X-API-TOKEN", "test")
      .query({
        email: createReqWithNewName.email,
      });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
