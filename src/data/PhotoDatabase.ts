import dayjs from "dayjs";
import {
  Photo,
  PhotoInputDTO,
  PhotoToCollectionInputDTO,
  PhotoToCollectionOutputDTO,
} from "../model/Photo";
import { BaseDatabase } from "./BaseDatabase";

export class PhotoDatabase extends BaseDatabase {
  protected tableName: string = "labephoto_photos";
  protected secondTableName: string = "labephoto_tags";
  protected thirdTableName: string = "labephoto_users";
  protected fourthTableName: string = "labephoto_collection_photos";

  private toPhotoModel(dbModel?: any): Photo | null {
    return (
      dbModel &&
      new Photo(
        dbModel.id,
        dbModel.subtitle,
        dbModel.author,
        dbModel.date,
        dbModel.file,
        dbModel.tags,
        dbModel.collection
      )
    );
  }

  public async createPhoto(photo: Photo): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id: photo.getId(),
          subtitle: photo.getSubtitle(),
          author: photo.getAuthor(),
          date: photo.getDate(),
          file: photo.getFile(),
        })
        .into(this.tableName);

      for (var tag of photo.getTags()) {
        await this.getConnection()
          .insert({ photo_id: photo.getId(), tag })
          .into(this.secondTableName);
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllPhotos(): Promise<Array<Photo>> {
    try {
      const result = await this.getConnection().raw(`
      SELECT ${this.tableName}.*, GROUP_CONCAT(${this.secondTableName}.tag) as tags
      FROM ${this.tableName}
      JOIN ${this.secondTableName} ON ${this.tableName}.id = ${this.secondTableName}.photo_id
      GROUP BY id
    `);

      result[0].forEach((photo: any) => {
        photo.date = dayjs(photo.date).format("YYYY-MM-DD HH:mm:ss");
      });

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPhotoById(id: string): Promise<Photo | null> {
    try {
      const result = await this.getConnection()
        .select(
          `${this.tableName}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.secondTableName}.tag) as tags`
          ),
          this.getConnection().raw(`${this.thirdTableName}.nickname as author`)
        )
        .from(`${this.tableName}`)
        .join(
          `${this.secondTableName}`,
          `${this.tableName}.id `,
          `=`,
          `${this.secondTableName}.photo_id`
        )
        .join(
          `${this.thirdTableName}`,
          `${this.tableName}.author`,
          `=`,
          `${this.thirdTableName}.id`
        )
        .where(`${this.tableName}.id`, `=`, `${id}`);

      if (result[0].id === null) {
        return null;
      } else {
        result[0].date = dayjs(result[0].date).format("YYYY-MM-DD HH:mm:ss");
        return this.toPhotoModel(result[0]);
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async addPhotoToCollection(
    collection: PhotoToCollectionOutputDTO
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          photo_id: collection.photo_id,
          collection_id: collection.collection_id,
          date: collection.date,
        })
        .into(this.fourthTableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async checkPhotoInCollection(
    collection: PhotoToCollectionInputDTO
  ): Promise<boolean> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(`${this.fourthTableName}`)
        .where({
          photo_id: collection.photo_id,
          collection_id: collection.collection_id,
        });

      if (result[0]) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new PhotoDatabase();
