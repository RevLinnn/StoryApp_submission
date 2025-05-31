export default class AuthComponent {
    constructor(container) {
        this.container = container;
    }

    renderLogin() {
        this.container.innerHTML = `
            <h2>Login</h2>
            <form id="form-login">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required autocomplete="username" />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required autocomplete="current-password" minlength="8" />
                <button type="submit">Login</button>
            </form>
            <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
        `;
    }

    renderRegister() {
        this.container.innerHTML = `
            <h2>Register</h2>
            <form id="form-register">
                <label for="name">Nama:</label>
                <input type="text" id="name" name="name" required autocomplete="name" />
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required autocomplete="email" />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password" />
                <button type="submit">Register</button>
            </form>
            <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
        `;
    }

    getLoginFormData() {
        const email = this.container.querySelector("#email").value.trim();
        const password = this.container.querySelector("#password").value.trim();
        return { email, password };
    }

    getRegisterFormData() {
        const name = this.container.querySelector("#name").value.trim();
        const email = this.container.querySelector("#email").value.trim();
        const password = this.container.querySelector("#password").value.trim();
        return { name, email, password };
    }

    showAlert(message) {
        alert(message);
    }
}
