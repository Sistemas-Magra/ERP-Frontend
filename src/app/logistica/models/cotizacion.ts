import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { CotizacionDetalle } from "./cotizacion-detalle";
import { Proveedor } from "./proveedor";

export class Cotizacion {
    id: number;
    codigo: string;
    observacion: string;
    indSeleccionado: boolean;
    proveedor: Proveedor;
    estado: TablaAuxiliarDetalle;
    detalle: CotizacionDetalle[];
    idUsuarioCrea: number;
    fechaCrea: Date;
    idUsuarioModifica: number;
    fechaModifica: Date;
}