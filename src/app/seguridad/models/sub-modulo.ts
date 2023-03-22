import { Menu } from "./menu";
import { Modulo } from "./modulo";

export class SubModulo {
    id: number;
    nombre: string;
    icon: string;
    modulo: Modulo;
    menus: Menu[];
    abierto: boolean = false;
}