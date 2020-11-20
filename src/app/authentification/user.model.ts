import {Meeting} from '../meeting/meeting.model';

export class User {

  constructor(
    public id: number,
    public username: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public company: string,
    public role: string,
    public token: string,
    public accessToken: string,
    public meetings: Meeting[]
  ) { }

  get getToken(): string {
    return this.token;
  }

  set setToken(token: string) {
    this.token = token;
  }
}
