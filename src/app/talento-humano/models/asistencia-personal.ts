import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Empleado } from "./empleado";

export class AsistenciaPersonal {
    id: number;
    horaIngreso: Date;
    horaSalida: Date;
    fecha: Date;
    empleado: Empleado;
    idUsuarioCrea: number;
    fechaCrea: Date;
    tipoMarcacion: TablaAuxiliarDetalle;
    horasExtras: number;
    horasTardanza: number;
    horasTrabajadas: number;
    horasNoTrabajadas: number;
}