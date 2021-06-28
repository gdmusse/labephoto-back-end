import { UserRole } from "../../src/model/User";

export class AuthenticatorMock {
  public generateToken = (input: AuthenticationData): string => {
    return "token_mock"
  };

  public getData(token: string) {
    return {
      id: "id_mock",
      role: UserRole.ADMIN
    }
  }
}

export interface AuthenticationData {
  id: string;
  role: string;
}

export default new AuthenticatorMock();
