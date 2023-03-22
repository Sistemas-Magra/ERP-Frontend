import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class EntidadFondos {
    id: number;
    nombre: string;
    tipoEntidadFondos: TablaAuxiliarDetalle;
    comision: number;
    prima: number;
    aporte: number;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}
