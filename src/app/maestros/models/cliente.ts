import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Distrito } from "src/app/ubicacion/models/distrito";
import { ClienteContacto } from "./cliente-contacto";

export class Cliente {
    id: number;
    codigo: string;
    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumentoIdentidad: string;
    estado: TablaAuxiliarDetalle;
    razonSocial: string;
    paginaWeb: string;
    estadoSunat: string;
    situacionSunat: string;
    fax: string;
    direccion: string;
    referencia: string;
    correoComprobante: string;
    distrito: Distrito;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
    contactos: ClienteContacto[];
}