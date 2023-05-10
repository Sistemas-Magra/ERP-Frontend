import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { FormatosService } from 'src/app/produccion/formatos.service';
import { OrdenTrabajo } from 'src/app/produccion/models/orden-trabajo';
import { ProduccionAccesorioRegistroAcabado } from 'src/app/produccion/models/produccion-accesorio-registro-acabado';
import { OrdenTrabajoService } from 'src/app/produccion/orden-trabajo.service';

@Component({
  selector: 'app-formato-acabado',
  templateUrl: './formato-acabado.component.html',
  styleUrls: ['./formato-acabado.component.css']
})
export class FormatoAcabadoComponent implements OnInit {

  listado: ProduccionAccesorioRegistroAcabado[] = [];

  fecha: Date = new Date();
  responsable: string;

  plantas: Planta[];
  plantaSeleccionada: Planta;

  listadoOrdenesTrabajo: OrdenTrabajo[];
  listadoAcabados: TablaAuxiliarDetalle[];
  acabadosSeleccionados: TablaAuxiliarDetalle[] = [];

  validarFila: number = -1;
  blnFilaAniadidaSinGuardar: boolean = false;

  constructor(
    private plantaService: PlantaService,
    private messageService: MessageService,
    private ordenTrabajoService: OrdenTrabajoService,
    private auxiliarService: AuxiliarService,
    private formatoService: FormatosService,
  ) { }

  ngOnInit(): void {
    this.auxiliarService.getListSelect('TIPACB').subscribe({
      next: res => {
        this.listadoAcabados = res;
      }
    })
    this.plantaService.getPlantasActivas().subscribe({
      next: res => {
        this.plantas = res;
      }
    })
  }

  setListado() {
    this.formatoService.getListadoFormato(this.plantaSeleccionada.id, 10).subscribe({
      next: res => {
        if(res.listado) {
          let list: ProduccionAccesorioRegistroAcabado[] = res.listado

          list.forEach(des => {
            let listInc: number[] = JSON.parse(des.tiposAcabados);

            des.abrvsAcabado = this.listadoAcabados.filter(inc => listInc.includes(inc.tablaAuxiliarDetalleId.id)).map(inc => inc.abreviatura).join(', ');
            des.nombresAcabado = this.listadoAcabados.filter(inc => listInc.includes(inc.tablaAuxiliarDetalleId.id)).map(inc => inc.nombre).join(', ');
          })

          this.listado = list;
        } else {
          this.listado = [];
        }
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  asignarFila(i: number) {
    if(this.blnFilaAniadidaSinGuardar) {
      return;
    }
    
    this.validarFila = i;
  }

  addRegistro() {
    if(this.blnFilaAniadidaSinGuardar) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe terminar de guardar el registro para añadir otro.'})
      return;
    }
    
    let mezcla: ProduccionAccesorioRegistroAcabado = new ProduccionAccesorioRegistroAcabado();

    mezcla.indConforme = true;
    mezcla.responsable = this.responsable;

    this.validarFila = this.listado.length;
    this.blnFilaAniadidaSinGuardar = true;
    this.listado.push(mezcla);
  }

  ordenTrabajoAutocomplete(event) {
    this.ordenTrabajoService.autocomplete(event.query).subscribe({
      next: res => {
        this.listadoOrdenesTrabajo = res;
      },
      error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje})
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'Error al obtener información del servidor.'})
        }
      }
    })
  }

  setOrdenTrabajo(event, i: number) {
    this.listado[i].listadoAutocompleteAux = event.detalle;
  }

  findProducto(event, i: number) {
    let term: string = event.query;
    this.listado[i].listadoAutocompleteAux = this.listado[i].ordenTrabajo.detalle.filter(otd => otd.ordenVentaDetalle.producto.nombre.toUpperCase().includes(term.toUpperCase()))
  }

  guardar(i) {
    let acab: ProduccionAccesorioRegistroAcabado = this.listado[i];

    if(!acab.ordenTrabajo || typeof(acab.ordenTrabajo) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar una orden de trabajo del autocompletado.'})
      return;
    }

    if(!acab.ordenTrabajoDetalle || typeof(acab.ordenTrabajoDetalle) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar un producto del autocompletado.'})
      return;
    }

    if(!acab.indConforme && (!acab.observacion || acab.observacion.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Para una salida inconforme debe ingresar una observación.'})
      return;
    }

    acab.tiposAcabados = JSON.stringify(this.acabadosSeleccionados.map(inc => inc.tablaAuxiliarDetalleId.id));

    this.formatoService.saveRegistroAcabadoAccesorio(this.plantaSeleccionada.id, acab).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro de tubos y pines guardado correctamente.'});
        this.blnFilaAniadidaSinGuardar = false;
        this.acabadosSeleccionados = [];
        this.validarFila = -1;
        this.setListado();
      }
    })
  }

}
