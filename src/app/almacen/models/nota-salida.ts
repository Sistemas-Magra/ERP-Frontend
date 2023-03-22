import { Almacen } from "src/app/logistica/models/almacen";
import { NotaSalidaDetalle } from "./nota-salida-detalle";

export class NotaSalida {
    id: number;
    codigo: string;
    fechaSalida: string;
    almacenSalida: Almacen;
    idUsuarioEntrega: number;
    idUsuarioRecibe: number;
    observacion: string;
    detalle: NotaSalidaDetalle[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}