export class User {

  constructor(
    public id: number,
    public username: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public company: string,
    public roles: string[],
    public token: string,
    public accessToken: string
  ) { }

  get getToken(): string {
    return this.token;
  }

  set setToken(token: string) {
    this.token = token;
  }
}
