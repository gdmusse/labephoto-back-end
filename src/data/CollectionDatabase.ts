import dayjs from "dayjs";
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

  public async getCollections(id: string): Promise<Array<Collection> | null>{
    try{
      const result = await this.getConnection()
      .select("id", "title", "subtitle", "image", "date")
      .from(`${this.tableName}`)
      .where({
        author_id: id
      });

    if (result.length > 0) {
      result.forEach((collection: any) => {
        collection.date = dayjs(collection.date).format("YYYY-MM-DD HH:mm:ss");
      });
      return result;
    } else {
      return null;
    }
    }catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }


}

export default new CollectionDatabase();
