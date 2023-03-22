import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { RequerimientoCompraDetalle } from "./requerimiento-compra-detalle";

export class CotizacionDetalle {
    id: number;
    cantidad: number;
    unidadMedida: TablaAuxiliarDetalle;
    costoUnitario: number;
    costoTotal: number;
    requerimientoDetalle: RequerimientoCompraDetalle;
    idUsuarioCrea: number;
    fechaCrea: Date;
    idUsuarioModifica: number;
    fechaModifica: Date;
}