import { User } from '../user/user.model';

export class Meeting {
  constructor(
    public id: number,
    public name: string,
    public datetime: string,
    public display: boolean,
    public authorId: number,
    public description: string,
    public users: User[]
  ) {}
}
