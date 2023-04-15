import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { TipoCambio } from "./tipo-cambio";

export class Moneda {
    id: number;
    nombre: string;
    abreviatura: string;
    simbolo:string;
    tipoCambio: number;
    estado: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}