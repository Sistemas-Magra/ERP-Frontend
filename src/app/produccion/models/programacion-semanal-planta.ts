import { Planta } from "src/app/maestros/models/planta";
import { ProgramacionSemanalPlantaCliente } from "./programacion-semanal-planta-cliente";

export class ProgramacionSemanalPlanta {
    id: number;
    planta: Planta;
    detalleCliente: ProgramacionSemanalPlantaCliente[] = [];
    idUsuarioCrea: number;
    fechaCrea: Date;
}