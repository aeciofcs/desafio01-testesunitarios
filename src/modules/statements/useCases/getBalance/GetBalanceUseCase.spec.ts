import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Get Balance", () => {

  beforeEach( () => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      userRepositoryInMemory
    );
  })


  it("Should be able to get balance from user", async () => {
    const user: ICreateUserDTO = {
      name: "Aecio",
      email: "aeciofcs@gmail.com",
      password: "aecio123"
    };
    const userCreated = await userRepositoryInMemory.create(user);

    const balance = await getBalanceUseCase.execute({user_id: userCreated.id!});

    expect(balance).toHaveProperty("balance");
    expect(balance).toHaveProperty("statement");
  })

  it("Should be no able to get balance the user no existing", async () => {
    expect( async ()=>{
      const user_id = "123456789"
      await getBalanceUseCase.execute({user_id});
    }).rejects.toBeInstanceOf(GetBalanceError);

  });

})
