import { OrdenTrabajo } from "src/app/produccion/models/orden-trabajo";
import { FormularioDetalle } from "./formulario-detalle";
import { EmpresaTransporte } from "src/app/transporte/models/empresa-transporte";
import { VehiculoEmpresaTransporte } from "src/app/transporte/models/vehiculo-empresa-transporte";
import { ConductorEmpresaTransporte } from "src/app/transporte/models/conductor-empresa-transporte";
import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class Formulario {

	id: number;
	fecha: Date;
	nroRemision: string;
	horaInicio: Date;
	horaFin: Date;
	destino: string;
	cantReglas: number;	
	cantTacos: number;	
	cantClavos: number;	
	indVerificacionSuperficie: boolean;	
	indConfListones: boolean;	
	indConfTacos: boolean;	
	indConfClavos: boolean;	
	cantRealListones: number;	
	cantRealTacos: number;	
	cantRealClavos: number;	
	indSctr: boolean;	
	indCasco: boolean;	
	indZapato: boolean;	
	indChaleco: boolean;	
	indDni: boolean;	
	observacion: number;	
	ordenTrabajo: OrdenTrabajo;	
	empresaTransporte: EmpresaTransporte;	
	vehiculo: VehiculoEmpresaTransporte;    
	conductor: ConductorEmpresaTransporte;
	estado: TablaAuxiliarDetalle;
	motivoTraslado: TablaAuxiliarDetalle;
	detalle: FormularioDetalle[] = [];
	
	indAsignacion: boolean;
}