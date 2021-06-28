import bandDatabase, { BandDatabase } from "../data/BandDatabase";
import { BaseError } from "../error/BaseError";
import { Band, BandInputDTO } from "../model/Band";
import authenticator, { Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class BandBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private bandDatabase: BandDatabase,
    private authenticator: Authenticator
  ) {}

  public async createBand(band: BandInputDTO, token: string) {
    try {
      if (!band.name || !band.music_genre || !band.responsible) {
        throw new BaseError(422, "Missing input");
      }

      const authorizedToken = this.authenticator.getData(token);

      if (authorizedToken.role !== "ADMIN") {
        throw new BaseError(401, "Unauthorized");
      }

      const id = this.idGenerator.generate();

      return await this.bandDatabase.createBand(
        new Band(id, band.name, band.music_genre, band.responsible)
      );
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw new BaseError(error.statusCode, error.message);
    }
  }

  public async getBandById(id: string) {
    try {
      if (!id) {
        throw new BaseError(422, "Missing input");
      }

      const bandFromDb = await this.bandDatabase.getBandById(id);
      if (!bandFromDb) {
        throw new BaseError(404, "Band not found");
      }
      return bandFromDb;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw new BaseError(error.statusCode, error.message);
    }
  }
  public async getBandByName(name: string) {
    try {
      if (!name) {
        throw new BaseError(422, "Missing input");
      }

      const bandFromDb = await this.bandDatabase.getBandByName(name);

      if (!bandFromDb) {
        throw new BaseError(404, "Band not found");
      }
      return bandFromDb;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw new BaseError(error.statusCode, error.message);
    }
  }
}
export default new BandBusiness(idGenerator, bandDatabase, authenticator);
