import { Planta } from "src/app/maestros/models/planta";
import { ProduccionPlantaPoste } from "./produccion-planta-poste";
import { ProduccionRegistroMezcla } from "./produccion-registro-mezcla";
import { ProduccionRegistroEstructura } from "./produccion-registro-estructura";
import { ProduccionRegistroTubosPines } from "./produccion-registro-tubos-pines";
import { ProduccionRegistroCentrifugado } from "./produccion-registro-centrifugado";
import { ProduccionRegistroDesencrofado } from "./produccion-registro-desencrofado";
import { ProduccionRegistroCurado } from "./produccion-registro-curado";

export class ProduccionPlanta {
    id: number;
    planta: Planta;
    indProcesoCalidad: boolean;
    detallePostes: ProduccionPlantaPoste[] = [];
    detalleMezcla: ProduccionRegistroMezcla[] = [];
    detalleEstructura: ProduccionRegistroEstructura[] = [];
    detalleTubosPines: ProduccionRegistroTubosPines[] = [];
    detalleCentrifugado: ProduccionRegistroCentrifugado[] = [];
    detalleDesencrofado: ProduccionRegistroDesencrofado[] = [];
    detalleCurado: ProduccionRegistroCurado[] = [];
}