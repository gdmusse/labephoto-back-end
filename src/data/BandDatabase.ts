import { BaseDatabase } from "./BaseDatabase";
import { Band } from "../model/Band";

export class BandDatabase extends BaseDatabase {
  protected tableName: string = "lama_bands";

  private toBandModel(dbModel?: any): Band | undefined {
    return (
      dbModel &&
      new Band(
        dbModel.id,
        dbModel.name,
        dbModel.music_genre,
        dbModel.responsible
      )
    );
  }

  public async createBand(band: Band): Promise<void> {
    try {
      await this.getConnection().insert(band).into(this.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getBandById(id: string): Promise<Band | undefined> {
    try {
      const result = await this.getConnection()
        .select()
        .from(this.tableName)
        .where({ id });

      return this.toBandModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getBandByName(name: string): Promise<Band | undefined> {
    try {
      const result = await this.getConnection()
        .select()
        .from(this.tableName)
        .where("name", "like", `%${name}%`);

      return this.toBandModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new BandDatabase();
