import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionRegistroDesencrofado {
    id: number;
    ordenTrabajo: OrdenTrabajo;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;
    responsable: string;
    inconformidadProduccion: string;
    indConforme: boolean;
    observacion: string;
    
    listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
    abrvsInconformidad: string;
    nombresInconformidad: string;
}