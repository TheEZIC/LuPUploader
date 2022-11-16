import {IExtPayloadCommand} from "./IExtCommand";
import {ISourceData} from "../sources/abstracts/ISourceData";

export enum UploadCommandsType {
  Req = "reqUpload",
  Res = "resUpload",
}

export interface IReqUploadCommand extends IExtPayloadCommand {
  cmd: UploadCommandsType.Req;
  payload: ISourceData;
}

export type UploadCommands = IReqUploadCommand;
