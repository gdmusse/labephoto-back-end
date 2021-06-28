import { Show, ShowOutputDTO, WeekDay } from "../model/Show";
import { BaseDatabase } from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {
  protected tableName: string = "lama_shows";
  protected secondTableName: string = "lama_bands";

  public async addShow(show: Show): Promise<void> {
    try {
      await this.getConnection().insert(show).into(this.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getShowsByTimeAndDay(
    week_day: WeekDay,
    start_time: number,
    end_time: number
  ): Promise<Array<Show>> {
    const shows = await this.getConnection().raw(`
      SELECT *
      FROM ${this.tableName}
      WHERE week_day = "${week_day}"
      AND  start_time < "${end_time}"
      AND  end_time >= "${start_time}"
      ORDER BY start_time ASC
    `);
    return shows[0].map((show: any) => {
      return {
        id: show.id,
        band_id: show.band_id,
        week_day: show.week_day,
        start_time: show.start_time,
        end_time: show.end_time,
      };
    });
  }

  public async getShowsByDay(week_day: WeekDay): Promise<Array<ShowOutputDTO>> {
    const shows = await this.getConnection().raw(`
      SELECT ${this.tableName}.start_time, ${this.tableName}.end_time, ${this.secondTableName}.name, ${this.secondTableName}.music_genre
      FROM ${this.tableName}
      JOIN ${this.secondTableName} ON ${this.tableName}.band_id = ${this.secondTableName}.id
      WHERE week_day = "${week_day}"
      ORDER BY start_time ASC
    `);
    return shows[0].map((show: any) => {
      return {
        start_time: show.start_time,
        end_time: show.end_time,
        name: show.name,
        music_genre: show.music_genre,
      };
    });
  }
}

export default new ShowDatabase();
