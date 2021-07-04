import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createStatementUseCase: CreateStatementUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementsRepositoryInMemory
    )
  })

  it("Should be able to create a new statement to deposit", async () => {
    const user: ICreateUserDTO = {
      name: "Aecio", email: "aeciofcs@gmail.com", password: "aecio123"
    };
    await userRepositoryInMemory.create(user);

    const userCreated = await userRepositoryInMemory.findByEmail(user.email);
    const type = "deposit" as OperationType;
    const amount = 100;
    const description = "Deposit to 100 dolars";

    const statementData: ICreateStatementDTO = {
      user_id: userCreated?.id!,
      type,
      amount,
      description
    };
    const statement = await createStatementUseCase.execute(statementData);

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");

  });

  it("Should be no able to create a new statement from user no existing", () => {
    expect(async () => {
      const user_id = "123456789123456789";
      const type = "deposit" as OperationType;
      const amount = 100;
      const description = "Deposit to 100 dolars";

      const statementData: ICreateStatementDTO = {
        user_id,
        type,
        amount,
        description
      };

      await createStatementUseCase.execute(statementData);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should be no able to create a new statement from user without funds", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "Aecio", email: "aeciofcs@gmail.com", password: "aecio123"
      };
      await userRepositoryInMemory.create(user);

      const userCreated = await userRepositoryInMemory.findByEmail(user.email);
      const type = "withdraw" as OperationType;
      const amount = 100;
      const description = "withdraw to 100 dolars";

      const statementData: ICreateStatementDTO = {
        user_id: userCreated?.id!,
        type,
        amount,
        description
      };

      await createStatementUseCase.execute(statementData);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })



})
