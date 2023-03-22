import { ProductoVenta } from "./producto-venta";

export class OrdenVentaDetalle {
    id: number;
    cantidad: number;
    precioVentaUnitario: number;
    descuentoPorcentaje: number;
    descuentoMonto: number;
    total: number;
    producto: ProductoVenta;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}