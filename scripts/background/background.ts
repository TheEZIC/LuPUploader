import { UploadCommands, UploadCommandsType } from "../commands/UploadCommands";
import Axios from 'axios';
import {addWallPost, getUploadServer, getWall, savePhoto, uploadPhoto} from './VKAPI';
import CookiesSubstitute from "./CookiesSubstitute";
import PostsScheduler from "./PostsScheduler";

chrome.runtime.onMessage.addListener(async (req: UploadCommands, sender, sendResponse) => {
  const {cmd, payload} = req;

  switch (cmd) {
    case UploadCommandsType.Req: {
      console.log(payload, "uploading image")
      let wall = await getWall();

      const cookiesSubstitute = new CookiesSubstitute(payload.cookie, payload.origin);
      cookiesSubstitute.start();

      let { data: image } = await Axios.get(payload.imageUrl, {
        responseType: "blob",
      });

      cookiesSubstitute.close();
      console.log(image);

      console.log(await getWall(), wall);

      let upload_server = (await getUploadServer()).response;
      console.log(upload_server, "server");

      let uploaded_photo = await uploadPhoto(upload_server.upload_url, image, `image.${payload.imageUrl.split('.').pop()}`);
      console.log(uploaded_photo, "upload photo");

      let saved_photo = (await savePhoto(uploaded_photo.server, uploaded_photo.photo, uploaded_photo.hash)).response[0];
      console.log(saved_photo, "saved photo");

      let timeSlot = await PostsScheduler.getAvailableTimeSlot()
      let date = new Date(timeSlot);
      console.log(timeSlot, date);

      const tags = `
(#anime@lupublic) (#аниме@lupublic) (#art@lupublic)
${payload.tags.join(" ")}
      `;

      let wall_post = (await addWallPost(
        tags,
        `photo${saved_photo.owner_id}_${saved_photo.id}`,
        date,
        payload.copyright
      )).response;
      console.log(wall_post);

      break;
    }
  }
});
