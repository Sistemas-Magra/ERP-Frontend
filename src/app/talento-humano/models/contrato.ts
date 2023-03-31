import { Empleado } from "./empleado";

export class Contrato {
    id: number;
    fechaInicioVigencia: number;
    fechaFinVigencia: number;
    empleado: Empleado;
    sueldo: number;
    archivo: string;
    indAsignacionFamiliar: boolean;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}