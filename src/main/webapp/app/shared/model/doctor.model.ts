export interface IDoctor {
  id?: number;
}

export class Doctor implements IDoctor {
  constructor(public id?: number) {}
}
