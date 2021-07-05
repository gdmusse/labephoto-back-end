import { Photo } from "../model/Photo";
import { BaseDatabase } from "./BaseDatabase";

export class PhotoDatabase extends BaseDatabase {
  protected tableName: string = "labephoto_photos";
  protected secondTableName: string = "labephoto_tags";
  protected thirdTableName: string = "labephoto_users";

  private toPhotoModel(dbModel?: any): Photo | undefined {
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
          collection: photo.getCollection(),
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

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPhotoById(id: string): Promise<Photo> {
    try {
      const result = await this.getConnection().raw(`
      SELECT ${this.tableName}.*, GROUP_CONCAT(${this.secondTableName}.tag) as tags, ${this.thirdTableName}.nickname as author
      FROM ${this.tableName}
      JOIN ${this.secondTableName} ON ${this.tableName}.id = ${this.secondTableName}.photo_id
      JOIN ${this.thirdTableName} ON ${this.tableName}.author = ${this.thirdTableName}.id
      WHERE ${this.tableName}.id = '${id}'
    `);

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new PhotoDatabase();
