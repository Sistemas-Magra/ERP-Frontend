import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { CotizacionService } from '../cotizacion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {

  blnEditandoCreando: boolean = false;
  blnCargando: boolean = false;

  clienteFilter: string;
  fechaDesdeFilter: string;
  fechaHastaFilter: string;
  fechaRango: Date[];
  indVerAnuladosFilter: boolean;

  cotizaciones: any[] = [];

  rowSelected: any;
  optionsRc: MenuItem[];

  totalRecords: number;

  constructor(
    private router: Router,
    private pipe: DatePipe,
    private cotizacionService: CotizacionService
  ) { }

  ngOnInit(): void {
    this.optionsRc = [
      {label: 'Ver Detalle', icon: 'pi pi-fw pi-eye', command: () => this.irDetalle(this.rowSelected)},
      {label: 'Registrar Venta', icon: 'pi pi-fw pi-money-bill', command: () => this.irDetalleVenta(this.rowSelected)},
    ]
    this.filtrar();
  }

  irDetalle(item: any) {
    
  }

  irDetalleVenta(item: any) {
    this.router.navigate([`/cotizacion/detalle/${item.id}`])
  }

  filtrar() {
    this.cotizacionService.getListadoMaestro(this.clienteFilter, this.fechaDesdeFilter, this.fechaHastaFilter, (this.indVerAnuladosFilter?1:0)).subscribe({
      next: res => {
        this.totalRecords = res[0]?.totalRecords
        this.cotizaciones = res;
      }
    })
  }

  getFechas(){
    this.fechaDesdeFilter = this.pipe.transform(this.fechaRango[0], 'yyyy-MM-dd');
    this.fechaHastaFilter = this.pipe.transform(this.fechaRango[1], 'yyyy-MM-dd')
    this.filtrar();
  }

  nuevo() {
    this.router.navigate(['/ventas/cotizacion/detalle/0'])
  }

  loadEmpleados(event: LazyLoadEvent) {
    
  }

}