import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenCompraDetalle } from "src/app/logistica/models/orden-compra-detalle";

export class NotaEntradaDetalle {
    id: number;
    cantidad: number;
    unidadMedida: TablaAuxiliarDetalle;
    ordenCompraDetalle: OrdenCompraDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}