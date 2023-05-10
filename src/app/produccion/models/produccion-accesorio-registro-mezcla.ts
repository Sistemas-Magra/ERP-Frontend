import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionAccesorioRegistroMezcla {
	id: number;
	ordenTrabajo: OrdenTrabajo;
	ordenTrabajoDetalle: OrdenTrabajoDetalle;
	responsable: string;
	bolsasCemento: number;
	carretillaPiedra: number;
	carretillaArena: number;
	litrosAgua: number;
	inhibidorCorrosion: number;
	tipoCemento: number;
	marcaCemento: string;
	cantidad: number;
	horaIngreso: Date;
	horaSalida: Date;
	indConforme: boolean;
	observacion: string;

	minutosTotal: number;
	listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
}