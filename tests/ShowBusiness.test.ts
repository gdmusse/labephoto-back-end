import { ShowBusiness } from "../src/business/ShowBusiness";
import { ShowDatabase } from "../src/data/ShowDatabase";
import { ShowInputDTO, WeekDay } from "../src/model/Show";
import authenticatorMock from "./mocks/authenticatorMock";
import idGeneratorMock from "./mocks/idGeneratorMock";
import showDatabaseMock from "./mocks/ShowDatabaseMock";

const testShowBusiness = new ShowBusiness(
  idGeneratorMock,
  showDatabaseMock as ShowDatabase,
  authenticatorMock
);

describe("ShowBusiness", () => {
  describe("Add Show", () => {
    test("Should catch error if one input is empty", async () => {
      expect.assertions(2);

      const showMock: ShowInputDTO = {
        band_id: "",
        week_day: WeekDay.FRIDAY,
        start_time: 9,
        end_time: 10,
      };

      try {
        await testShowBusiness.addShow(showMock, "token_mock");
      } catch (error) {
        expect(error.statusCode).toBe(422);
        expect(error.message).toBe("Missing input");
      }
    });

    test("Should catch error if there's already a show at that time", async () => {
      expect.assertions(2);

      const showMock: ShowInputDTO = {
        band_id: "mock_id",
        week_day: WeekDay.FRIDAY,
        start_time: 9,
        end_time: 10,
      };

      try {
        await testShowBusiness.addShow(showMock, "token_mock");
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("No more shows can be added at this times");
      }
    });
  });
});
