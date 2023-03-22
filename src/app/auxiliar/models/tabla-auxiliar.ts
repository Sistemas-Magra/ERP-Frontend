import { TablaAuxiliarDetalle } from "./tabla-auxiliar-detalle";

export class TablaAuxiliar {
    codTablaAuxiliar: string;
    nombre: string;
    indEdicion: boolean;
    observacion: string;
    detalleAuxiliar: TablaAuxiliarDetalle[];
    idUsuarioCrea: number;
    fechaCrea: Date;
}
