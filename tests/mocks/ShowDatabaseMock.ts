import { Show, ShowOutputDTO, WeekDay } from "../../src/model/Show";

export class ShowDatabase {
  public async addShow(show: Show): Promise<void | string> {
    if (show) {
      return "Show registered successfully!";
    }
  }

  public async getShowsByTimeAndDay( week_day: WeekDay,
    start_time: number,
    end_time: number): Promise<Array<Show>| void> {



      const show_mock = new Show("show.id",WeekDay.FRIDAY, 8,10,"show.band_id")
      const shows_mock: Array<Show> = [show_mock]

      return  shows_mock
    
  }
}

export default new ShowDatabase();
