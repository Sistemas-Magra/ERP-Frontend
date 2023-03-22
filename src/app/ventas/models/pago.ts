import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class Pago {
    id: number;
    tipoPago: TablaAuxiliarDetalle;
    monto: number;
    diferenciaTotal: number;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}