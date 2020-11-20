import { User } from '../authentification/user.model';

export class Meeting {
  constructor(
    public id: number,
    public name: string,
    public datetime: string,
    public display: boolean,
    public users: User[]
  ) {}
}
