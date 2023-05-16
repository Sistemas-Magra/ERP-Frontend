import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class Planta {
    id: number;
    nombre: string;
    numero: string;
    abreviatura: string;
    alias: string;
    estado: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}