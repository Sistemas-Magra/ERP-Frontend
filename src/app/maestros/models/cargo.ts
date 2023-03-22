import { RequisitoCargo } from "./requisito-cargo";

export class Cargo {
    id: number;
    nombre: string;
    requisitos: RequisitoCargo[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}