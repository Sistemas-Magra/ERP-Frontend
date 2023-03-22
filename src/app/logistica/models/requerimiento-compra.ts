import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { RequerimientoCompraDetalle } from "./requerimiento-compra-detalle";

export class RequerimientoCompra {
    id: number;
    codigo: string;
    motivo: string;
    prioridad: TablaAuxiliarDetalle;
    prioridadLogistica: TablaAuxiliarDetalle;
    estado: TablaAuxiliarDetalle;
    detalle: RequerimientoCompraDetalle[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}