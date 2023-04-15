import { OrdenVentaDespachoDetalle } from "./orden-venta-despacho-detalle";

export class OrdenVentaDespacho {
    id: number;
    fechaPropuesta: Date;
    detalle: OrdenVentaDespachoDetalle[] = [];
    precioTotal: number;

    minDate: Date = new Date();
}