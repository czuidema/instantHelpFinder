import { IDoctor } from 'app/shared/model/doctor.model';
import { IICUNurse } from 'app/shared/model/icu-nurse.model';
import { IAssistant } from 'app/shared/model/assistant.model';
import { EPriority } from 'app/shared/model/enumerations/e-priority.model';

export interface ITurningEvent {
  id?: number;
  patientName?: string;
  patientData?: string;
  ward?: string;
  roomNr?: string;
  priority?: EPriority;
  doctor?: IDoctor;
  icuNurse?: IICUNurse;
  assistants?: IAssistant[];
}

export class TurningEvent implements ITurningEvent {
  constructor(
    public id?: number,
    public patientName?: string,
    public patientData?: string,
    public ward?: string,
    public roomNr?: string,
    public priority?: EPriority,
    public doctor?: IDoctor,
    public icuNurse?: IICUNurse,
    public assistants?: IAssistant[]
  ) {}
}
