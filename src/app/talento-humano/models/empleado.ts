import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Cargo } from "src/app/maestros/models/cargo";
import { SubArea } from "src/app/maestros/models/sub-area";
import { Banco } from "./banco";
import { EntidadFondos } from "./entidad-fondos";
import { HijoEmpleado } from "./hijo-empleado";
import { EmpleadoHorarios } from "./empleado-horarios";
import { Distrito } from "src/app/ubicacion/models/distrito";
import { Empresa } from "src/app/gestion/models/empresa";

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
    estado: TablaAuxiliarDetalle;
    gradoInstruccion: TablaAuxiliarDetalle;
    estadoCivil:TablaAuxiliarDetalle;
    
    ultimoLugarEstudio: string;
    nacionalidad: string;
    lugarNacimiento: string;
    indCasaPropia: boolean;
    ladoDominante: TablaAuxiliarDetalle;
    nroCalzado: string;
    tallaPolo: string;
    tallaPantalon: string;
    alergia: string;
    alergiaMedicamento: string;
    telefonoEmergencia: string;
    contactoEmergencia: string;
    parentescoEmergencia: string;

    edad: number;
    hijos: HijoEmpleado[] = [];

    bancoCts: Banco;
    cuentaCts: string;
    bancoSueldo: Banco;
    cuentaSueldo: string;

    fechaInicioPrueba: Date;

    fechaNacimientoStr: string;
    fechaIngresoStr: string;
    fechaInicioPruebaStr: string;
    fechaFinPruebaStr: string;

    sueldoPrueba: number;
    tipoPago: TablaAuxiliarDetalle;
    periocidadPago: TablaAuxiliarDetalle;

    cobrarComisionAfp: boolean;

    indEstaEnPlanilla: boolean;

    horaInicio: string;
    horaFin: string;

    horarios: EmpleadoHorarios[] = [];
    distrito: Distrito;

    empresaRegimen: Empresa;
}