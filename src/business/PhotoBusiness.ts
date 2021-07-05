import photoDatabase, { PhotoDatabase } from "../data/PhotoDatabase";
import { BaseError } from "../error/BaseError";
import { Photo, PhotoInputDTO } from "../model/Photo";
import authenticator, { Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class PhotoBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private photoDatabase: PhotoDatabase,
    private authenticator: Authenticator
  ) {}

  public async createPhoto(photo: PhotoInputDTO, token: string) {
    if (!photo.subtitle || !photo.file || !photo.tags || !photo.collection) {
      throw new BaseError(422, "Missing input");
    }

    const verifiedToken = this.authenticator.getData(token);

    const id = this.idGenerator.generate();

    return await this.photoDatabase.createPhoto(
      new Photo(
        id,
        photo.subtitle,
        verifiedToken.id,
        new Date(),
        photo.file,
        photo.tags,
        photo.collection
      )
    );
  }

  public async getAllPhotos(token:string){

    const photos = await this.photoDatabase.getAllPhotos();
    
    const verifiedToken = this.authenticator.getData(token);

    if(photos.length === 0){
      throw new BaseError(404, "No photos created yet");
    }

    return photos
  }

  
  public async getPhotoById(id: string, token:string){

    const photo = await this.photoDatabase.getPhotoById(id);

    
    
    const verifiedToken = this.authenticator.getData(token);

    if(!photo){
      throw new BaseError(404, "Photo not found");
    }

    return photo
  }
}

export default new PhotoBusiness(idGenerator, photoDatabase, authenticator);
