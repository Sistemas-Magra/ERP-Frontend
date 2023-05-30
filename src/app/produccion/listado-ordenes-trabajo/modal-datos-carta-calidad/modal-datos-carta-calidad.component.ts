import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenTrabajoService } from '../../orden-trabajo.service';
import { ProduccionService } from '../../produccion.service';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-datos-carta-calidad',
  templateUrl: './modal-datos-carta-calidad.component.html',
  styleUrls: ['./modal-datos-carta-calidad.component.css']
})
export class ModalDatosCartaCalidadComponent implements OnInit {

  listado: any[] = [];
  fecha: Date = new Date();
  
  listDiasSemana: any[] = [
    {id: 1, nombre: 'Lunes'},
    {id: 2, nombre: 'Martes'},
    {id: 3, nombre: 'Miércoles'},
    {id: 4, nombre: 'Jueves'},
    {id: 5, nombre: 'Viernes'},
    {id: 6, nombre: 'Sábado'},
    {id: 7, nombre: 'Domingo'},
  ]

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private ordenTrabajoService: OrdenTrabajoService,
    private produccionService: ProduccionService,
    private messageService: MessageService,
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.ordenTrabajoService.getProductosFromOrdenTrabajo(this.config.data.id).subscribe({
      next: res => {
        this.listado = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  generar() {
    if(!this.fecha) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar la fecha en la que va a citar al cliente.'});
      return;
    }

    if(this.listado.find(p => p.indUso && !p.cantidad)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cantidad de productos en los espacios faltantes.'});
      return;
    }

    let list: any[] = this.listado.filter(p => p.indUso);

    let diaStr: string = this.listDiasSemana.find(d => d.id == this.fecha.getDay()).nombre;

    let fecha: string = `${diaStr}pryx${this.pipe.transform(this.fecha, 'yyyyMMMMdd', 'es').toUpperCase()}pryx${this.pipe.transform(this.fecha, 'hh:mm a', 'es').toUpperCase()}`

    let sedeId: number = Number(localStorage.getItem('sede_id'))

    this.produccionService.descargarControlCalidad(sedeId, this.config.data.id, fecha, list).subscribe({
      next: (blob: Blob) => {
        FileSaver.saveAs(blob, `Carta Calidad ${this.config.data.pedido}-${this.config.data.cliente}.docx`);
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  setUso(i: number) {
    let item = this.listado[i];

    item.indUso?'':item.cantidad=null;
  }

  close() {
    this.ref.close();
  }

}
