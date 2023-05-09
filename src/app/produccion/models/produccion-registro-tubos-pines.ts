import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionRegistroTubosPines {
    id: number;
    ordenTrabajo: OrdenTrabajo;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;	
    responsable: string;
	medidaDiametroPines: TablaAuxiliarDetalle;
    longitudPines: number;
	cantidadPines: number;
	medidaDiametroPistones: TablaAuxiliarDetalle;	
    longitudPistones: number;
	cantidadPistones: number;
    indConforme: boolean;
    observacion: string;
    
    listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
}