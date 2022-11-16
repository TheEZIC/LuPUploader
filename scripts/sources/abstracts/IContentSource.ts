import {IBaseSource} from "./IBaseSource";

export interface IContentSource extends IBaseSource {
  run(): void;
}
