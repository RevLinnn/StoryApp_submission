export default class AuthModel {
    constructor(getTokenCallback) {
        this.apiUrl = "https://story-api.dicoding.dev/v1";
        this.getToken = getTokenCallback;
    }

    async login({ email, password }) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (result.error) {
            throw new Error(result.message);
        }
        return result.loginResult;
    }

    async register({ name, email, password }) {
        const response = await fetch(`${this.apiUrl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();
        if (result.error) {
            throw new Error(result.message);
        }
        return result.message;
    }
}
