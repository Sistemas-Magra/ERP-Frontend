import { Component, OnInit } from '@angular/core';
import { Planta } from 'src/app/maestros/models/planta';
import { PlantaService } from 'src/app/maestros/planta.service';
import { ProduccionRegistroDesencrofado } from '../../models/produccion-registro-desencrofado';
import { OrdenTrabajoService } from '../../orden-trabajo.service';
import { MessageService } from 'primeng/api';
import { OrdenTrabajo } from '../../models/orden-trabajo';
import { FormatosService } from '../../formatos.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';

@Component({
  selector: 'app-formato-desencrofado',
  templateUrl: './formato-desencrofado.component.html',
  styleUrls: ['./formato-desencrofado.component.css']
})
export class FormatoDesencrofadoComponent implements OnInit {

  listado: ProduccionRegistroDesencrofado[] = [];

  fecha: Date = new Date();
  responsable: string;

  plantas: Planta[];
  plantaSeleccionada: Planta;

  listadoOrdenesTrabajo: OrdenTrabajo[];
  listadoInconformidadSelect: TablaAuxiliarDetalle[];
  inconformidadesSeleccionadas: TablaAuxiliarDetalle[] = [];

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
    this.auxiliarService.getListSelect('INCDES').subscribe({
      next: res => {
        this.listadoInconformidadSelect = res;
      }
    })
    this.plantaService.getPlantasActivas().subscribe({
      next: res => {
        this.plantas = res;
      }
    })
  }

  setListado() {
    this.formatoService.getListadoFormato(this.plantaSeleccionada.id, 5).subscribe({
      next: res => {
        if(res.listado) {
          let list: ProduccionRegistroDesencrofado[] = res.listado

          list.forEach(des => {
            let listInc: number[] = JSON.parse(des.inconformidadProduccion);

            des.abrvsInconformidad = this.listadoInconformidadSelect.filter(inc => listInc.includes(inc.tablaAuxiliarDetalleId.id)).map(inc => inc.abreviatura).join(', ');
            des.nombresInconformidad = this.listadoInconformidadSelect.filter(inc => listInc.includes(inc.tablaAuxiliarDetalleId.id)).map(inc => inc.nombre).join(', ');
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
    
    let mezcla: ProduccionRegistroDesencrofado = new ProduccionRegistroDesencrofado();

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
    let des: ProduccionRegistroDesencrofado = this.listado[i];

    if(!des.ordenTrabajo || typeof(des.ordenTrabajo) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar una orden de trabajo del autocompletado.'})
      return;
    }

    if(!des.ordenTrabajoDetalle || typeof(des.ordenTrabajoDetalle) == "string") {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Debe seleccionar un producto del autocompletado.'})
      return;
    }

    if(!des.indConforme && (!des.observacion || des.observacion.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Error', detail: 'Para una salida inconforme debe ingresar una observación.'})
      return;
    }

    des.inconformidadProduccion = JSON.stringify(this.inconformidadesSeleccionadas.map(inc => inc.tablaAuxiliarDetalleId.id));

    this.formatoService.saveRegistroDesencrofado(this.plantaSeleccionada.id, des).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro de tubos y pines guardado correctamente.'});
        this.blnFilaAniadidaSinGuardar = false;
        this.inconformidadesSeleccionadas = [];
        this.validarFila = -1;
        this.setListado();
      }
    })

  }

}
