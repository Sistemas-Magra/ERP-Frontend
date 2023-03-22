import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { ProductoVenta } from "src/app/ventas/models/producto-venta";

export class ConfiguracionUtensilios {
    id: number;
    cantidad: number;
    unidadMedida: TablaAuxiliarDetalle;
    producto: ProductoVenta;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}