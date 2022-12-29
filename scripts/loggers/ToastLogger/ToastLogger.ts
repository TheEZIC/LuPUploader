import {sendTabsMessage} from "../../utils";

export default class ToastLogger {
  public static info(text: string) {
    this.sendLogMessage("info", text);
  }

  private static errorToString(error: Error): string {
    return `${error.name}: ${error.message}`;
    //return (error.stack?.split("\n") ?? [`${error.name}: ${error.message}`]).join("\n")
  }

  public static error(text: string | Error) {
    this.sendLogMessage("error", text instanceof Error ? this.errorToString(text) : text);
  }

  public static warning(text: string) {
    this.sendLogMessage("warning", text);
  }

  public static success(text: string) {
    this.sendLogMessage("success", text);
  }

  private static sendLogMessage(type: string, text: string) {
    sendTabsMessage({
      cmd: "toastLog",
      type,
      text,
    });
  }
}
