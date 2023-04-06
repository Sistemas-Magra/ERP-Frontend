import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {

  blnEditandoCreando: boolean = false;
  blnCargando: boolean = false;

  cotizaciones: any[] = [];

  rowSelected: any;
  optionsRc: MenuItem[];

  totalRecords: number;

  constructor() { }

  ngOnInit(): void {
  }

  nuevo() {

  }

  loadEmpleados(event: LazyLoadEvent) {
    
  }

}