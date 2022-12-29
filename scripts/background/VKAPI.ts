import Axios from 'axios';
import { getUnixTime } from 'date-fns';
import browser from "webextension-polyfill";

async function getDefaultParams() {
  const token = (await browser.storage.local.get(["token"])).token ?? "";

  console.log(token, "token");

  return {
    v: "5.131",
    access_token: token,
  };
}

async function getGroupId() {
  const id = (await browser.storage.local.get(["groupId"])).groupId ?? "";
  return id;
}

export async function getWall() {
  const default_params = await getDefaultParams();
  const groupId = await getGroupId();

  let { data } = await Axios.get('https://api.vk.com/method/wall.get', {
    params: {
      ...default_params,
      owner_id: -groupId,
      count: 100,
      filter: "postponed",
    },
  });

  return data;
}

export async function getDelayedWallTimestamps() {
  const posts = (await getWall()).response.items;
  const dateNow = Date.now();

  let postTimes: number[] = posts
    .filter(p => p.date)
    .map(p => new Date(p.date * 1000).getTime())
    .filter(t => t > dateNow)
    .sort();

  return postTimes;
}

export async function getUploadServer() {
  const default_params = await getDefaultParams();
  let { data } = await Axios.get('https://api.vk.com/method/photos.getWallUploadServer', {
    params: {
      ...default_params,
      group_id: await getGroupId()
    },
  });

  return data;
}

export async function uploadPhoto(server: string, image: Blob, filename: string) {
  let file = new File([image], filename)
  let form_data = new FormData();
  form_data.append('photo', file, filename);

  console.log(form_data.get('photo'));

  let { data } = await Axios.post(server, form_data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}

export async function savePhoto(server, photo, hash) {
  const default_params = await getDefaultParams();
  let { data } = await Axios.get('https://api.vk.com/method/photos.saveWallPhoto', {
    params: {
      ...default_params,
      group_id: await getGroupId(),
      server, photo, hash,
    },
  });

  return data;
}

export async function addWallPost(message: string, attachments: string[], publishDate: Date, copyright: string) {
  const default_params = await getDefaultParams();
  const groupId = await getGroupId();
  console.log(publishDate);

  let { data } = await Axios.get('https://api.vk.com/method/wall.post', {
    params: {
      ...default_params,
      owner_id: -groupId,
      from_group: 1,
      message,
      attachments,
      publish_date: getUnixTime(publishDate),
      copyright,
    },
  });

  console.log(data);

  return data;
}
