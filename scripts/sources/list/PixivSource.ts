import Source from "../abstracts/Source";
import {ITag, TagType} from "../abstracts/ISourceData";

export default class PixivSource extends Source {
  public isImagePage(url: string): boolean {
    const regexp = /https:\/\/www\.pixiv\.net\/(\D{2}\/)?artworks\/.+$/;
    return regexp.test(url);
  }

  public isUrlSecured(url: string): boolean {
    return url.startsWith("https://i.pximg.net/");
  }

  protected collectTags(): ITag[] {
    const tagElements = Array.from(document.querySelectorAll(".gtm-new-work-translate-tag-event-click"))
      .map(t => t.innerHTML);

    return [
      {
        type: TagType.General,
        list: tagElements
      },
    ];
  }

  protected getImageUrls(): string[] {
    const imgs = Array.from(document.querySelectorAll("div[role='presentation'] img"));
    return imgs.map(img => img.getAttribute("src"));
  }
}
