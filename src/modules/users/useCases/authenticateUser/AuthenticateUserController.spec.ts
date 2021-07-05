import request from "supertest";
import { Connection } from "typeorm";
import  createConnection  from "../../../../database/index";
import { app } from "../../../../app";
import { hash } from "bcryptjs";
import {v4 as uuid} from "uuid";


let connection: Connection;

describe("Authenticate User", () => {
  beforeAll( async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash("admin123", 8);
    const id = uuid();
    await connection.query(
      `INSERT INTO USERS (id, name, email, password, created_at)
                  VALUES('${id}', 'admin', 'admin@finapi.com.br', '${password}', 'now()')
      `
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to authenticate a user", async () => {
    const responseAuth = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin123"
    });

    console.log(responseAuth.body)
    expect(responseAuth.status).toBe(200);
    expect(responseAuth.body).toHaveProperty("user");
    expect(responseAuth.body).toHaveProperty("token");

  });

  /*
  it("Should be no able to create a new user with name existing", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Aecio",
      email: "aeciofcs@gmail.com",
      password: "aecio123"
    });

    expect(response.status).toBe(400);
  });
  */

});
