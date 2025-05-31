import IdbHelper from "../utils/idb-helper.js";

export default class StoryModel {
  constructor(getToken) {
    this.apiUrl = 'https://story-api.dicoding.dev/v1';
    this.getToken = getToken;
  }

async fetchStories() {
  try {
    const res = await fetch(`${this.apiUrl}/stories?location=1`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    const data = await res.json();
    if (data.error) throw new Error(data.message);

    await IdbHelper.clearStories();
    await IdbHelper.saveStories(data.listStory);

    return data.listStory;
  } catch (error) {
    console.warn("Gagal fetch online, ambil dari IndexedDB", error);
    const cachedStories = await IdbHelper.getStories();
    return cachedStories;
  }
}


  async fetchStoryById(id) {
    try {
      const res = await fetch(`${this.apiUrl}/stories/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      return data.story;
    } catch (error) {
      throw error;
    }
  }

  async addStory({ description, photoBlob, lat, lon }) {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photoBlob, 'photo.jpg');
      if (lat !== undefined) formData.append('lat', lat);
      if (lon !== undefined) formData.append('lon', lon);

      const res = await fetch(`${this.apiUrl}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.message);

            if (data.story) {
        await IdbHelper.saveStories([data.story]);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}