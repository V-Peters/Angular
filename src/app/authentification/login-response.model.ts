export class LoginResponse {

  constructor(
    public type: string,
    public token: string,
    public role: string,
    public id: number,
    public username: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public company: string,
  ) { }
}
