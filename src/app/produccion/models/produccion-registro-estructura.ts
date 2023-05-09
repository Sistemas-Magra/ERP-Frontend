import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionRegistroEstructura {
    id: number;
    ordenTrabajo: OrdenTrabajo;
    horaIngreso: Date;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;	
    responsable: string;
	cantVarillas: number;	
	diametroFierroVarillas: string;	
	cantAnillos: number;	
	diametroFierroAnillos: TablaAuxiliarDetalle;	
	nroAlambreEspiral: TablaAuxiliarDetalle;	
	nroAlambreAmarre: TablaAuxiliarDetalle;	
    nroRoldana: string;
	cantRoldana: string;
    cantElectrodos: number;
    indConforme: boolean;
    observacion: string;
    
    listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];

    listadoDiametrosVarillaAux: any[] = [];
    listadoDiametrosRoldanaAux: any[] = [];
}