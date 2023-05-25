import { TablaAuxiliarDetalle } from "src/app/auxiliar/models/tabla-auxiliar-detalle";
import { Distrito } from "src/app/ubicacion/models/distrito";

export class Sede {
    id: number;
	nombre: string;
	direccion: string;
	referencia: string;
	distrito: Distrito;
	estado: TablaAuxiliarDetalle;
}