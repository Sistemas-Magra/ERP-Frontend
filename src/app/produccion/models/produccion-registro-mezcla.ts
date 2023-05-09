import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionRegistroMezcla {
    id: number;
    ordenTrabajo: OrdenTrabajo;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;
    responsable: string;
    bolsasCemento: number;
    carretillaPiedra: number;
    carretillaArena: number;
    tipoCemento: number;
    marcaCemento: string;
    litrosAgua: number;
    relacionAguaCemento: number;
    horaIngreso: Date;
    horaSalida: Date;
    minutosTotal: number;
    indConforme: boolean;
    observacion: string;
    
    listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
}