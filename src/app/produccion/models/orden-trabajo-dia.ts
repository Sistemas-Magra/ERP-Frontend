import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { OrdenTrabajoDiaPoste } from "./orden-trabajo-dia-poste";

export class OrdenTrabajoDia {
    id: number;
    dia: TablaAuxiliarDetalle;
    cantidad: number;
    postes: OrdenTrabajoDiaPoste[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}