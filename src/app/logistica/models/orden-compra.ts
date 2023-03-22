import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Cotizacion } from "./cotizacion";
import { OrdenCompraDetalle } from "./orden-compra-detalle";

export class OrdenCompra {
    id: number;
    codigo: string;
    cotizacion: Cotizacion;
    estado: TablaAuxiliarDetalle;
    detalle: OrdenCompraDetalle[];
    idUsuarioCrea: number;
    fechaCrea: Date;
    idUsuarioModifica: number;
    fechaModifica: Date;
}
