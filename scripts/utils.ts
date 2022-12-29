import browser from "webextension-polyfill";

export async function waitForSelector(selector, opts: any = {}): Promise<void> {
  opts.timeout ??= 5000;

  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)

    console.log(element, "element")

    if (element) {
      return resolve();
    }

    const mutObserver = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        const nodes = Array.from(mutation.addedNodes)
        console.log(nodes);
        for (const node of nodes) {
          // @ts-ignore
          if (node.matches && node.matches(selector)) {
            mutObserver.disconnect()
            resolve()
            return
          }
        }
      }
    });

    mutObserver.observe(document.documentElement, { childList: true, subtree: true });

    if (opts.timeout) {
      setTimeout(() => {
        mutObserver.disconnect()
        if (opts.optional) {
          resolve();
        } else {
          reject(new Error(`Timeout exceeded while waiting for selector ("${selector}").`))
        }
      }, opts.timeout)
    }
  })
}

function onMessageCb(response, resolve, reject) {
  const err1 = new Error('Callstack before sendMessage:');
  let err2 = browser.runtime.lastError;

  if (!err2 || err2.message.startsWith('The message port closed before')) {
    console.log(response);
    resolve(response);
  } else {
    err2 = new Error(err2.message);
    //@ts-ignore
    err2.stack += err1.stack.replace(/^Error:\s*/, '');
    console.error(err2.message);
    reject(err2);
  }
}

export function sendTabsMessage<T = any>(message): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    browser.tabs.query({active: true, lastFocusedWindow: true}).then(([tab]) => {
      if (tab) {
        browser.tabs.sendMessage(tab.id, message)
          .then((response) => onMessageCb(response, resolve, reject));
      } else {
        reject();
      }
    });
  });
}

export function sendRuntimeMessage<T = any>(message): Promise<T> {
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage(null, message)
      .then((response) => onMessageCb(response, resolve, reject));
  });
}
