import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionRegistroCurado {
    id: number;
    ordenTrabajo: OrdenTrabajo;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;
    responsable: string;
    horaIngreso: Date;
	horaSalida: Date;
	minutosTotal: number;
    presionCaldero: number
    estadoManguera: TablaAuxiliarDetalle;
    indConforme: boolean;
    observacion: string;
    
    listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
}