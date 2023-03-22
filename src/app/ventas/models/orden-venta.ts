import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Empresa } from "src/app/gestion/models/empresa";
import { Cliente } from "src/app/maestros/models/cliente";
import { ClienteContacto } from "src/app/maestros/models/cliente-contacto";
import { Moneda } from "src/app/maestros/models/moneda";
import { TipoCambio } from "src/app/maestros/models/tipo-cambio";
import { OrdenVentaDetalle } from "./orden-venta-detalle";
import { Pago } from "./pago";

export class OrdenVenta {
    id: number;
    codigo: string;
    empresaPartida: Empresa;
    indIncluyeIgv: boolean;
    diasValidez: number;
    aniosGarantia: number;
    plazoEntrega: number;
    cliente: Cliente;
    contacto: ClienteContacto;
    subtotal: number;
    montoIgv: number;
    total: number;
    estado: TablaAuxiliarDetalle;
    fechaEntregaBase: Date;
    formaPago: TablaAuxiliarDetalle;
    saldoPago: TablaAuxiliarDetalle;
    tipoMoneda: Moneda;
    descuentoTotal: number;
    referencia: string;
    tipoCambio: TipoCambio;
    pagos: Pago[];
    detalle: OrdenVentaDetalle[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}