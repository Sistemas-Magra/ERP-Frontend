import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class Pago {
    id: number;
    tipoPago: TablaAuxiliarDetalle;
    monto: number = 0;
    diferenciaTotal: number;
    indEsAdelanto: boolean;
    idUsuarioCrea: number;
    nombreUsuarioCrea: string;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}