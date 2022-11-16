import Source from "../abstracts/Source";

export default class DanboruSource extends Source {
  public isImagePage(url: string): boolean {
    const regexp = /https:\/\/danbooru\.donmai\.us\/posts\/\d+(\?.+)?$/;
    return regexp.test(url);
  }

  private parseTagGroup(selector: string): string[] {
    return Array.from(document.querySelectorAll(selector)).map(t => t.innerHTML.trim());
  }

  protected collectTags(): string[] {
    return [
      ...this.parseTagGroup("ul.character-tag-list li .search-tag"),
      ...this.parseTagGroup("ul.general-tag-list li .search-tag"),
    ];
  }

  protected getImageUrl(): string {
    const img = document.querySelector(".image-container img");
    return img.getAttribute("src")
  }
}
