import { Time } from '@angular/common';

export class Meeting {
    constructor(public id: number, public name: string, public date: string, public time: string, public datetime: string, public display: boolean) {}
}