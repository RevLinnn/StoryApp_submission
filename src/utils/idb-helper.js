import { openDB } from "idb";

const DB_NAME = "story-app-db";
const DB_VERSION = 1;
const STORE_NAME = "stories";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
    },
});

const IdbHelper = {
    async saveStories(stories) {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        stories.forEach((story) => store.put(story));
        await tx.done;
    },

    async getStories() {
        const db = await dbPromise;
        return db.getAll(STORE_NAME);
    },

    async clearStories() {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, "readwrite");
        await tx.objectStore(STORE_NAME).clear();
        await tx.done;
    },
};

export default IdbHelper;
