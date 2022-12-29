import Source from "../abstracts/Source";
import {ITag, TagType} from "../abstracts/ISourceData";

export default class DanboruSource extends Source {
  public isImagePage(url: string): boolean {
    const regexp = /https:\/\/danbooru\.donmai\.us\/posts\/\d+(\?.+)?$/;
    return regexp.test(url);
  }

  private parseTagGroup(selector: string): string[] {
    return Array.from(document.querySelectorAll(selector)).map(t => t.innerHTML.trim());
  }

  protected collectTags(): ITag[] {
    const sourceTags = this.parseTagGroup("ul.copyright-tag-list li .search-tag");
    const characterTags = this.parseTagGroup("ul.character-tag-list li .search-tag");

    return [
      {
        type: TagType.Source,
        list: sourceTags,
      },
      {
        type: TagType.Character,
        list: characterTags,
      }
    ];
  }

  protected getImageUrls(): string[] {
    const img = document.querySelector(".image-container img");
    const src = img.getAttribute("src");

    return [src];
  }
}
