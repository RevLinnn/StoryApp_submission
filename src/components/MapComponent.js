export default class MapComponent {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.map = null;
    this.marker = null;
    this.initMap();
  }

  initMap() {
    const { center = [0, 0], zoom = 2 } = this.options;
    this.map = L.map(this.containerId).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    if (this.options.onClick) {
      this.map.on("click", this.options.onClick);
    }
  }

  addMarker(lat, lon, popupText = "") {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lon]).addTo(this.map);
    if (popupText) {
      this.marker.bindPopup(popupText).openPopup();
    }
  }

  clearMarker() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }

  flyTo(lat, lon, zoom = 13) {
    if (this.map) {
      this.map.flyTo([lat, lon], zoom);
    }
  }
}
