import { ProductoVenta } from "./producto-venta";

export class OrdenVentaDetalle {
    id: number;
    cantidad: number;
    precioVentaUnitario: number;
    descuentoPorcentaje: number;
    descuentoMonto: number;
    total: number;
    plano: string;
    planoFile: File;
    especificacionesTecnicas: string;
    especificacionesTecnicasFile: File;
    producto: ProductoVenta;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}