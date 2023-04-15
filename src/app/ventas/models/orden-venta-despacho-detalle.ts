import { ProductoVenta } from "./producto-venta";

export class OrdenVentaDespachoDetalle {
    id: number;
    cantidad: number = 1;
    producto: ProductoVenta;
    precioTotal: number;

    maxAsig: number;
}