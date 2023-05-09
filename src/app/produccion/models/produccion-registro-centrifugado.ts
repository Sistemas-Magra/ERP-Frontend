import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionRegistroCentrifugado {
    id: number;
    ordenTrabajo: OrdenTrabajo;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;
    responsable: string;
    horaIngreso: Date;
	horaSalida: Date;
	minutosTotal: number;
	tiempoVelocidades: string;
	estadoMaquina: TablaAuxiliarDetalle;
    indConforme: boolean;
    observacion: string;
    
    listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
    listadoVelocidades: any[] = [];
}