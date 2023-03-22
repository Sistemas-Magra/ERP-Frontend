import { OrdenTrabajoDiaPoste } from "src/app/produccion/models/orden-trabajo-dia-poste";

export class FormularioPoste {
    id: number;
    poste: OrdenTrabajoDiaPoste;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}