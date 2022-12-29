export type Time = `${number}:${number}`;

export interface ITimePeriod {
  from: Time;
  to: Time;
  every: Time;
}

export interface IConfig {
  token: string;
  groupId: number;
  timePeriods: ITimePeriod[];
}

const config: IConfig = {
  token: "",
  groupId: 123456789,
  timePeriods: [
    {
      from: "9:00",
      to: "23:00",
      every: "1:00",
    },
    {
      from: "00:00",
      to: "1:00",
      every: "1:00",
    }
  ],
}

export default config;
