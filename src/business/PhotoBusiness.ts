import dayjs from "dayjs";
import photoDatabase, { PhotoDatabase } from "../data/PhotoDatabase";
import { BaseError } from "../error/BaseError";
import {
  Photo,
  PhotoToCollectionInputDTO,
  PhotoInputDTO,
  PhotoToCollectionOutputDTO,
  PhotoSearchInputDTO,
} from "../model/Photo";
import authenticator, { Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class PhotoBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private photoDatabase: PhotoDatabase,
    private authenticator: Authenticator
  ) {}

  public async createPhoto(photo: PhotoInputDTO, token: string) {
    if (!photo.subtitle || !photo.file || !photo.tags) {
      throw new BaseError(422, "Missing input");
    }

    const verifiedToken = this.authenticator.getData(token);

    const id = this.idGenerator.generate();

    var now = dayjs().format("YYYY-MM-DD HH:mm:ss");

    return await this.photoDatabase.createPhoto(
      new Photo(
        id,
        photo.subtitle,
        verifiedToken.id,
        now,
        photo.file,
        photo.tags,
        []
      )
    );
  }

  public async getAllPhotos(token: string) {
    

    const verifiedToken = this.authenticator.getData(token);

    const photos = await this.photoDatabase.getAllPhotos(verifiedToken.id);

    if (photos.length === 0) {
      throw new BaseError(404, "No photos created yet");
    }

    return photos;
  }

  public async getPhotoById(id: string, token: string) {


    const verifiedToken = this.authenticator.getData(token);

    const photo = await this.photoDatabase.getPhotoById(id, verifiedToken.id);

    if (photo === null) {
      throw new BaseError(404, "Photo not found");
    }

    return photo;
  }

  public async addPhotoToCollection(
    input: PhotoToCollectionInputDTO,
    token: string
  ) {
    if (!input.photo_id || !input.collection_id) {
      throw new BaseError(422, "Missing input");
    }

    const verifiedToken = this.authenticator.getData(token);

    const photo = await this.photoDatabase.getPhotoById(input.photo_id, verifiedToken.id);

    if (photo === null) {
      throw new BaseError(404, "Photo not found");
    }

    const alreadyAdded = await this.photoDatabase.checkPhotoInCollection(input);

    if (alreadyAdded) {
      throw new BaseError(404, "Photo is already added to collection");
    }

    var now = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const output: PhotoToCollectionOutputDTO = {
      photo_id: input.photo_id,
      collection_id: input.collection_id,
      date: now,
    };

    return await this.photoDatabase.addPhotoToCollection(output);
  }

  public async getPhotosInCollection(id: string, token: string) {
    const photos = await this.photoDatabase.getPhotosInCollection(id);

    const verifiedToken = this.authenticator.getData(token);

    if (photos === null) {
      throw new BaseError(404, "No photo was added to this collection yet.");
    }

    return photos;
  }

  public async getPhotoByCondition(input: PhotoSearchInputDTO, token: string) {
    if (
      input.author === undefined &&
      input.subtitle === undefined &&
      input.tag === undefined
    ) {
      throw new BaseError(422, "Missing input");
    }

    const verifiedToken = this.authenticator.getData(token);

    const photos = input.subtitle
      ? await this.photoDatabase.searchPhotoBySubtitle(input.subtitle, verifiedToken.id)
      : input.author
      ? await this.photoDatabase.searchPhotoByAuthor(input.author, verifiedToken.id)
      : input.tag
      ? await this.photoDatabase.searchPhotoByTag(input.tag, verifiedToken.id)
      : null;

    if (photos === null) {
      throw new BaseError(404, "Sorry! No photo was found.");
    }

    return photos;
  }
}

export default new PhotoBusiness(idGenerator, photoDatabase, authenticator);
