import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { SubArea } from "./sub-area";

export class Area {
    id: number;
    nombre: string;
    estado: TablaAuxiliarDetalle;
    observacion: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
    subareas: SubArea[];
}