import { Cargo } from "src/app/maestros/models/cargo";
import { RequisitoCampania } from "./requisito-campania";

export class CampaniaBusquedaPersonal {
    id: number;
    cantidad: number;
    cargo: Cargo;
    requisitos: RequisitoCampania[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}