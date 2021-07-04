import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
  })

  it("Should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      name: "Aecio",
      email: "aeciofcs@gmail.com",
      password: "aecio123"
    }
    await createUserUseCase.execute(user)

    const userAuthenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(userAuthenticated).toHaveProperty("token");
    expect(userAuthenticated).toHaveProperty("user.id");
    expect(userAuthenticated).toHaveProperty("user.name");
    expect(userAuthenticated).toHaveProperty("user.email");
  });

  it("Should be no able to authenticate a user with incorrect email", () => {
    expect( async () => {
      const user: ICreateUserDTO = {
        name: "Aecio",
        email: "aeciofcs@gmail.com",
        password: "aecio123"
      }
      await createUserUseCase.execute(user)

      const user2: ICreateUserDTO = {
        name: "Aecio",
        email: "aecio@gmail.com",
        password: "aecio123"
      }

      await authenticateUserUseCase.execute({
        email: user2.email,
        password: user2.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  });

  it("Should be no able to authenticate a user with incorrect password", () => {
    expect( async () => {
      const user: ICreateUserDTO = {
        name: "Aecio",
        email: "aeciofcs@gmail.com",
        password: "aecio123"
      }
      await createUserUseCase.execute(user)

      const user2: ICreateUserDTO = {
        name: "Aecio",
        email: "aeciofcs@gmail.com",
        password: "incorrectpassword"
      }

      await authenticateUserUseCase.execute({
        email: user2.email,
        password: user2.password
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  });

});
