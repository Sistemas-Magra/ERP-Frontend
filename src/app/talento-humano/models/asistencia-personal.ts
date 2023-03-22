import { Empleado } from "./empleado";

export class AsistenciaPersonal {
    id: number;
    horaIngreso: Date;
    horaSalida: Date;
    fecha: Date;
    empleado: Empleado;
    idUsuarioCrea: number;
    fechaCrea: Date;
}