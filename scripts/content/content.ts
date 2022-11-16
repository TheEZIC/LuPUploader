import {SourceManager} from "../sources/SourceManager";
import {IContentSource} from "../sources/abstracts/IContentSource";

function bootstrap() {
  const sourceManager = new SourceManager<IContentSource>();
  let oldHref = document.location.href;

  run();

  //observe URL changes in React or etc apps
  window.onload = function () {
    console.log("window loaded");
    const body = document.querySelector("body");
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (oldHref != window.location.href) {
          console.log("updated url", window.location.href);
          oldHref = window.location.href;
          run();
        }
      });
    });

    observer.observe(body, {
      childList: true,
      subtree: true,
    });
  };

  function run() {
    const source = sourceManager.findByUrl(window.location.href);
    console.log(source, "source");
    source?.run();
  }
}

bootstrap();
