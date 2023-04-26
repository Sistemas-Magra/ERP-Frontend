import { ProgramacionSemanalPlanta } from "./programacion-semanal-planta";

export class ProgramacionSemanal {
    id: number;
    fechaInicio: Date;
    fechaFin: Date;
    version: number;
    detallePlantas: ProgramacionSemanalPlanta[] = [];
    idUsuarioCrea: number
    fechaCrea: Date;
}