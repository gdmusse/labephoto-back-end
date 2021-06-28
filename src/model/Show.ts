import { BaseError } from "../error/BaseError";

export class Show {
  constructor(
    private id: string,
    private week_day: WeekDay,
    private start_time: number,
    private end_time: number,
    private band_id: string
  ) {}

  getId() {
    return this.id;
  }

  getWeekDay() {
    return this.week_day;
  }

  getStartTime() {
    return this.start_time;
  }

  getEndTime() {
    return this.end_time;
  }

  getBandId() {
    return this.band_id;
  }

  setId(id: string) {
    this.id = id;
  }

  setWeekDay(week_day: WeekDay) {
    this.week_day = week_day;
  }

  setStartTime(start_time: number) {
    this.start_time = start_time;
  }

  setEndTime(end_time: number) {
    this.end_time = end_time;
  }

  setBandId(band_id: string) {
    this.band_id = band_id;
  }

  public static toWeekDayEnum(data?: any): WeekDay {
    switch (data) {
      case "Friday":
        return WeekDay.FRIDAY;
      case "Saturday":
        return WeekDay.SATURDAY;
      case "Sunday":
        return WeekDay.SUNDAY;
      default:
        throw new BaseError(422, "Invalid day");
    }
  }
}

export interface ShowInputDTO {
  band_id: string;
  week_day: WeekDay;
  start_time: number;
  end_time: number;
}

export interface ShowOutputDTO {
  start_time: number;
  end_time: number;
  name: string;
  music_genre: string;
}

export enum WeekDay {
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}
