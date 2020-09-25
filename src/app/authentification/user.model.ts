export class User {

    constructor(
        public firstname: string, 
        public lastname: string, 
        public email: string, 
        public company: string, 
        public token: string,
        private _tokenExpirationDate: Date
    ) {}

    get getToken() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this.token;
    }

    set setToken(token: string) {
        this.token = token;
    }
}