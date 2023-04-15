import { Distrito } from "./distrito";

export class Provincia {
    id: number;
    nombre: string;
    ubigeo: string;
    ubigeoSunat: string;
    distritos: Distrito[];
}