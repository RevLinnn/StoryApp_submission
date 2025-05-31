import './public/styles/style.css';
import StoryModel from './models/StoryModel.js';
import StoryPresenter from './presenters/StoryPresenter.js';
import AuthPresenter from './presenters/AuthPresenter.js';
import { subscribeUserToPush } from './utils/push-helper.js';
import BookmarkPresenter from "./presenters/BookmarkPresenter.js";
import CameraHelper from './utils/CameraHelper.js';

const app = document.getElementById('main-content');

const getToken = () => localStorage.getItem('token') || '';
const setToken = (token = '') => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
};

window.addEventListener('hashchange', () => {
  CameraHelper.stopAllStreams();
  router();
});

document.addEventListener('DOMContentLoaded', async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker terdaftar.');

            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = getToken();
                if (token) {
                    await subscribeUserToPush(registration, token);
                } else {
                    console.warn('Tidak ada token login. Push tidak di-subscribe.');
                }
            } else {
                console.warn('Izin notifikasi ditolak.');
            }
        } catch (err) {
            console.error('Gagal mendaftarkan Service Worker:', err);
        }
    } else {
        console.warn('Service Worker tidak didukung.');
    }
});

const bookmarkPresenter = new BookmarkPresenter(app);
const model = new StoryModel(() => getToken());
const storyPresenter = new StoryPresenter(app, model, bookmarkPresenter);
const authPresenter = new AuthPresenter(app, setToken);

const navList = document.getElementById('nav-list');
const btnLogout = document.getElementById('btn-logout');
const linkLogin = document.getElementById('link-login');

function updateNav() {
    const loggedIn = !!getToken();
    btnLogout.style.display = loggedIn ? 'inline-block' : 'none';
    linkLogin.style.display = loggedIn ? 'none' : 'inline-block';
}

btnLogout.addEventListener('click', () => {
    setToken('');
    updateNav();
    window.location.hash = '#/login';
});

async function renderPage(page) {
    app.innerHTML = '';

    switch (page) {
        case 'stories':
            await storyPresenter.route(page);
            break;
        case 'add-story':
            await storyPresenter.route(page);
            break;
        case 'bookmarks':
            await bookmarkPresenter.showBookmarks();
            break;
        case 'login':
            authPresenter.showLogin();
            break;
        case 'register':
            authPresenter.showRegister();
            break;
        default:
            app.innerHTML = '<p>Halaman tidak ditemukan.</p>';
            break;
    }
}

async function router() {
    const hash = window.location.hash || '#/stories';
    const page = hash.startsWith('#/') ? hash.slice(2) : hash.slice(1);
    const token = getToken();

    if (!token && (page === 'stories' || page === 'add-story')) {
        window.location.hash = '#/login';
        return;
    }

    updateNav();

    if (document.startViewTransition) {
        document.startViewTransition(() => renderPage(page));
    } else {
        await renderPage(page);
    }

    if (app) app.focus();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    updateNav();
    router();
});
