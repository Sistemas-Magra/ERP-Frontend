import { Empleado } from "src/app/talento-humano/models/empleado";

export class InduccionAsistencia {
    id: number;
    empleado: Empleado;
    observacion: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}