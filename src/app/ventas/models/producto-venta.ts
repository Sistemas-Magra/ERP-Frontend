import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { MateriaPrimaProducto } from "./materia-prima-producto";

export class ProductoVenta {
    id: number;
    codigo: string;
    nombre: string;
    cantidad: number;
    longitud: number;
    cargaTrabajo: number;
    cima: number;
    base: number;
    tipoProducto: TablaAuxiliarDetalle;
    precioVentaBase: number;
    resumen: string;
    insumos: MateriaPrimaProducto[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;

    busqueda: string;
}