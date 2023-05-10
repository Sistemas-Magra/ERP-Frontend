import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionAccesorioRegistroAcabado {
    id: number;
	ordenTrabajo: OrdenTrabajo;
	ordenTrabajoDetalle: OrdenTrabajoDetalle;
	responsable: string;
	cantidad: number;	
	tiposAcabados: string;	
	indConforme: boolean;
	observacion: string;

	listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
	abrvsAcabado: string;
	nombresAcabado: string;
}