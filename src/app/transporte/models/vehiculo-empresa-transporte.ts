import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class VehiculoEmpresaTransporte {
    id: number;
    placaDelantera: string;
    placaTrasera: string;
    tipoVehiculo: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}