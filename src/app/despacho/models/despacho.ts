import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Formulario } from "./formulario";

export class Despacho {
    id: number;
    fecha: Date;
    estado: TablaAuxiliarDetalle;
    formularios: Formulario[];
}