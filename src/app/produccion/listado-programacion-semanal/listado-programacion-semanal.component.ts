import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgramacionSemanalService } from '../programacion-semanal.service';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalMaterialesRequeridosComponent } from './modal-materiales-requeridos/modal-materiales-requeridos.component';
import { ModalListadoVersionesComponent } from './modal-listado-versiones/modal-listado-versiones.component';

@Component({
  selector: 'app-listado-programacion-semanal',
  templateUrl: './listado-programacion-semanal.component.html',
  styleUrls: ['./listado-programacion-semanal.component.css']
})
export class ListadoProgramacionSemanalComponent implements OnInit {

  listado: any[];
  rowSelected: any;

  anioFilter: number;

  meses: any[] = [
    {id: 1,  nombre: 'Enero',     abrv: 'ENE'},
    {id: 2,  nombre: 'Febrero',   abrv: 'FEB'},
    {id: 3,  nombre: 'Marzo',     abrv: 'MAR'},
    {id: 4,  nombre: 'Abril',     abrv: 'ABR'},
    {id: 5,  nombre: 'Mayo',      abrv: 'MAY'},
    {id: 6,  nombre: 'Junio',     abrv: 'JUN'},
    {id: 7,  nombre: 'Julio',     abrv: 'JUL'},
    {id: 8,  nombre: 'Agosto',    abrv: 'AGO'},
    {id: 9,  nombre: 'Setiembre', abrv: 'SET'},
    {id: 10, nombre: 'Octubre',   abrv: 'OCT'},
    {id: 11, nombre: 'Noviembre', abrv: 'NOV'},
    {id: 12, nombre: 'Diciembre', abrv: 'DEC'},
  ];

  mesFilter: any;
  validarFila: number = -1;

  optionsRc: MenuItem[];
  ref: DynamicDialogRef;

  constructor(
    private router: Router,
    private programacionService: ProgramacionSemanalService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {

    this.optionsRc = [
      {label: 'Editar programación', icon: 'pi pi-fw pi-pencil', command: () => this.editar(this.rowSelected)},
      {label: 'Ver materiales programados', icon: 'pi pi-fw pi-eye', command: () => this.verMaterialesProgramados(this.rowSelected)},
      {label: 'Revisar avance', icon: 'pi pi-fw pi-eye', command: () => {}},
    ]

    this.buscar()
  }

  verVersiones(id: any) {
    this.ref = this.dialogService.open(ModalListadoVersionesComponent, {
      data: {
        id: id
      },
      width: '500px',
      height: '300px'
    })
  }

  verMaterialesProgramados(item: any) {
    this.ref = this.dialogService.open(ModalMaterialesRequeridosComponent, {
      data: {
        id: item.id
      },
      width: '1200px',
      height: '900px'
    })
  }

  buscar() {
    this.programacionService.getListado(this.anioFilter, this.mesFilter?.id).subscribe({
      next: res => {
        this.listado = res;
      }
    })
  }

  editar(item: any) {
    this.router.navigate([`/produccion/programacion-semanal/detalle/${item.id}`])
  }

  nuevo() {
    this.router.navigate(['/produccion/programacion-semanal/detalle/0'])
  }

  selectRow(i: number) {
    this.validarFila = i
  }

}