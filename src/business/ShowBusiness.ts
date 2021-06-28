import showDatabase, { ShowDatabase } from "../data/ShowDatabase";
import { BaseError } from "../error/BaseError";
import { Show, ShowInputDTO, WeekDay } from "../model/Show";
import authenticator, { Authenticator } from "../services/Authenticator";
import idGenerator, { IdGenerator } from "../services/IdGenerator";

export class ShowBusiness {
  constructor(
    private idGenerator: IdGenerator,
    private showDatabase: ShowDatabase,
    private authenticator: Authenticator
  ) {}

  public async addShow(show: ShowInputDTO, token: string) {
    try {
      const authorizedToken = this.authenticator.getData(token);
      if (authorizedToken.role !== "ADMIN") {
        throw new BaseError(401, "Unauthorized");
      }

      if (
        !show.band_id ||
        !show.end_time ||
        !show.start_time ||
        !show.week_day
      ) {
        throw new BaseError(422, "Missing input");
      }

      if (
        show.start_time < 8 ||
        show.start_time > 23 ||
        show.start_time >= show.end_time
      ) {
        throw new BaseError(422, "Invalid times to create show");
      }

      if (
        !Number.isInteger(show.start_time) ||
        !Number.isInteger(show.end_time)
      ) {
        throw new BaseError(422, "Times should be integer to add show");
      }

      const registeredShows = await this.showDatabase.getShowsByTimeAndDay(
        show.week_day,
        show.start_time,
        show.end_time
      );

      if (registeredShows.length > 0) {
        throw new BaseError(400, "No more shows can be added at this times");
      }

      const id = this.idGenerator.generate();

      return await this.showDatabase.addShow(
        new Show(
          id,
          Show.toWeekDayEnum(show.week_day),
          show.start_time,
          show.end_time,
          show.band_id
        )
      );
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw new BaseError(error.statusCode, error.message);
    }
  }

  public async getShowsByDay(week_day: WeekDay) {
    try {
      const shows = await showDatabase.getShowsByDay(week_day);

      if (shows.length === 0) {
        throw new BaseError(400, "No shows are happening this day");
      }

      return shows;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 400;
      }
      throw new BaseError(error.statusCode, error.message);
    }
  }
}

export default new ShowBusiness(idGenerator, showDatabase, authenticator);
