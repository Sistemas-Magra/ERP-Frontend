import { ProductoVenta } from "src/app/ventas/models/producto-venta";
import { ProtocoloPruebaCargaTrabajo } from "./protocolo-prueba-carga-trabajo";
import { ProtocoloPruebaRotura } from "./protocolo-prueba-rotura";
import { OrdenVenta } from "src/app/ventas/models/orden-venta";
import { Cliente } from "src/app/maestros/models/cliente";
import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class ProtocoloPrueba {
    id: number;
	codigo: string;
	entidadLicitante: string;
	cliente: Cliente;
	lote: number;
	ordenVenta: OrdenVenta;
	tipoPrueba: TablaAuxiliarDetalle;
	fechaInicio: Date = new Date();
	producto: ProductoVenta;
	empotramiento: number = 2;
	coeficienteSeguridad: number = 2;
	porcentajeDeflexMax: number = 6;
	porcentajeDeformxMax: number = 5;
	deflexMax: number;
	deformMax: number;
	conclusion: string;
	pruebasCargaTrabajo: ProtocoloPruebaCargaTrabajo[] = [];
	pruebasRotura: ProtocoloPruebaRotura[] = [];
}