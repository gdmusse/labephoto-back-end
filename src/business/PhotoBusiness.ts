import dayjs from "dayjs";
import photoDatabase, { PhotoDatabase } from "../data/PhotoDatabase";
import { BaseError } from "../error/BaseError";
import {
  Photo,
  PhotoToCollectionInputDTO,
  PhotoInputDTO,
  PhotoToCollectionOutputDTO,
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
        ""
      )
    );
  }

  public async getAllPhotos(token: string) {
    const photos = await this.photoDatabase.getAllPhotos();

    const verifiedToken = this.authenticator.getData(token);

    if (photos.length === 0) {
      throw new BaseError(404, "No photos created yet");
    }

    return photos;
  }

  public async getPhotoById(id: string, token: string) {
    const photo = await this.photoDatabase.getPhotoById(id);

    const verifiedToken = this.authenticator.getData(token);

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

    const photo = await this.photoDatabase.getPhotoById(input.photo_id);

    if (photo === null) {
      throw new BaseError(404, "Photo not found");
    }

    const alreadyAdded = await this.photoDatabase.checkPhotoInCollection(input)

    if(alreadyAdded){
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
}

export default new PhotoBusiness(idGenerator, photoDatabase, authenticator);
