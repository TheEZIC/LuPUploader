import { IBackgroundSource } from "../sources/abstracts/IBackgroundSource";
import { SourceManager } from "../sources/SourceManager";
import WebRequestHeadersDetails = chrome.webRequest.WebRequestHeadersDetails;

export default class CookiesSubstitute {
  constructor(
    private cookiesString: string,
    private origin: string,
  ) {
  }

  public async start() {
    chrome.webRequest.onBeforeSendHeaders.addListener(this.listenerDelegate,{
      urls: ["<all_urls>"]
    },[
      "blocking",
      "extraHeaders",
      "requestHeaders"
    ]);
  }

  public async close() {
    chrome.webRequest.onBeforeSendHeaders.removeListener(this.listenerDelegate);
  }

  private listenerCallback(d: WebRequestHeadersDetails) {
    const isSecured = this.isAvailable(d.url);

    console.log(isSecured, d.url , "is secured");

    if (!isSecured) {
      return {};
    }

    if (!d.requestHeaders)
      return {};

    this.addToHeaders(d, "Cookie", this.cookiesString);
    this.addToHeaders(d, "Referer", this.origin + "/");

    return {requestHeaders: d.requestHeaders};
  }

  private listenerDelegate = this.listenerCallback.bind(this);

  private addToHeaders(d: WebRequestHeadersDetails, key: string, value: string) {
    const item = d.requestHeaders.find(d => d.name.toLowerCase() === key.toLowerCase());

    if (!item) {
      d.requestHeaders.push({
        name: key,
        value,
      });
    } else {
      for (let header of d.requestHeaders) {
        if (header.name.toLowerCase() === key.toLowerCase()) {
          header.value = value;
          break;
        }
      }
    }
  }

  private isAvailable(url: string): boolean {
    const sourceManager = new SourceManager<IBackgroundSource>();

    for (let src of sourceManager.all) {
      if (src.isUrlSecured(url)) {
        return true;
      }
    }

    return false;
  }
}