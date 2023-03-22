import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class Proveedor {
    id: number;
    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumentoIdentidad: string;
    razonSocial: string;
    nombreComercial: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}