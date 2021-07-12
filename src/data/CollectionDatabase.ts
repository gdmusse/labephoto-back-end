import { Collection } from "../model/Collection";
import { BaseDatabase } from "./BaseDatabase";

export class CollectionDatabase extends BaseDatabase {
  protected tableName: string = "labephoto_collections";
  protected secondTableName: string = "labephoto_collection_photos";

  public async createPhotoCollection(collection: Collection): Promise<void> {
    try {
      await this.getConnection().insert(collection).into(this.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }


}

export default new CollectionDatabase();
