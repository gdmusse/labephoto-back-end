import dayjs from "dayjs";
import { Collection, PhotoCollectionUpdateInputDTO } from "../model/Collection";
import { BaseDatabase } from "./BaseDatabase";

export class CollectionDatabase extends BaseDatabase {
  protected collectionTable: string = "labephoto_collections";
  protected collectionPhotosTable: string = "labephoto_collection_photos";

  public async createPhotoCollection(collection: Collection): Promise<void> {
    try {
      await this.getConnection().insert(collection).into(this.collectionTable);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getCollections(id: string): Promise<Array<Collection> | null> {
    try {
      const result = await this.getConnection()
        .select("id", "title", "subtitle", "image", "date")
        .from(`${this.collectionTable}`)
        .where({
          author_id: id,
        });

      if (result.length > 0) {
        result.forEach((collection: any) => {
          collection.date = dayjs(collection.date).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        return result;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteCollection(collection_id: string): Promise<void> {
    try {
      await this.getConnection()
        .delete()
        .from(this.collectionPhotosTable)
        .where({ collection_id });

      await this.getConnection()
        .delete()
        .from(this.collectionTable)
        .where({ id: collection_id });
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async updateCollection(input: PhotoCollectionUpdateInputDTO, author_id: string, collection_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .update({
          title: input.title,
          subtitle: input.subtitle,
          image: input.image,
        })
        .from(this.collectionTable)
        .where({ id: collection_id, author_id: author_id });
      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new CollectionDatabase();
