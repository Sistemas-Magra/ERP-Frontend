import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class PeriodoCts {
    id: number;
    fechaInicio: Date;
    fechaFin: Date;
    estado: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}