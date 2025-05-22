import {
  DELETE_EMPLOYEE,
  GET_EMPLOYEES,
  GET_EMPLOYEE,
  CREATE_EMPLOYEE,
  GET_DASHBOARD_STATS,
  UPDATE_EMPLOYEE,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
} from "./mutations";

describe("GraphQL queries and mutations", () => {
  it("should be defined", () => {
    expect(DELETE_EMPLOYEE).toBeDefined();
    expect(GET_EMPLOYEES).toBeDefined();
    expect(GET_EMPLOYEE).toBeDefined();
    expect(CREATE_EMPLOYEE).toBeDefined();
    expect(GET_DASHBOARD_STATS).toBeDefined();
    expect(UPDATE_EMPLOYEE).toBeDefined();
    expect(UPDATE_PROFILE).toBeDefined();
    expect(CHANGE_PASSWORD).toBeDefined();
  });
  it("should be a valid gql document", () => {
    expect(typeof DELETE_EMPLOYEE).toBe("object");
    expect(typeof GET_EMPLOYEES).toBe("object");
    expect(typeof GET_EMPLOYEE).toBe("object");
    expect(typeof CREATE_EMPLOYEE).toBe("object");
    expect(typeof GET_DASHBOARD_STATS).toBe("object");
    expect(typeof UPDATE_EMPLOYEE).toBe("object");
    expect(typeof UPDATE_PROFILE).toBe("object");
    expect(typeof CHANGE_PASSWORD).toBe("object");
  });
});
