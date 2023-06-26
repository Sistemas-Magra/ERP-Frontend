import { OrdenTrabajoDetalle } from "src/app/produccion/models/orden-trabajo-detalle";

export class FormularioDetalle {
	id: number;
	indCarga: boolean = true;
	ordenTrabajoDetalle: OrdenTrabajoDetalle;	
	cantidadSolicitada: number;	
	cantidadPendDespacho: number;	
	cantidadDisponible: number;	
	cantidad: number = 0;
}