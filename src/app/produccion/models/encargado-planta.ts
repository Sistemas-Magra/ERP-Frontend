import { Planta } from "src/app/maestros/models/planta";

export class EncargadoPlanta {
    id: number;
    fecha: Date;
    planta: Planta;
    idUsuarioEncargado: number;
}