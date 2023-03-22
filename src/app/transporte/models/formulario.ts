import { ConductorEmpresaTransporte } from "./conductor-empresa-transporte";
import { EmpresaTransporte } from "./empresa-transporte";
import { FormularioDetalle } from "./formulario-detalle";
import { VehiculoEmpresaTransporte } from "./vehiculo-empresa-transporte";

export class Formulario {
    id: number;
    codigo: string;
    fechaDespacho: Date;
    empresaTransporte: EmpresaTransporte;
    conductor: ConductorEmpresaTransporte;
    vehiculo: VehiculoEmpresaTransporte;
    detalle: FormularioDetalle[];
    fechaDespachoCronograma: Date;
    indAtendido: boolean;
    idUsuarioSeguridadVerifica: number;
    indVerificacionSuperficie: boolean;
    indSctr: boolean;
    indCasco: boolean;
    indZapato: boolean;
    indChaleco: boolean;
    indDni: boolean;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}