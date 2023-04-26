import { OrdenVentaDetalle } from "src/app/ventas/models/orden-venta-detalle";

export class OrdenTrabajoDetalle {
    id: number;
    ordenVentaDetalle: OrdenVentaDetalle;
    cantidadProducida: number;
    cantidadPendiente: number;
    cantidadProgramadaSemanal: number;
}
