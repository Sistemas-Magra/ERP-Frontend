import { Empleado } from "src/app/talento-humano/models/empleado";
import { TablaAuxiliarDetalle } from "../../auxiliar/models/tabla-auxiliar-detalle";
import { ParametroUsuario } from "./parametro-usuario";
import { Role } from "./role";

export class Usuario {
    id: number;
    nombreCompleto: string;
    username: string;
    email: string;
    telefono: string;
    celular: string;
    empleado: Empleado;
    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumento: string;
    fechaNacimiento: Date;
    foto: string;
    estado: TablaAuxiliarDetalle;
    rolesDetallado: string[];
    rolesAuthorities: string[];
    roles: Role[];
    parametros: ParametroUsuario[];
    password: string;
}