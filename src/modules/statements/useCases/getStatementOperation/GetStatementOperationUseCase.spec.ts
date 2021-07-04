import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

interface IRequest {
  user_id: string;
  statement_id: string;
}

let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Balance", () => {

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userRepositoryInMemory,
      statementsRepositoryInMemory
    );
  })

  it("Should be able to return an statement operation", async () => {
    const userCreated = await userRepositoryInMemory.create({
      name: "Aecio",
      email: "aeciofcs@gmail.com",
      password: "aecio123" }
    );

    const statementCreated = await statementsRepositoryInMemory.create({
      user_id: userCreated.id!,
      type: "deposit" as OperationType,
      amount: 1000,
      description: "Deposit 1000"
    });

    const getStatementOperData: IRequest = {user_id: userCreated.id!, statement_id: statementCreated.id!};

    const statementOperationCreated = await getStatementOperationUseCase.execute(getStatementOperData);

    expect(statementOperationCreated).toHaveProperty("id");
    expect(statementOperationCreated).toHaveProperty("user_id");
    expect(statementOperationCreated).toHaveProperty("type");
    expect(statementOperationCreated).toHaveProperty("amount");
    expect(statementOperationCreated).toHaveProperty("description");

  });

  it("Should be no able to return an statement operation from user no existing", () => {
    expect( async () => {

      const getStatementOperData: IRequest = {user_id: "123456789", statement_id: "123121321231123"};

      await getStatementOperationUseCase.execute(getStatementOperData);

    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should be no able to return an statement operation from statement no existing", () => {
    expect( async () => {
      const userCreated = await userRepositoryInMemory.create({
        name: "Aecio",
        email: "aeciofcs@gmail.com",
        password: "aecio123" }
      );

      const getStatementOperData: IRequest = {user_id: userCreated.id!, statement_id: "12345678999999"};

      await getStatementOperationUseCase.execute(getStatementOperData);
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });


})
