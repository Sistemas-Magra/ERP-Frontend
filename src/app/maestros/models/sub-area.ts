import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class SubArea {
    id: number;
    abreviatura: string;
    abreviatura2: string;
    nombre: string;
    estado: TablaAuxiliarDetalle;
    observacion: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}