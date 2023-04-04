import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class HijoEmpleado {
    id: number;
    nombreCompleto: string;
    fechaNacimiento: Date;
    idUsuarioCrea: number;
    fechaCrea: Date;
    idUsuarioModifica: number;
    fechaModifica: Date;
    edad: number;

    fechaNacimientoStr: string;

    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumentoIdentidad:string;
}
