import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { ReporteCaracteristicaEncontrada } from "src/app/seguridad-trabajo/models/reporte-caracteristica-encontrada";
import { ReporteCondicionEncontrada } from "src/app/seguridad-trabajo/models/reporte-condicion-encontrada";
import { Planta } from "src/app/maestros/models/planta";
import { Empleado } from "src/app/talento-humano/models/empleado";

export class ReporteActosCondiciones {
    id: number;
    idUsuarioReporta: number;
    empleado: Empleado;
    tipoEvento: TablaAuxiliarDetalle;
    descripcion: string;
    afectacion: TablaAuxiliarDetalle;
    planta: Planta;
    medidaMejora: string;
    condiciones: ReporteCondicionEncontrada[];
    caracteristicas: ReporteCaracteristicaEncontrada[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}