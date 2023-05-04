import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";

export class ProduccionPlantaPoste {
    id: number;
    nroProduccion: number;
    cantidad: number = 1;
    stickerProduccion: string;
    idUsuarioCalidad: number;
    stickerCalidad: string;
    indConformidad: boolean;
    observacion: string;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;
    idUsuarioCrea: number;
    fecha: Date = new Date();

    ordenTrabajo: OrdenTrabajo;
    listadoAutocompleteAux: OrdenTrabajoDetalle[] = [];
}