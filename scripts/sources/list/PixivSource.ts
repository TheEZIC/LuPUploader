import Source from "../abstracts/Source";

export default class PixivSource extends Source {
  public isImagePage(url: string): boolean {
    const regexp = /https:\/\/www\.pixiv\.net\/(\D{2}\/)?artworks\/.+$/;
    return regexp.test(url);
  }

  public isUrlSecured(url: string): boolean {
    return url.startsWith("https://i.pximg.net/");
  }

  protected collectTags(): string[] {
    const tagElements = Array.from(document.querySelectorAll(".gtm-new-work-translate-tag-event-click"));
    return tagElements.map(t => t.innerHTML);
  }

  protected getImageUrl(): string {
    const img = document.querySelector(".gtm-expand-full-size-illust img");
    return img.getAttribute("src");
  }
}
