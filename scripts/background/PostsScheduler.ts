import moment from "moment";
import {getDelayedWallTimestamps} from "./VKAPI";
import config, {ITimePeriod} from "../config";

export default class PostsScheduler {
  private static findClosestSlotByTime(postTimes: number[], hours: number, minutes: number): number {
    let currentDate = moment(Date.now());

    let date = currentDate.clone().set({
      hours, minutes,
      seconds: 0,
      milliseconds: 0,
    });

    while(true) {
      if(currentDate.isAfter(date) || postTimes.includes(date.clone().toDate().getTime())) {
        date.add({ day: 1 });
        continue;
      }

      return date.toDate().getTime();
    }
  }

  private static getPostTimeSlots(periods: ITimePeriod[]): [number, number][] {
    const timeslots: [number, number][] = [];

    for(let period of periods) {
      const {from, to, every} = period;

      let currentTime = moment(from, "HH:mm");
      let endTime = moment(to, "HH:mm");

      let [hours, minutes] = every.split(":").map(p => Number(p));

      do {
        let time = currentTime.clone().format("HH:mm");
        const [h, m] = time.split(":").map(p => Number(p));

        if(timeslots.findIndex(slot => slot[0] == h && slot[1] == m) === -1)
          timeslots.push([h, m]);

        currentTime.add({hours, minutes});
      } while(currentTime.isSameOrBefore(endTime));
    }

    return timeslots;
  }

  public static async getAvailableTimeSlot(): Promise<number> {
    const postTimes = await getDelayedWallTimestamps();
    const timeslots = PostsScheduler.getPostTimeSlots(config.timePeriods);
    const closestAvailable = Math.min(...timeslots.map(
      slot => PostsScheduler.findClosestSlotByTime(postTimes, ...slot)
    ));

    return closestAvailable;
  }
}
