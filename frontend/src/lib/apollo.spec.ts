jest.mock("@apollo/client");
import { client } from "./apollo";

describe("Apollo Client", () => {
  it("should be defined", () => {
    expect(client).toBeDefined();
  });
});
