import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";

export class VehiculoEmpresaTransporte {
    id: number;
    marca: string;
    placaDelantera: string;
    placaTrasera: string;
    stringBusqueda: string;
    tipoVehiculo: TablaAuxiliarDetalle;
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}