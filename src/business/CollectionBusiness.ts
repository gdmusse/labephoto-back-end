import dayjs from "dayjs";
import collectionDatabase, {
  CollectionDatabase,
} from "../data/CollectionDatabase";
import { BaseError } from "../error/BaseError";
import { Collection, PhotoCollectionInputDTO } from "../model/Collection";
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
}

export default new CollectionBusiness(
  idGenerator,
  collectionDatabase,
  authenticator
);
