import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
  protected tableName: string = "labephoto_users";

  private toUserModel(dbModel?: any): User | undefined {
    return (
      dbModel &&
      new User(
        dbModel.id,
        dbModel.name,
        dbModel.nickname,
        dbModel.email,
        dbModel.password
      )
    );
  }

  public async createUser(user: User): Promise<void> {
    try {
      console.log("date", new Date())
      await this.getConnection().insert(user).into(this.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await this.getConnection()
        .select()
        .from(this.tableName)
        .where({ email });

      return this.toUserModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByNickname(nickname: string): Promise<User | undefined> {
    try {
      const result = await this.getConnection()
        .select()
        .from(this.tableName)
        .where({ nickname });

      return this.toUserModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new UserDatabase();
