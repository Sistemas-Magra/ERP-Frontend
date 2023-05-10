import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionAccesorioRegistroArmado {

	id: number;
	ordenTrabajo: OrdenTrabajo;
	ordenTrabajoDetalle: OrdenTrabajoDetalle;
	responsable: string;;
	hora: Date;
	cantVarillas: number;
	longitudesVarillasDiametro: string;;
	nroAlambreAmarre: TablaAuxiliarDetalle;
	cantRoldanas: string;
	cantElectrodos: number;
	cantidad: number;
	indConforme;
    observacion: string;
	
	listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];

	listadoDiametrosRoldanaAux: any[] = [];
	listadoDiametrosVarillaAux: any[] = [];
}