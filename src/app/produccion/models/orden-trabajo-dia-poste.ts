import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Planta } from "src/app/maestros/models/planta";
import { PosteEmpleado } from "./poste-empleado";

export class OrdenTrabajoDiaPoste {
    id: number;
    codigoProduccion: string;
    estado: TablaAuxiliarDetalle;
    fechaProduccion: Date;
    idUsuarioCalidad: number;
    codigoCalidad: string;
    fechaRevisionCalidad: Date;
    empleados: PosteEmpleado[];
    planta: Planta;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}