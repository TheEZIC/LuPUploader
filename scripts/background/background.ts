import {UploadCommands, UploadCommandsType} from "../commands/UploadCommands";

chrome.runtime.onMessage.addListener((req: UploadCommands, sender, sendResponse) => {
  const {cmd, payload} = req;

  switch (cmd) {
    case UploadCommandsType.Req: {
      console.log(payload, "uploading image")
      //...
      break;
    }
  }
});
