export interface ITimeSlot {
  start?: Date;
  end?: Date;
  selected?: boolean;
}

export class TimeSlot implements ITimeSlot {
  constructor(public start?: Date, public end?: Date, public selected?: boolean) {}
}
