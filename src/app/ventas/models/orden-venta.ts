import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Empresa } from "src/app/gestion/models/empresa";
import { Cliente } from "src/app/maestros/models/cliente";
import { ClienteContacto } from "src/app/maestros/models/cliente-contacto";
import { Moneda } from "src/app/maestros/models/moneda";
import { OrdenVentaDetalle } from "./orden-venta-detalle";
import { Pago } from "./pago";
import { OrdenVentaDespacho } from "./orden-venta-despacho";

export class OrdenVenta {
    id: number;
    codigo: string;
    empresaPartida: Empresa;
    indIncluyeIgv: boolean = true;
    diasValidez: number;
    aniosGarantia: number;
    plazoEntrega: number;
    cliente: Cliente;
    contacto: ClienteContacto;
    subtotal: number = 0;
    montoIgv: number = 0;
    total: number = 0;
    nombreTrabajo: string;
    estado: TablaAuxiliarDetalle;
    fechaEntregaBase: Date;
    adelanto: number = 0;
    adelantoPorc: number = 0;
    pagoPendiente: number = 0;
    saldoPago: TablaAuxiliarDetalle;
    tipoMoneda: Moneda;
    descuentoTotal: number = 0;
    referencia: string;
    tipoCambio: number;
    pagos: Pago[];
    detalle: OrdenVentaDetalle[] = [];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;

    despacho: OrdenVentaDespacho[] = [];
}