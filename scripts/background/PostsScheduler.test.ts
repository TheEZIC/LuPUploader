import PostsScheduler from "./PostsScheduler";
import moment from "moment";

describe("Test PostsScheduler", () => {
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
});
