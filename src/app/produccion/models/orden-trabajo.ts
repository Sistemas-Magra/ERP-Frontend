import { OrdenVentaDetalle } from "src/app/ventas/models/orden-venta-detalle";
import { OrdenTrabajoDia } from "./orden-trabajo-dia";

export class OrdenTrabajo {
    id: number;
    codigo: string;
    ordenVentaDetalle: OrdenVentaDetalle;
    cantidad: number;
    trabajoSemanal: number;
    produccionDias: OrdenTrabajoDia[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}