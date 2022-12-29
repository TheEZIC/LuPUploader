import toastr from "toastr";
import browser from "webextension-polyfill";

export class ToastLoggerFrontend {
  private static isInited = false;

  private static info(text: string) {
    toastr.info(text);
  }

  private static error(text: string) {
    toastr.error(text);
  }

  private static warning(text: string) {
    toastr.warning(text);
  }

  private static success(text: string) {
    toastr.success(text);
  }

  public static listenLogMessages() {
    if (this.isInited) {
      return;
    }

    console.log("listening log messages");
    toastr.options.positionClass = 'toast-bottom-left';
    browser.runtime.onMessage.addListener(async (req, sender) => {
      const {cmd} = req;
      if (cmd !== "toastLog") return;

      const {text, type} = req;

      switch (type) {
        case "info": {
          this.info(text);
          break;
        }
        case "error": {
          this.error(text);
          break;
        }
        case "warning": {
          this.warning(text);
          break;
        }
        case "success": {
          this.success(text);
          break;
        }
      }
    });

    this.isInited = true;
  }
}
