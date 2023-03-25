import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Cargo } from "src/app/maestros/models/cargo";
import { SubArea } from "src/app/maestros/models/sub-area";
import { EntidadFondos } from "./entidad-fondos";

export class Empleado {
    id: number;
    codigo: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaIngreso: Date;
    fechaCese: Date;
    motivoCese: TablaAuxiliarDetalle;
    direccion: string;
    celular: string;
    telefono: string;
    correo: string;
    categoria: TablaAuxiliarDetalle;
    vacacionesAcumuladas: number;
    vacacionesDisponibles: number;
    vacacionesOcupadas: number;
    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumentoIdentidad: string;
    entidadFondos: EntidadFondos;
    subArea: SubArea;
    cargo: Cargo;
    fechaFinPrueba: Date;
    puntuacion: number;
    foto: string;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;

    nombreCompleto: string;
    fechaNacimiento: Date;
}