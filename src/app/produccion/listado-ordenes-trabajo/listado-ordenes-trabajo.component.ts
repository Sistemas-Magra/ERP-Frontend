import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OrdenTrabajoService } from '../orden-trabajo.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAvanceComponent } from './modal-avance/modal-avance.component';
import { ProduccionService } from '../produccion.service';
import * as FileSaver from 'file-saver'
import { ModalDatosCartaCalidadComponent } from './modal-datos-carta-calidad/modal-datos-carta-calidad.component';
import { ModalDatosActaConformidadComponent } from './modal-datos-acta-conformidad/modal-datos-acta-conformidad.component';

@Component({
  selector: 'app-listado-ordenes-trabajo',
  templateUrl: './listado-ordenes-trabajo.component.html',
  styleUrls: ['./listado-ordenes-trabajo.component.css']
})
export class ListadoOrdenesTrabajoComponent implements OnInit {

  listado: any[];

  optionsRc: MenuItem[] = [];
  rowSelected: any;

  validarFila: number = -1;

  ref: DynamicDialogRef

  constructor(
    private ordenTrabajoService: OrdenTrabajoService,
    private dialogService: DialogService,
    private produccionService: ProduccionService
  ) { }

  ngOnInit(): void {

    this.optionsRc = [
      {label: 'Generar Acta de conformidad', icon: 'pi pi-fw pi-file', command: () => this.descargarActaConformidad(this.rowSelected)},
      {label: 'Generar Carta de garantía', icon: 'pi pi-fw pi-file', command: () => this.descargarCartaGarantia(this.rowSelected)},
      {label: 'Generar Protocolo de prueba', icon: 'pi pi-fw pi-file', command: () => this.descargarProtocolos(this.rowSelected)},
      {label: 'Generar Carta de control de calidad', icon: 'pi pi-fw pi-file', command: () => this.descargarControlCalidad(this.rowSelected)},
    ];

    this.ordenTrabajoService.getListadoPedidos().subscribe({
      next: res => {
        this.listado = res;
      }
    })
  }

  descargarProtocolos(item: any) {
    this.produccionService.descargarProtocolos(item.orden_venta_id).subscribe({
      next: (blob: Blob) => {
        FileSaver.saveAs(blob, 'archivo5.xlsx');
      }
    })
  }

  descargarControlCalidad(item: any) {
    this.ref = this.dialogService.open(ModalDatosCartaCalidadComponent, {
      data:{
        id: item.orden_trabajo_id
      },
      width:'900px',
      height: '450px'
    })
  }

  descargarCartaGarantia(item: any) {
    let sedeId: number = Number(localStorage.getItem('sede_id'));
    this.produccionService.descargarCartaGarantia(sedeId, item.orden_trabajo_id).subscribe({
      next: (blob: Blob) => {
        FileSaver.saveAs(blob, 'archivo5.zip');
      }
    })
  }

  descargarActaConformidad(item: any) {
    this.ref = this.dialogService.open(ModalDatosActaConformidadComponent, {
      data:{
        id: item.orden_trabajo_id
      },
      width:'900px',
      height: '450px'
    })
  }

  selectRow(i: number) {
    this.validarFila = i;
  }

  verAvance(id: number) {
    console.log(id);
    this.ref = this.dialogService.open(ModalAvanceComponent, {
      data:{
        id
      },
      width:'900px',
      height: '450px'
    })
  }

  onRightClick(event: MouseEvent, i: number) {
    event.preventDefault(); 
    this.validarFila = i;
  }
}