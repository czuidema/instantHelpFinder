export interface ITimeSlot {
  start?: Date;
  end?: Date;
  isSelected?: boolean;
}

export class TimeSlot implements ITimeSlot {
  constructor(public start?: Date, public end?: Date, public isSelected?: boolean) {}
}
