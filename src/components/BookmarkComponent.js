import MapComponent from "./MapComponent.js";

export default class BookmarkComponent {
  constructor(container) {
    this.container = container;
  }

  async render(bookmarks) {
    if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
      this.container.innerHTML = "<p>Belum ada bookmark.</p>";
      return;
    }

    this.container.innerHTML = "";
    bookmarks.forEach((story) => {
      const article = document.createElement("article");
      article.className = "story-item";
      article.setAttribute("tabindex", "0");
      article.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" />
        <div class="story-texts">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <p>Tanggal: ${new Date(story.createdAt).toLocaleString()}</p>
          <p>Latitude: ${story.lat ?? '-'}</p>
          <p>Longitude: ${story.lon ?? '-'}</p>
          <div id="map-bookmark-${story.id}" class="map-list" style="height: 200px;"></div>
          <button class="btn-delete" data-id="${story.id}">Hapus Bookmark</button>
        </div>
      `;
      this.container.appendChild(article);
            const btnDelete = article.querySelector(".btn-delete");
      btnDelete.style.marginTop = "12px";

      if (story.lat !== undefined && story.lon !== undefined) {
        const map = new MapComponent(`map-bookmark-${story.id}`, {
          center: [story.lat, story.lon],
          zoom: 13,
        });
        map.addMarker(story.lat, story.lon, story.name);
      }
      
    });
  }

  bindDelete(callback) {
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        callback(id);
      }
    });
  }
}
