import { User } from "../../src/model/User";
import { userMockAdmin, userMockNormal } from "./UserMock";

export class UserDatabase {

   public async createUser(user: User): Promise<void> {}

   public async getUserByEmail(email: string): Promise<User | undefined> {
      switch (email) {
         case "astrodev@gmail.com":
            return userMockAdmin
         case "bananinha@gmail.com":
            return userMockNormal
         default:
            return undefined
      }
   }

}

export default new UserDatabase()
