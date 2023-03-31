import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Empleado } from "./empleado";

export class Permiso {
    id: number;
    motivo: string;
    fechaInicio: Date;
    fechaFin: Date;
    empleado: Empleado;
    estado: TablaAuxiliarDetalle;
    archivo: string;
    observacion: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}