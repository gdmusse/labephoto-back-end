import dayjs from "dayjs";
import {
  Photo,
  PhotoInputDTO,
  PhotoToCollectionInputDTO,
  PhotoToCollectionOutputDTO,
  PhotoUpdateInputDTO,
} from "../model/Photo";
import { BaseDatabase } from "./BaseDatabase";

export class PhotoDatabase extends BaseDatabase {
  protected photosTable: string = "labephoto_photos";
  protected tagsTable: string = "labephoto_tags";
  protected usersTable: string = "labephoto_users";
  protected collectionsPhotosTable: string = "labephoto_collection_photos";
  protected collectionsTable: string = "labephoto_collections";

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
        .into(this.photosTable);

      for (var tag of photo.getTags()) {
        await this.getConnection()
          .insert({ photo_id: photo.getId(), tag })
          .into(this.tagsTable);
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async updatePhoto(
    photo_id: string,
    input: PhotoUpdateInputDTO,
    user_id: string
  ): Promise<any> {
    try {
      const result = await this.getConnection()
        .update({
          subtitle: input.subtitle,
          file: input.file,
        })
        .from(this.photosTable)
        .where({ id: photo_id, author: user_id });
      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async addTagToPhoto(
    photo_id: string,
    tag: string,
    user_id: string
  ): Promise<number[] | void> {
    try {
      const checkAuthor = await this.getConnection()
        .select()
        .into(this.photosTable)
        .where({ id: photo_id, author: user_id });

      if (checkAuthor.length !== 0) {
        const duplicateTest = await this.getConnection()
          .select()
          .from(this.tagsTable)
          .where({ photo_id, tag });

        if (duplicateTest.length === 0) {
          const tags = await this.getConnection()
            .insert({ photo_id, tag })
            .into(this.tagsTable);

          return tags;
        } else {
          return undefined;
        }
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
  public async deleteTagFromPhoto(
    photo_id: string,
    tag: string,
    user_id: string
  ): Promise<number | undefined> {
    try {
      const checkAuthor = await this.getConnection()
        .select()
        .into(this.photosTable)
        .where({ id: photo_id, author: user_id });

      if (checkAuthor.length !== 0) {
        const duplicateTest = await this.getConnection()
          .select()
          .from(this.tagsTable)
          .where({ photo_id, tag });

        if (duplicateTest.length !== 0) {
          const result = await this.getConnection()
            .delete()
            .from(this.tagsTable)
            .where({ photo_id, tag });
          return result;
        }
      }
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deletePhoto(photo_id: string, user_id: string): Promise<any> {
    try {
      await this.getConnection()
        .delete()
        .from(this.tagsTable)
        .where({ photo_id });

      const result = await this.getConnection()
        .delete()
        .from(this.photosTable)
        .where({ id: photo_id, author: user_id });
      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllPhotos(id: string): Promise<Array<Photo>> {
    try {
      const outerThis = this;
      const result = await this.getConnection()
        .select(
          `${this.photosTable}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.tagsTable}.tag) as tags`
          ),
          this.getConnection().raw(`${this.usersTable}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.collectionsTable}.title) as collections`
          )
        )
        .from(`${this.photosTable}`)
        .join(
          `${this.tagsTable}`,
          `${this.photosTable}.id `,
          `=`,
          `${this.tagsTable}.photo_id`
        )
        .join(
          `${this.usersTable}`,
          `${this.photosTable}.author`,
          `=`,
          `${this.usersTable}.id`
        )
        .leftJoin(
          `${this.collectionsPhotosTable}`,
          `${this.photosTable}.id`,
          `=`,
          `${this.collectionsPhotosTable}.photo_id`
        )
        .leftJoin(`${this.collectionsTable}`, function () {
          this.on(
            `${outerThis.collectionsTable}.id`,
            `=`,
            `${outerThis.collectionsPhotosTable}.collection_id`
          ).onIn(`${outerThis.collectionsTable}.author_id`, [id]);
        })
        .groupBy(`${this.photosTable}.id`);
      result.forEach((photo: any) => {
        photo.date = dayjs(photo.date).format("YYYY-MM-DD HH:mm:ss");
      });
      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPhotoById(
    photo_id: string,
    id: string
  ): Promise<Photo | null> {
    try {
      const outerThis = this;
      const result = await this.getConnection()
        .select(
          `${this.photosTable}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.tagsTable}.tag) as tags`
          ),
          this.getConnection().raw(`${this.usersTable}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.collectionsTable}.title) as collections`
          )
        )
        .from(`${this.photosTable}`)
        .join(
          `${this.tagsTable}`,
          `${this.photosTable}.id `,
          `=`,
          `${this.tagsTable}.photo_id`
        )
        .join(
          `${this.usersTable}`,
          `${this.photosTable}.author`,
          `=`,
          `${this.usersTable}.id`
        )
        .leftJoin(
          `${this.collectionsPhotosTable}`,
          `${this.photosTable}.id`,
          `=`,
          `${this.collectionsPhotosTable}.photo_id`
        )
        .leftJoin(`${this.collectionsTable}`, function () {
          this.on(
            `${outerThis.collectionsTable}.id`,
            `=`,
            `${outerThis.collectionsPhotosTable}.collection_id`
          ).onIn(`${outerThis.collectionsTable}.author_id`, [id]);
        })
        .where(`${this.photosTable}.id`, `=`, `${photo_id}`);
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
        .into(this.collectionsPhotosTable);
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
        .from(`${this.collectionsPhotosTable}`)
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
          `${this.collectionsPhotosTable}.photo_id`,
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.collectionsPhotosTable}.date) as added_date`
          ),
          `${this.photosTable}.subtitle`,
          `${this.photosTable}.author`,
          `${this.photosTable}.date`,
          `${this.photosTable}.file`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.tagsTable}.tag) as tags`
          ),
          this.getConnection().raw(`${this.usersTable}.nickname as author`),
          this.getConnection().raw(
            `${this.collectionsTable}.title as collection_title`
          )
        )
        .from(`${this.collectionsPhotosTable}`)
        .join(
          `${this.photosTable}`,
          `${this.collectionsPhotosTable}.photo_id `,
          `=`,
          `${this.photosTable}.id`
        )
        .join(
          `${this.tagsTable}`,
          `${this.collectionsPhotosTable}.photo_id `,
          `=`,
          `${this.tagsTable}.photo_id`
        )
        .join(
          `${this.usersTable}`,
          `${this.photosTable}.author`,
          `=`,
          `${this.usersTable}.id`
        )
        .join(
          `${this.collectionsTable}`,
          `${this.collectionsTable}.id`,
          `=`,
          `${this.collectionsPhotosTable}.collection_id`
        )
        .groupBy(`${this.collectionsPhotosTable}.photo_id`)
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
    author: string,
    id: string
  ): Promise<Array<Photo> | Photo | null> {
    try {
      const outerThis = this;
      const result = await this.getConnection()
        .select(
          `${this.photosTable}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.tagsTable}.tag) as tags`
          ),
          this.getConnection().raw(`${this.usersTable}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.collectionsTable}.title) as collections`
          )
        )
        .from(`${this.photosTable}`)
        .join(
          `${this.tagsTable}`,
          `${this.photosTable}.id `,
          `=`,
          `${this.tagsTable}.photo_id`
        )
        .join(
          `${this.usersTable}`,
          `${this.photosTable}.author`,
          `=`,
          `${this.usersTable}.id`
        )
        .leftJoin(
          `${this.collectionsPhotosTable}`,
          `${this.photosTable}.id`,
          `=`,
          `${this.collectionsPhotosTable}.photo_id`
        )
        .leftJoin(`${this.collectionsTable}`, function () {
          this.on(
            `${outerThis.collectionsTable}.id`,
            `=`,
            `${outerThis.collectionsPhotosTable}.collection_id`
          ).onIn(`${outerThis.collectionsTable}.author_id`, [id]);
        })
        .groupBy(`${this.photosTable}.id`)
        .where(`${this.usersTable}.nickname`, `like`, `%${author}%`);

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
    subtitle: string,
    id: string
  ): Promise<Array<Photo> | Photo | null> {
    try {
      const outerThis = this;
      const result = await this.getConnection()
        .select(
          `${this.photosTable}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.tagsTable}.tag) as tags`
          ),
          this.getConnection().raw(`${this.usersTable}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.collectionsTable}.title) as collections`
          )
        )
        .from(`${this.photosTable}`)
        .join(
          `${this.tagsTable}`,
          `${this.photosTable}.id `,
          `=`,
          `${this.tagsTable}.photo_id`
        )
        .join(
          `${this.usersTable}`,
          `${this.photosTable}.author`,
          `=`,
          `${this.usersTable}.id`
        )
        .leftJoin(
          `${this.collectionsPhotosTable}`,
          `${this.photosTable}.id`,
          `=`,
          `${this.collectionsPhotosTable}.photo_id`
        )
        .leftJoin(`${this.collectionsTable}`, function () {
          this.on(
            `${outerThis.collectionsTable}.id`,
            `=`,
            `${outerThis.collectionsPhotosTable}.collection_id`
          ).onIn(`${outerThis.collectionsTable}.author_id`, [id]);
        })
        .groupBy(`${this.photosTable}.id`)
        .where(`${this.photosTable}.subtitle`, `like`, `%${subtitle}%`);

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
    tag: string,
    id: string
  ): Promise<Array<Photo> | Photo | null> {
    try {
      const outerThis = this;
      const result = await this.getConnection()
        .select(
          `${this.photosTable}.*`,
          this.getConnection().raw(
            `GROUP_CONCAT(${this.tagsTable}.tag) as tags`
          ),
          this.getConnection().raw(`${this.usersTable}.nickname as author`),
          this.getConnection().raw(
            `GROUP_CONCAT(DISTINCT ${this.collectionsTable}.title) as collections`
          )
        )
        .from(`${this.tagsTable}`)
        .join(
          `${this.photosTable}`,
          `${this.tagsTable}.photo_id `,
          `=`,
          `${this.photosTable}.id`
        )
        .join(
          `${this.usersTable}`,
          `${this.photosTable}.author`,
          `=`,
          `${this.usersTable}.id`
        )
        .leftJoin(
          `${this.collectionsPhotosTable}`,
          `${this.photosTable}.id`,
          `=`,
          `${this.collectionsPhotosTable}.photo_id`
        )
        .leftJoin(`${this.collectionsTable}`, function () {
          this.on(
            `${outerThis.collectionsTable}.id`,
            `=`,
            `${outerThis.collectionsPhotosTable}.collection_id`
          ).onIn(`${outerThis.collectionsTable}.author_id`, [id]);
        })
        .groupBy(`${this.photosTable}.id`)
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
