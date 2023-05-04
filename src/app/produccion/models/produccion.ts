import { ProduccionPlanta } from "./produccion-planta";

export class Produccion {
    id: number;
    fecha: Date;
    detallePlanta: ProduccionPlanta[] = [];
}