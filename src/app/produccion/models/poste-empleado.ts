import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Empleado } from "src/app/talento-humano/models/empleado";

export class PosteEmpleado {
    id: number;
    fecha: Date;
    descripcion: string;
    etapa: TablaAuxiliarDetalle;
    empleado: Empleado;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}