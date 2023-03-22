import { PeriodoCts } from "src/app/maestros/models/periodo-cts";
import { PeriodoGratificacion } from "src/app/maestros/models/periodo-gratificacion";
import { Empleado } from "./empleado";

export class Cese {
    id: number;
    periodoCts: PeriodoCts;
    periodoGratificacion: PeriodoGratificacion;
    empleado: Empleado;
    fechaCese: Date;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}