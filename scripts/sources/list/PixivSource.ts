import Source from "../abstracts/Source";

export default class PixivSource extends Source {
  public isImagePage(url: string): boolean {
    return url.startsWith("https://www.pixiv.net/en/artworks/");
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
