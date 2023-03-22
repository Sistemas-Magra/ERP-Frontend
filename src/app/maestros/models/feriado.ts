import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class Feriado {
    id: number;
    fecha: Date;
    estado: TablaAuxiliarDetalle;
    observacion: string;
    factorSueldo: number;
    idUsuarioCrea: number;
    fechaCrea: Date;
}