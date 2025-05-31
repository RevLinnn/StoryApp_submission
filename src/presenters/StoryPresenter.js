import StoryListComponent from "../components/StoryListComponent.js";
import AddStoryComponent from "../components/AddStoryComponent.js";

export default class StoryPresenter {
  constructor(container, model, bookmarkPresenter) {
    this.container = container;
    this.model = model;
    this.bookmarkPresenter = bookmarkPresenter;
  }

  async route(page) {
    switch (page) {
      case "stories":
        await this.showStoriesPage();
        break;
      case "add-story":
        this.showAddStoryPage();
        break;
      default:
        this.showNotFound();
        break;
    }
  }

  async showStoriesPage() {
    try {
      const stories = await this.model.fetchStories();

      const listComponent = new StoryListComponent(this.container, stories, {
        onBookmark: (story) => this.bookmarkPresenter.addBookmark(story),
      });

      listComponent.render();
    } catch (error) {
      this.container.innerHTML = `<p>Gagal memuat cerita: ${error.message}</p>`;
    }
  }

showAddStoryPage() {
  const addStoryComponent = new AddStoryComponent(this.container, async (formData) => {
    await this.addStory(formData);
  });

  addStoryComponent.render();
}


  async addStory(data) {
    try {
      await this.model.addStory(data);
      alert("Cerita berhasil ditambahkan!");
      window.location.hash = "#/stories";
    } catch (error) {
      alert("Gagal menambahkan cerita: " + error.message);
    }
  }

  showNotFound() {
    this.container.innerHTML = "<p>Halaman tidak ditemukan.</p>";
  }
}
