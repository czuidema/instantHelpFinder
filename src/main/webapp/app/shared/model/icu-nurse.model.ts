export interface IICUNurse {
  id?: number;
}

export class ICUNurse implements IICUNurse {
  constructor(public id?: number) {}
}
