import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Empleado } from "./empleado";
import { Empresa } from "src/app/gestion/models/empresa";

export class Contrato {
    id: number;
    fechaInicioVigencia: number;
    fechaFinVigencia: number;
    empleado: Empleado;
    sueldo: number;
    archivo: string;
    indAsignacionFamiliar: boolean;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
    estado:TablaAuxiliarDetalle;

    empresa: Empresa;
}