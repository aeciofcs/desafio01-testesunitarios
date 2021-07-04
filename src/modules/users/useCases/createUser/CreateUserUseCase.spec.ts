import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("Should be able to create a new user", async () => {
    const user = {
      name: "aecio",
      email: "aeciofcs@gmail.com",
      password: "aecio123"
    }
    await createUserUseCase.execute(user);

    const userCreated = await userRepositoryInMemory.findByEmail(user.email)

    expect(userCreated).toHaveProperty("id");
    expect(userCreated).toHaveProperty("name");
    expect(userCreated).toHaveProperty("email");
    expect(userCreated).toHaveProperty("password");

  })

  it("Should be able to no create existing user", () => {
    expect( async () => {
      const user = {
        name: "aecio",
        email: "aeciofcs@gmail.com",
        password: "aecio123"
      }
      await createUserUseCase.execute(user);

      const user2 = {
        name: "aecio",
        email: "aeciofcs@gmail.com",
        password: "aecio123"
      }
      await createUserUseCase.execute(user);

    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
