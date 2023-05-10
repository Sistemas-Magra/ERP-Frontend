import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionAccesorioRegistroVibracion {
	id: number;
	ordenTrabajo: OrdenTrabajo;
	ordenTrabajoDetalle: OrdenTrabajoDetalle;
	responsable: string;
	horaIngreso: Date;
	horaSalida: Date;
	estadoMaquina: TablaAuxiliarDetalle;
	cantidad: number;
	indConforme: boolean;
	observacion: string;
	
	listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
	minutosTotal: number;
}