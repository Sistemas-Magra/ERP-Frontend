import { Almacen } from "src/app/logistica/models/almacen";
import { NotaEntradaDetalle } from "./nota-entrada-detalle";

export class NotaEntrada {
    id: number;
    codigo: string;
    fechaEntrada: Date;
    almacenRecepcion: Almacen;
    idUsuarioRecibe: number;
    observacion: string;
    detalle: NotaEntradaDetalle[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}