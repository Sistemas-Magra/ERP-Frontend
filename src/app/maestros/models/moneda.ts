import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { TipoCambio } from "./tipo-cambio";

export class Moneda {
    id: number;
    nombre: string;
    tipoCambio: TipoCambio;
    estado: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}