import supertest from "supertest";
import { web } from "../src/application/web";
import { UserTest } from "./test-util";
import bcrypt from "bcrypt";

describe("POST api/users", function () {
  afterEach(async () => {
    await UserTest.delete();
  });
  it("should reject register new user if request is invalid", async () => {
    const response = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("should register new user", async () => {
    const [username, nama] = ["test", "Muhmurtado"];
    const response = await supertest(web).post("/api/users").send({
      username: username,
      password: "test",
      name: nama,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe(username);
    expect(response.body.data.name).toBe(nama);
  });
});

describe("POST api/users/login", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });

  it("should be able to login", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "test",
    });
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.token).toBeDefined();
  });

  it("should reject login user if username not found", async () => {
    const response = await supertest(web).post("/api/users/login").send({
      username: "nguwawor",
      password: "test",
    });
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined;
  });
});

describe("GET api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });
  it("should be able to get user", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "test");
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
  it("should reject to get user if token is invalid", async () => {
    const response = await supertest(web)
      .get("/api/users/current")
      .set("X-API-TOKEN", "nguwawor");
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
});

describe("PATCH api/users/current", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await UserTest.delete();
  });
  it("should reject update user if request is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        password: "",
        name: "",
      });
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
  it("should reject update user if token is invalid", async () => {
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "salah")
      .send({
        password: "test",
        name: "test",
      });
    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });
  it("should be able to update user name", async () => {
    const newName: string = "cihuuuy";
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        name: newName,
      });
    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(newName);
  });
  it("should be able to update user password", async () => {
    const newPassword: string = "inipassword";
    const response = await supertest(web)
      .patch("/api/users/current")
      .set("X-API-TOKEN", "test")
      .send({
        password: newPassword,
      });
    expect(response.status).toBe(200);
    const user = await UserTest.get();
    expect(await bcrypt.compare(newPassword, user.password)).toBe(true);
  });
});

describe("DELETE api/users/current", () => {
  beforeEach(async () => await UserTest.create());
  afterEach(async () => await UserTest.delete());
  it("should reject logout if token is invalid", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "iniinvalid");

    expect(response.status).toBe(401);
    expect(response.body.errors).toBeDefined();
  });

  it("should be able to logout", async () => {
    const response = await supertest(web)
      .delete("/api/users/current")
      .set("X-API-TOKEN", "test");

    expect(response.status).toBe(200);
    const user = await UserTest.get();
    expect(user.token).toBeNull();
  });
});
