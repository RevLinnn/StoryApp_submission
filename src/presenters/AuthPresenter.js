import AuthComponent from "../components/AuthComponent.js";

export default class AuthPresenter {
  constructor(container, setTokenCallback) {
    this.view = new AuthComponent(container);
    this.setToken = setTokenCallback;
  }

  showLogin() {
    this.view.renderLogin();
    this.addLoginEvent();
  }

  showRegister() {
    this.view.renderRegister();
    this.addRegisterEvent();
  }

  addLoginEvent() {
    const form = this.view.container.querySelector("#form-login");
    form.addEventListener("submit", (e) => this.submitLogin(e));
  }

  addRegisterEvent() {
    const form = this.view.container.querySelector("#form-register");
    form.addEventListener("submit", (e) => this.submitRegister(e));
  }

  async submitLogin(event) {
    event.preventDefault();
    const { email, password } = this.view.getLoginFormData();

    if (!email || !password) {
      this.view.showAlert("Email dan password harus diisi");
      return;
    }

    const modelModule = await import("../models/AuthModel.js");
    const model = new modelModule.default(() => "");

    try {
      const loginResult = await model.login({ email, password });
      this.setToken(loginResult.token);

      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const { subscribeUserToPush } = await import('../utils/push-helper.js');
          await subscribeUserToPush(registration, loginResult.token);
        } catch (err) {
          console.warn('Gagal subscribe push notification setelah login:', err);
        }
      }

      this.view.showAlert(`Login berhasil, selamat datang ${loginResult.name}`);
      window.location.hash = "#/stories";
    } catch (error) {
      this.view.showAlert("Login gagal: " + error.message);
    }
  }

  async submitRegister(event) {
    event.preventDefault();
    const { name, email, password } = this.view.getRegisterFormData();

    if (!name || !email || !password) {
      this.view.showAlert("Semua field wajib diisi");
      return;
    }

    if (password.length < 8) {
      this.view.showAlert("Password minimal 8 karakter");
      return;
    }

    const modelModule = await import("../models/AuthModel.js");
    const model = new modelModule.default(() => "");

    try {
      const msg = await model.register({ name, email, password });
      this.view.showAlert(msg + ". Silakan login sekarang.");
      window.location.hash = "#/login";
    } catch (error) {
      this.view.showAlert("Register gagal: " + error.message);
    }
  }
}
