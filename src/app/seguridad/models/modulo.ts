import { SubModulo } from "./sub-modulo";

export class Modulo {
    id: number;
    nombre: string;
    icon: string;

    subModulos: SubModulo[];
    abierto: boolean = false;
}