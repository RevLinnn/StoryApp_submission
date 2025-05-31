import { openDB } from 'idb';

export const BookmarkDB = {
  async getDB() {
    return openDB("bookmark-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("bookmarks")) {
          db.createObjectStore("bookmarks", { keyPath: "id" });
        }
      },
    });
  },

  async put(story) {
    const db = await this.getDB();
    return db.put("bookmarks", story);
  },

  async getAll() {
    const db = await this.getDB();
    return db.getAll("bookmarks");
  },

  async delete(id) {
    const db = await this.getDB();
    return db.delete("bookmarks", id);
  },
};
