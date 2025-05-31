import MapComponent from "./MapComponent.js";
import { BookmarkDB } from "../utils/idb.js";

export default class StoryListComponent {
  constructor(container, stories) {
    this.container = container;
    this.stories = stories;
  }

  render() {
    if (!Array.isArray(this.stories) || this.stories.length === 0) {
      this.container.innerHTML = "<p>Belum ada story untuk ditampilkan.</p>";
      return;
    }

    this.container.innerHTML = "";
    this.stories.forEach((story) => {
      const article = document.createElement("article");
      article.className = "story-item";
      article.setAttribute("tabindex", "0");
      article.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" />
        <div class="story-texts">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <p>Tanggal: ${new Date(story.createdAt).toLocaleString()}</p>
          <p>Latitude: ${story.lat}</p>
          <p>Longitude: ${story.lon}</p>
          <div id="map-list-${story.id}" class="map-list"></div>
          <button class="btn-bookmark" data-id="${story.id}" aria-label="Tambahkan ke bookmark">
          Bookmark
    </button>
        </div>
      `;
      this.container.appendChild(article);

      if (story.lat !== undefined && story.lon !== undefined) {
        const map = new MapComponent(`map-list-${story.id}`, {
          center: [story.lat, story.lon],
          zoom: 13,
        });
        map.addMarker(story.lat, story.lon, story.name);
      }

      const btnBookmark = article.querySelector(".btn-bookmark");
      btnBookmark.style.marginTop = "12px";

      article.querySelector(".btn-bookmark").addEventListener("click", async () => {
        try {
          await BookmarkDB.put(story);
          alert(`"${story.name}" ditambahkan ke bookmark.`);
        } catch (err) {
          alert("Gagal menambahkan ke bookmark: " + err.message);
        }
      });
    });
  }
}
