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
