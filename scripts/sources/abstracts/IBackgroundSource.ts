import {IBaseSource} from "./IBaseSource";

export interface IBackgroundSource extends IBaseSource {
  isUrlSecured(url: string): boolean;
}
