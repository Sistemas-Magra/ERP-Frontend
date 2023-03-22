import { CotizacionDetalle } from "./cotizacion-detalle";

export class OrdenCompraDetalle {
    id: number;
    cotizacionDetalle: CotizacionDetalle;
    cantidadRecibidaAlmacen: number;
    idUsuarioCrea: number;
    fechaCrea: Date;
    idUsuarioModifica: number;
    fechaModifica: Date;
}