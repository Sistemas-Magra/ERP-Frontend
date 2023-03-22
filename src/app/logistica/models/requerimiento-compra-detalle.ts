import { ProductoAlmacen } from "src/app/almacen/models/producto-almacen";
import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class RequerimientoCompraDetalle {
    id: number;
    cantidad: number;
    unidadMedida: TablaAuxiliarDetalle;
    producto: ProductoAlmacen;
    productoStr: string;
    tipoRequerimiento: TablaAuxiliarDetalle;
    cantidadAtendida: number;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}