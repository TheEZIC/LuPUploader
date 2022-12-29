import {UploadCommands, UploadCommandsType} from "../commands/UploadCommands";
import Axios from 'axios';
import {addWallPost, getUploadServer, getWall, savePhoto, uploadPhoto} from './VKAPI';
import CookiesSubstitute from "./CookiesSubstitute";
import PostsScheduler from "./PostsScheduler";
import {ITag, TagType} from "../sources/abstracts/ISourceData";
import browser from "webextension-polyfill";

function getTagsStringByType(type: TagType, tags: ITag[]): string {
  const tagsByType = tags.find(t => t.type === type);
  return (tagsByType ? tagsByType.list : []).join(" ");
}

//@ts-ignore
browser.runtime.onMessage.addListener(async (req: UploadCommands, sender, sendResponse) => {
  const {cmd, payload} = req;

  switch (cmd) {
    case UploadCommandsType.Req: {
      console.log(payload, "uploading image")
      let wall = await getWall();
      console.log(await getWall(), wall, "wall");

      let upload_server = (await getUploadServer()).response;
      console.log(upload_server, "server");

      const cookiesSubstitute = new CookiesSubstitute(payload.cookie, payload.origin);
      cookiesSubstitute.start();

      let attachments: string[] = [];

      for (let imageUrl of payload.imageUrls) {
        let { data: image } = await Axios.get(imageUrl, {
          responseType: "blob",
        });

        let uploaded_photo = await uploadPhoto(upload_server.upload_url, image, `image.${imageUrl.split('.').pop()}`);
        console.log(uploaded_photo, "uploaded photo");

        let saved_photo = (await savePhoto(uploaded_photo.server, uploaded_photo.photo, uploaded_photo.hash)).response[0];
        console.log(saved_photo, "saved photo");
        attachments.push(`photo${saved_photo.owner_id}_${saved_photo.id}`);
      }

      cookiesSubstitute.close();

      let timeSlot = await PostsScheduler.getAvailableTimeSlot()
      let date = new Date(timeSlot);
      console.log(timeSlot, date);

      const sourceTags = getTagsStringByType(TagType.Source, payload.tags);
      const characterTags = getTagsStringByType(TagType.Character, payload.tags);
      const generalTags = getTagsStringByType(TagType.General, payload.tags);

      const tagsString = `${sourceTags} ${characterTags} ${generalTags}`.trim();

      const tags = `
(#anime@lupublic) (#аниме@lupublic) (#art@lupublic)
${tagsString}
      `;

      let wall_post = (await addWallPost(
        tags,
        attachments,
        date,
        payload.copyright
      )).response;
      console.log(wall_post);

      break;
    }
  }
});
