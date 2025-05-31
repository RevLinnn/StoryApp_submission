import BookmarkComponent from "../components/BookmarkComponent.js";
import { BookmarkDB } from "../utils/idb.js";

export default class BookmarkPresenter {
  constructor(container) {
    this.view = new BookmarkComponent(container);
  }

  async showBookmarks() {
    const bookmarks = await BookmarkDB.getAll();
    this.view.render(bookmarks);
    this.view.bindDelete(this.handleDelete.bind(this));
  }

  async handleDelete(id) {
    await BookmarkDB.delete(id);
    this.showBookmarks();
  }

  async addBookmark(story) {
    await BookmarkDB.put(story);
    alert("Story telah disimpan ke Bookmark!");
  }
}
