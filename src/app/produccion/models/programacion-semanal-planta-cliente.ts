import { OrdenTrabajo } from "./orden-trabajo";
import { OrdenTrabajoDetalle } from "./orden-trabajo-detalle";
import { ProgramacionDiariaHistorico } from "./programacion-diaria-historico";

export class ProgramacionSemanalPlantaCliente {
    id: number;
    cantidadPendiente: number = 0;
    cantidadProgramada: number = 0;
    cantidadMoldes: number;
    vueltasMolde: number;
    ordenTrabajoDetalle: OrdenTrabajoDetalle;
    detalleDiarios: ProgramacionDiariaHistorico[] = [];

    ordenTrabajo: OrdenTrabajo;
}
