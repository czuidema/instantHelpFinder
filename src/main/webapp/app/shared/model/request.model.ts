import { IDoctor } from 'app/shared/model/doctor.model';
import { IICUNurse } from 'app/shared/model/icu-nurse.model';
import { IAssistant } from 'app/shared/model/assistant.model';

export interface IRequest {
  id?: number;
  location?: string;
  doctor?: IDoctor;
  icuNurse?: IICUNurse;
  assistants?: IAssistant[];
}

export class Request implements IRequest {
  constructor(
    public id?: number,
    public location?: string,
    public doctor?: IDoctor,
    public icuNurse?: IICUNurse,
    public assistants?: IAssistant[]
  ) {}
}
