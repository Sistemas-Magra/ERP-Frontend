import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenTrabajoService } from '../../orden-trabajo.service';
import { ProduccionService } from '../../produccion.service';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-datos-acta-conformidad',
  templateUrl: './modal-datos-acta-conformidad.component.html',
  styleUrls: ['./modal-datos-acta-conformidad.component.css']
})
export class ModalDatosActaConformidadComponent implements OnInit {

  listado: any[] = [];
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  
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
      }
    })
  }

  generar() {
    if(!this.fechaInicio) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar la fecha en la que va a citar al cliente.'});
      return;
    }

    if(this.listado.find(p => p.indUso && !p.cantidad)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la cantidad de productos en los espacios faltantes.'});
      return;
    }

    let list: any[] = this.listado.filter(p => p.indUso);

    let fechaInicio: string = `${this.pipe.transform(this.fechaInicio, 'yyyyMMMMdd', 'es').toUpperCase()}pryx${this.pipe.transform(this.fechaInicio, 'hh:mm a', 'es').toUpperCase()}`
    let fechaFin: string = `${this.pipe.transform(this.fechaFin, 'yyyyMMMMdd', 'es').toUpperCase()}pryx${this.pipe.transform(this.fechaFin, 'hh:mm a', 'es').toUpperCase()}`

    let sedeId: number = Number(localStorage.getItem('sede_id'));

    this.produccionService.descargarActaConformidad(sedeId, this.config.data.id, fechaInicio, fechaFin, list).subscribe({
      next: (blob: Blob) => {
        FileSaver.saveAs(blob, 'archivo5.docx');
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