import dayjs from "dayjs";
import collectionDatabase, {
  CollectionDatabase,
} from "../data/CollectionDatabase";
import { BaseError } from "../error/BaseError";
import { Collection, PhotoCollectionInputDTO, PhotoCollectionUpdateInputDTO } from "../model/Collection";
import authenticator, { Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class CollectionBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private collectionDatabase: CollectionDatabase,
    private authenticator: Authenticator
  ) {}

  public async createCollection(
    collection: PhotoCollectionInputDTO,
    token: string
  ) {
    try {
      if (!collection.title || !collection.subtitle) {
        throw new BaseError(422, "Missing input");
      }

      const verifiedToken = this.authenticator.getData(token);

      const id = this.idGenerator.generate();

      var now = dayjs().format("YYYY-MM-DD HH:mm:ss");

      return await this.collectionDatabase.createPhotoCollection(
        new Collection(
          id,
          collection.title,
          collection.subtitle,
          verifiedToken.id,
          now,
          collection.image
        )
      );
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getCollections(token: string) {
    try {
      const verifiedToken = this.authenticator.getData(token);

      const collections = await this.collectionDatabase.getCollections(
        verifiedToken.id
      );

      return collections;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteCollection(token: string, collection_id: string) {
    try {
      const verifiedToken = this.authenticator.getData(token);

      await this.collectionDatabase.deleteCollection(collection_id);
      
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async updateCollection(token: string, collection_id: string, input: PhotoCollectionUpdateInputDTO) {
    try {
      if(!input.image && !input.subtitle && !input.title){
        throw new BaseError(422, "Nothing changed.");
      }
      const verifiedToken = this.authenticator.getData(token);

      await this.collectionDatabase.updateCollection(input, verifiedToken.id, collection_id);
      
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new CollectionBusiness(
  idGenerator,
  collectionDatabase,
  authenticator
);
