import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { InduccionAsistencia } from "./induccion-asistencia";

export class Induccion {
    id: number;
    tipoInduccion: TablaAuxiliarDetalle;
    tema: string;
    fechaInduccion: Date;
    idUsuarioCapacitador: number;
    asistentes: InduccionAsistencia[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}