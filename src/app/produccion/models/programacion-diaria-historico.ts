import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class ProgramacionDiariaHistorico {
    id: number;
    cantidadProgramada: number = 0;
    dia: TablaAuxiliarDetalle;
    fecha: Date;
    version: number;
    idUsuarioCrea: number;
    fechaCrea: Date;
}