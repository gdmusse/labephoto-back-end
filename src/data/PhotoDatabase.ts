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
  protected fifthTableName: string = "labephoto_collections";

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
        dbModel.collections
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
      const result = await this.getConnection()
        .select(
          `${this.tableName}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.secondTableName}.tag) as tags`
          ),
          this.getConnection().raw(`${this.thirdTableName}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.fifthTableName}.title) as collections`
          )
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
        .leftJoin(
          `${this.fourthTableName}`,
          `${this.tableName}.id`,
          `=`,
          `${this.fourthTableName}.photo_id`
        )
        .leftJoin(
          `${this.fifthTableName}`,
          `${this.fourthTableName}.collection_id`,
          `=`,
          `${this.fifthTableName}.id`
        )
        .groupBy(`${this.tableName}.id`);
      result.forEach((photo: any) => {
        photo.date = dayjs(photo.date).format("YYYY-MM-DD HH:mm:ss");
      });

      return result;
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
          this.getConnection().raw(`${this.thirdTableName}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.fifthTableName}.title) as collections`
          )
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
        .leftJoin(
          `${this.fourthTableName}`,
          `${this.tableName}.id`,
          `=`,
          `${this.fourthTableName}.photo_id`
        )
        .leftJoin(
          `${this.fifthTableName}`,
          `${this.fourthTableName}.collection_id`,
          `=`,
          `${this.fifthTableName}.id`
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

  public async getPhotosInCollection(
    collection: string
  ): Promise<Array<Photo> | Photo | null> {
    try {
      const result = await this.getConnection()
        .select(
          `${this.fourthTableName}.photo_id`,
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.fourthTableName}.date) as added_date`
          ),
          `${this.tableName}.subtitle`,
          `${this.tableName}.author`,
          `${this.tableName}.date`,
          `${this.tableName}.file`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.secondTableName}.tag) as tags`
          ),
          this.getConnection().raw(`${this.thirdTableName}.nickname as author`),
          this.getConnection().raw(`${this.fifthTableName}.title as collection_title`)
        )
        .from(`${this.fourthTableName}`)
        .join(
          `${this.tableName}`,
          `${this.fourthTableName}.photo_id `,
          `=`,
          `${this.tableName}.id`
        )
        .join(
          `${this.secondTableName}`,
          `${this.fourthTableName}.photo_id `,
          `=`,
          `${this.secondTableName}.photo_id`
        )
        .join(
          `${this.thirdTableName}`,
          `${this.tableName}.author`,
          `=`,
          `${this.thirdTableName}.id`
        )
        .join(
          `${this.fifthTableName}`,
          `${this.fifthTableName}.id`,
          `=`,
          `${this.fourthTableName}.collection_id`
        )
        .groupBy(`${this.fourthTableName}.photo_id`)
        .where({
          collection_id: collection,
        });

      if (result.length > 0) {
        result.forEach((photo: any) => {
          photo.date = dayjs(photo.date).format("YYYY-MM-DD HH:mm:ss");
        });
        return result;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchPhotoByAuthor(
    author: string
  ): Promise<Array<Photo> | Photo | null> {
    try {
      const result = await this.getConnection()
        .select(
          `${this.tableName}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.secondTableName}.tag) as tags`
          ),
          this.getConnection().raw(`${this.thirdTableName}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.fifthTableName}.title) as collections`
          )
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
        .leftJoin(
          `${this.fourthTableName}`,
          `${this.tableName}.id`,
          `=`,
          `${this.fourthTableName}.photo_id`
        )
        .leftJoin(
          `${this.fifthTableName}`,
          `${this.fourthTableName}.collection_id`,
          `=`,
          `${this.fifthTableName}.id`
        )
        .groupBy(`${this.tableName}.id`)
        .where(`${this.thirdTableName}.nickname`, `like`, `%${author}%`);

      if (result.length === 0) {
        return null;
      } else {
        result.forEach((photo: any) => {
          photo.date = dayjs(photo.date).format("YYYY-MM-DD HH:mm:ss");
        });
        return result;
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchPhotoBySubtitle(
    subtitle: string
  ): Promise<Array<Photo> | Photo | null> {
    try {
      const result = await this.getConnection()
        .select(
          `${this.tableName}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.secondTableName}.tag) as tags`
          ),
          this.getConnection().raw(`${this.thirdTableName}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.fifthTableName}.title) as collections`
          )
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
        .leftJoin(
          `${this.fourthTableName}`,
          `${this.tableName}.id`,
          `=`,
          `${this.fourthTableName}.photo_id`
        )
        .leftJoin(
          `${this.fifthTableName}`,
          `${this.fourthTableName}.collection_id`,
          `=`,
          `${this.fifthTableName}.id`
        )
        .groupBy(`${this.tableName}.id`)
        .where(`${this.tableName}.subtitle`, `like`, `%${subtitle}%`);

      if (result.length === 0) {
        return null;
      } else {
        result.forEach((photo: any) => {
          photo.date = dayjs(photo.date).format("YYYY-MM-DD HH:mm:ss");
        });
        return result;
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchPhotoByTag(
    tag: string
  ): Promise<Array<Photo> | Photo | null> {
    try {
      const result = await this.getConnection()
        .select(
          `${this.tableName}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.secondTableName}.tag) as tags`
          ),
          this.getConnection().raw(`${this.thirdTableName}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.fifthTableName}.title) as collections`
          )
        )
        .from(`${this.secondTableName}`)
        .join(
          `${this.tableName}`,
          `${this.secondTableName}.photo_id `,
          `=`,
          `${this.tableName}.id`
        )
        .join(
          `${this.thirdTableName}`,
          `${this.tableName}.author`,
          `=`,
          `${this.thirdTableName}.id`
        )
        .leftJoin(
          `${this.fourthTableName}`,
          `${this.tableName}.id`,
          `=`,
          `${this.fourthTableName}.photo_id`
        )
        .leftJoin(
          `${this.fifthTableName}`,
          `${this.fourthTableName}.collection_id`,
          `=`,
          `${this.fifthTableName}.id`
        )
        .groupBy(`${this.tableName}.id`)
        .having(`tags`, `like`, `%${tag}%`);

      if (result.length === 0) {
        return null;
      } else {
        result.forEach((photo: any) => {
          photo.date = dayjs(photo.date).format("YYYY-MM-DD HH:mm:ss");
        });
        return result;
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new PhotoDatabase();
