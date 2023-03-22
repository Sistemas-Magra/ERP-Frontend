import { OrdenVentaDetalle } from "src/app/ventas/models/orden-venta-detalle";
import { ConfiguracionUtensilios } from "./configuracion-utensilios";
import { FormularioPoste } from "./formulario-poste";

export class FormularioDetalle {
    id: number;
    cantidad: number;
    ordenVentaDetalle: OrdenVentaDetalle;
    configuracionUtensilios: ConfiguracionUtensilios;
    postes: FormularioPoste[];
    idUsuarioCrea: number;
    idUsuarioModifica: number;
    fechaCrea: Date;
    fechaModifica: Date;
}