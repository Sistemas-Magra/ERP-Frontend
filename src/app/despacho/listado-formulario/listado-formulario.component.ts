import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormularioService } from '../formulario.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-listado-formulario',
  templateUrl: './listado-formulario.component.html',
  styleUrls: ['./listado-formulario.component.css']
})
export class ListadoFormularioComponent implements OnInit {

  listado: any[] = [];

  fechaFilterDate: Date;
  fechaFilter: string;
  clienteFilter: string;
  pedidoFilter: string;

  fila: number = -1;

  constructor(
    private router: Router,
    private formularioService: FormularioService,
    private pipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.buscar();
  }

  buscar() {

    this.formularioService.listado(this.fechaFilter, this.clienteFilter, this.pedidoFilter).subscribe({
      next: res => {
        this.listado = res;
      }
    })

  }

  setFecha(event) {
    this.fechaFilter = this.pipe.transform(event, 'yyyy-MMM-dd');
    this.buscar();
  }

  clearFecha(event) {
    if(this.fechaFilterDate) {
      this.fechaFilter = this.pipe.transform(this.fechaFilterDate, 'yyyy-MMM-dd');
      this.buscar();
    } else if(event.target.value == '') {
      this.fechaFilter = null;
      this.buscar();
    }
  }

  setPedido(event){

    this.formularioService.listado(this.fechaFilter, this.clienteFilter, event.target.value).subscribe({
      next: res => {
        this.listado = res;
      }
    })

  }

  setCliente(event) {

    this.formularioService.listado(this.fechaFilter, event.target.value, this.pedidoFilter).subscribe({
      next: res => {
        this.listado = res;
      }
    })

  }

  nuevo() {
    this.router.navigate(['/despacho/registro-formulario/0'])
  }

  irDetalle(id: number) {
    this.router.navigate([`/despacho/registro-formulario/${id}`])
  }

}
