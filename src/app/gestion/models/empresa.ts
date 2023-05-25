import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Sede } from "./sede";

export class Empresa {
    id: number;
    razonSocial: string;
    nombreComercial: string;
    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumentoIdentidad: string;
    direccion: string;
    logo: string;
    estado: TablaAuxiliarDetalle;
    sedes: Sede[] = [];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}