import { Planta } from "src/app/maestros/models/planta";
import { ProduccionPlantaPoste } from "./produccion-planta-poste";

export class ProduccionPlanta {
    id: number;
    planta: Planta;
    indProcesoCalidad: boolean;
    detallePostes: ProduccionPlantaPoste[] = [];
}