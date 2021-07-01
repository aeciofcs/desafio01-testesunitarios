import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create Users", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to create a new user", async () => {
    const user = {
      name: "aecio",
      email: "aeciofcs@gmail.com",
      password: "aecio123"
    }
    await createUserUseCase.execute(user);

    const userCreated = await userRepositoryInMemory.findByEmail(user.email)

    console.log(userCreated)
    expect(userCreated).toHaveProperty("id");

  })
})
