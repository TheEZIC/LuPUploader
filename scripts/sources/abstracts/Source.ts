import {IBaseSource} from "./IBaseSource";
import {IContentSource} from "./IContentSource";
import {IBackgroundSource} from "./IBackgroundSource";
import {IPopupSource} from "./IPupupSource";
import {IReqUploadCommand, UploadCommandsType} from "../../commands/UploadCommands";

export default abstract class Source implements IBaseSource, IContentSource, IBackgroundSource, IPopupSource {
  /*
   * Check is page contains image to upload or not
   */
  public abstract isImagePage(url: string): boolean;

  /*
   * Collect image tags
   */
  protected abstract collectTags(): string[];

  /*
   * Get url of the image
   */
  protected abstract getImageUrl(): string;

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
   * Send a message to background to upload image to vk community
   */
  private upload() {
    const imageUrl = this.getImageUrl();
    const tags = this.collectTags();
    const payload = {
      tags,
      imageUrl,
    };

    const command: IReqUploadCommand = {
      cmd: UploadCommandsType.Req,
      payload,
    };

    console.log(payload);

    chrome.runtime.sendMessage(command);
  }

  /*
   * Execute source on page
   */
  public async run(): Promise<void> {
    const btn = await this.addButton();
    btn.addEventListener("click", () => this.upload());
  }
}
