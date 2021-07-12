import request from "supertest";
import authConfig from '../../../../config/auth';
import { Connection } from "typeorm";
import  createConnection  from "../../../../database/index";
import { app } from "../../../../app";
import { hash } from "bcryptjs";
import {v4 as uuid} from "uuid";
import { sign } from "jsonwebtoken";

let connection: Connection

describe("Show User Profile Controller", () => {
  beforeAll( async () => {
    connection = await createConnection;
    await connection.runMigrations();

    const password = await hash("aecio123", 8);
    const id = uuid();
    await connection.query(
      `INSERT INTO USERS (id, name, email, password, created_at)
                  VALUES('${id}', 'aecio', 'aecio@finapi.com.br', '${password}', 'now()')
      `
    );

  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })


  it("Should be able to show an user profile", async () => {
    const userAuth = await request(app).post("/api/v1/sessions").send({
      email: "aecio@finapi.com.br",
      password: "aecio123"
    });

    const { user, token } = userAuth.body;

    const response = await request(app)
                          .get("/api/v1/profile")
                          .set({Authorization: `Bearer ${token}`})

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual("aecio");
    expect(response.body).toHaveProperty("updated_at");
  });

  it("Should no be able to show a profile if user not exists", async () => {
    const user = {
      id: uuid(),
      name: "aecio",
      email: "aecio@finapi.com.br",
      password: "aecio123"
    };

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ user }, secret, {
      subject: user.id,
      expiresIn,
    });

    const response = await request(app)
                          .get("/api/v1/profile")
                          .set({Authorization: `Bearer ${token}`})

    expect(response.status).toBe(404);

  });
})
