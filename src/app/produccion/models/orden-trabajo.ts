import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenVenta } from "src/app/ventas/models/orden-venta";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class OrdenTrabajo {
    id: number;
    codigo: string;
    nombreTrabajo: string;
    ordenVenta: OrdenVenta;
    estado: TablaAuxiliarDetalle;
    detalle: OrdenTrabajoDetalle[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;

    autocompleteShow: string;
}