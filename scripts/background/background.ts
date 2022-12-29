import {UploadCommands, UploadCommandsType} from "../commands/UploadCommands";
import Axios from 'axios';
import {addWallPost, getUploadServer, getWall, savePhoto, uploadPhoto} from './VKAPI';
import CookiesSubstitute from "./CookiesSubstitute";
import PostsScheduler from "./PostsScheduler";
import {ITag, TagType} from "../sources/abstracts/ISourceData";
import browser from "webextension-polyfill";
import ToastLogger from "../loggers/ToastLogger/ToastLogger";

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
      ToastLogger.info("Начинаю публикацию");

      let wall;

      try {
        wall = await getWall();
        console.log(await getWall(), wall, "wall");
      } catch {
        ToastLogger.error("Ошибка во время получения ВК стены");
      }

      let upload_server;

      try {
        upload_server = (await getUploadServer()).response;
        console.log(upload_server, "server");
      } catch {
        ToastLogger.error("Ошибка во время получения сервера ВК картинок");
      }

      const cookiesSubstitute = new CookiesSubstitute(payload.cookie, payload.origin);
      cookiesSubstitute.start();

      let attachments: string[] = [];

      for (let imageUrl of payload.imageUrls) {
        let { data: image } = await Axios.get(imageUrl, {
          responseType: "blob",
        });

        let uploaded_photo

        try {
          uploaded_photo = await uploadPhoto(upload_server.upload_url, image, `image.${imageUrl.split('.').pop()}`);
          console.log(uploaded_photo, "uploaded photo");
        } catch {
          ToastLogger.error("Ошибка во время загрузки фото");
        }

        let saved_photo;

        try {
          saved_photo = (await savePhoto(uploaded_photo.server, uploaded_photo.photo, uploaded_photo.hash)).response[0];
          console.log(saved_photo, "saved photo");
        } catch {
          ToastLogger.error("Ошибка во время загрузки фото на сервера ВК");
        }

        attachments.push(`photo${saved_photo.owner_id}_${saved_photo.id}`);
      }

      cookiesSubstitute.close();

      let date: Date;

      try {
        let timeSlot = await PostsScheduler.getAvailableTimeSlot()
        date = new Date(timeSlot);
      } catch {
        ToastLogger.error("Ошибка во время получения тайм слота");
      }

      const sourceTags = getTagsStringByType(TagType.Source, payload.tags);
      const characterTags = getTagsStringByType(TagType.Character, payload.tags);
      const generalTags = getTagsStringByType(TagType.General, payload.tags);

      const tagsString = `${sourceTags} ${characterTags} ${generalTags}`.trim();

      const tags = `
(#anime@lupublic) (#аниме@lupublic) (#art@lupublic)
${tagsString}
      `;

      try {
        let wall_post = (await addWallPost(
          tags,
          attachments,
          date,
          payload.copyright
        )).response;

        console.log(wall_post);

        if (wall_post.error) {
          ToastLogger.error("Ошибка во время публикации поста " + JSON.stringify(wall_post.error));
        }
      } catch {
        ToastLogger.error("Ошибка во время публикации поста");
      }

      ToastLogger.success(`
        Пост успешно опубликован на:
        ${date.toLocaleString()}
      `);

      break;
    }
  }
});
