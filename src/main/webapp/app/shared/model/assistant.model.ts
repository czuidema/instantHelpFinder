import { IRequest } from 'app/shared/model/request.model';

export interface IAssistant {
  id?: number;
  requests?: IRequest[];
}

export class Assistant implements IAssistant {
  constructor(public id?: number, public requests?: IRequest[]) {}
}
