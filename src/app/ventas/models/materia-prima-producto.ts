import { ProductoAlmacen } from "src/app/almacen/models/producto-almacen";
import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class MateriaPrimaProducto {
    id: number;
    cantidad: number;
    unidadMedida: TablaAuxiliarDetalle;
    insumo: ProductoAlmacen;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}