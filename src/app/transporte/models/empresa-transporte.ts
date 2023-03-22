import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { ConductorEmpresaTransporte } from "./conductor-empresa-transporte";
import { VehiculoEmpresaTransporte } from "./vehiculo-empresa-transporte";

export class EmpresaTransporte {
    id: number;
    razonSocial: string;
    nombreComercial: string;
    tipoDocumentoIdentidad: TablaAuxiliarDetalle;
    nroDocumentoIdentidad: string;
    conductores: ConductorEmpresaTransporte[];
    vehiculos: VehiculoEmpresaTransporte[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}