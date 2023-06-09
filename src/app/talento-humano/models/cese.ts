import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { PeriodoCts } from "src/app/maestros/models/periodo-cts";
import { PeriodoGratificacion } from "src/app/maestros/models/periodo-gratificacion";
import { Empleado } from "./empleado";

export class Cese {
    id: number;
    periodoCts: PeriodoCts;
    periodoGratificacion: PeriodoGratificacion;
    empleado: Empleado;
    tipoMotivo: TablaAuxiliarDetalle;
    motivo: string;
    fechaCese: Date;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}