import {IBaseSource} from "./IBaseSource";
import {IContentSource} from "./IContentSource";
import {IBackgroundSource} from "./IBackgroundSource";
import {IPopupSource} from "./IPupupSource";
import {IReqUploadCommand, UploadCommandsType} from "../../commands/UploadCommands";
import {ISourceData, ITag} from "./ISourceData";
import browser from "webextension-polyfill";

export default abstract class Source implements IBaseSource, IContentSource, IBackgroundSource, IPopupSource {
  /*
   * Check is page contains image to upload or not
   */
  public abstract isImagePage(url: string): boolean;

  /*
   * Collect image tags
   */
  protected abstract collectTags(): ITag[];

  /*
   * Get url of the image
   */
  protected abstract getImageUrls(): string[];

  /*
  * Add button to page which upload image to vk community
  */
  private addButton(): HTMLElement {
    const container = document.querySelector("body");
    const button = document.createElement("div");
    button.classList.add("lup-btn");

    container.append(button);
    return button;
  }

  /*
   * Check is url secured or not
   */
  public isUrlSecured(url: string): boolean {
    return false;
  }

  /*
   * Send a message to background to upload image to vk community
   */
  private upload() {
    const imageUrls = this.getImageUrls();
    const tags = this.formatTags(this.collectTags());

    const payload: ISourceData = {
      tags,
      imageUrls,
      copyright: window.location.href,
      cookie: document.cookie,
      origin: window.location.origin,
    };

    const command: IReqUploadCommand = {
      cmd: UploadCommandsType.Req,
      payload,
    };

    console.log(payload);

    browser.runtime.sendMessage(command);
  }

  private formatTags(tags: ITag[]): ITag[] {
    return tags.map(t => {
      const list = t.list.map(li => {
        const trimed = li
          .replace(/ /gm, "_")
          .replace(/\W+/gm, "");

        return `(#${trimed})`;
      });

      return {...t, list};
    });
  }

  /*
   * Execute source on page
   */
  public run(): void {
    const btn = this.addButton();
    btn.addEventListener("click", () => this.upload());
  }
}
