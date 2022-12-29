import browser from "webextension-polyfill";

async function listenInputChange(selector: string, key: string) {
  const elem = document.querySelector(selector) as HTMLInputElement;
  const prevValue = (await browser.storage.local.get([key]))[key] ?? "";
  elem.value = prevValue;

  elem.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    const value = input.value ?? "";
    let obj: any = {};
    obj[key] = value;

    browser.storage.local.set(obj);
  });
}

function bootstrap() {
  listenInputChange("#token-input", "token");
  listenInputChange("#group-id-input", "groupId");
}

bootstrap();
