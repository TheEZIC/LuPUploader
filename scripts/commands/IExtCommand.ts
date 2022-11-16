export interface IExtCommand {
  cmd: string;
}

export interface IExtPayloadCommand extends IExtCommand {
  payload: any;
}
