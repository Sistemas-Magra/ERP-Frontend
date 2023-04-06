import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { ReporteCaracteristicaEncontrada } from "src/app/seguridad-trabajo/models/reporte-caracteristica-encontrada";
import { ReporteCondicionEncontrada } from "src/app/seguridad-trabajo/models/reporte-condicion-encontrada";
import { Planta } from "src/app/maestros/models/planta";
import { Empleado } from "src/app/talento-humano/models/empleado";

export class ReporteActosCondiciones {
    id: number;
    idUsuarioReporta: number;
    empleado: Empleado;
    fechaOcurrencia: Date
    tipoEvento: string;
    estado: TablaAuxiliarDetalle;
    descripcion: string;
    afectacion: string;
    planta: Planta;
    medidaMejora: string;
    condiciones: ReporteCondicionEncontrada[] = [];
    caracteristicas: ReporteCaracteristicaEncontrada[]=[];
    indCompromisoPersonal:boolean;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;

    fechaOcurrenciaStr: string;
}