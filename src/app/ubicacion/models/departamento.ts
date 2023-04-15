import { Provincia } from "./provincia";

export class Departamento {
    id: number;
    nombre: string;
    ubigeo: string;
    ubigeoSunat: string;
    provincias: Provincia[];
}