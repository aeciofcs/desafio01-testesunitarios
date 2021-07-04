import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
  })


  it("Should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      name: "Aecio",
      email: "aeciofcs@gmail.com",
      password: "aecio123"
    }
    await createUserUseCase.execute(user)

    const userCreated = await userRepositoryInMemory.findByEmail(user.email);

    const showUser = await showUserProfileUseCase.execute( userCreated?.id! )

    expect(showUser).toHaveProperty("id");
    expect(showUser).toHaveProperty("name");
    expect(showUser).toHaveProperty("email");
    expect(showUser).toHaveProperty("password");
  })

  it("Should be no able to show user profile no existing", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Aecio",
        email: "aeciofcs@gmail.com",
        password: "aecio123"
      };

      const userCreated = await userRepositoryInMemory.findByEmail(user.email);

      await showUserProfileUseCase.execute( userCreated?.id! );
    }).rejects.toBeInstanceOf(ShowUserProfileError);

  });

})
