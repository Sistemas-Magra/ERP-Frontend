import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Almacen } from "src/app/logistica/models/almacen";

export class ProductoAlmacen {
    id: number;
    nombre: string;
    estado: TablaAuxiliarDetalle;
    almacen: Almacen;
    stock: number;
    unidadMedida: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}
