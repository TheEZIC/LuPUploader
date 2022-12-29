import PostsScheduler from "./PostsScheduler";
import moment from "moment";

describe("Test PostsScheduler", () => {
  test("PostsScheduler:getAvailableTimePeriods", () => {
    const scheduler: any = new PostsScheduler();
    const result = scheduler.getAvailableTimePeriods([{
      from: "9:00",
      to: "13:00",
      every: "1:00",
    }]);

    expect(result.length).toBe(5);
  });

  test("PostsScheduler:getAvailableTimePeriods", () => {
    const scheduler: any = new PostsScheduler();
    const periods = scheduler.getAvailableTimePeriods([{
      from: "9:00",
      to: "13:00",
      every: "1:00",
    }]);
    const result = scheduler.convertPeriodsStampsToTime(periods);

    expect(result).toMatchObject(["09:00", "10:00", "11:00", "12:00", "13:00"]);
  });

  test("PostsSchedules:getPostTimeSlots", () => {
    const periods = (PostsScheduler as any).getPostTimeSlots([{
      from: "9:00",
      to: "13:00",
      every: "1:00",
    }]);

    expect(periods).toMatchObject([
      [9, 0],
      [10, 0],
      [11, 0],
      [12, 0],
      [13, 0],
    ]);
  });

  test("PostsScheduler:findClosestTime", () => {
    const scheduler: any = new PostsScheduler();
    const time = scheduler.findClosestTime(["13:00", "14:00", "15:00", "16:00", "17:00"], 1672228471865);
    const result = moment(time).format("HH:mm");

    expect(result).toBe("15:00");
  });
});
