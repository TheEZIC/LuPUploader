import {IBaseSource} from "./abstracts/IBaseSource";
import Source from "./abstracts/Source";
import DanboruSource from "./list/DanboruSource";
import PixivSource from "./list/PixivSource";

export class SourceManager<T extends IBaseSource> {
  private sources: Source[] = [
    new DanboruSource(),
    new PixivSource(),
  ];

  get all() {
    return this.sources;
  }

  public isUrlSupported(url: string): boolean {
    const source = this.findByUrl(url);
    return Boolean(source);
  }

  public findByUrl(url: string): T {
    return this.sources.find(s => s.isImagePage(url)) as unknown as T;
  }
}
