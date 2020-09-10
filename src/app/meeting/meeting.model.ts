import { Time } from '@angular/common';

export class Meeting {
    public date: string;
    public time: string;
    constructor(public id: number, public name: string, public datetime: string, public display: boolean) {
    }
}