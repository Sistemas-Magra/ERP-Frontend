import { Component, OnInit } from '@angular/core';
import { ProtocoloService } from '../protocolo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-protocolo-prueba',
  templateUrl: './listado-protocolo-prueba.component.html',
  styleUrls: ['./listado-protocolo-prueba.component.css']
})
export class ListadoProtocoloPruebaComponent implements OnInit {

  listado: any[];

  clFilter: string;
  otFilter: string;
  prFilter: string;
  feFilter: string;

  validarFila: number = -1;

  constructor(
    private protocoloService: ProtocoloService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buscar();
  }

  setFila(i: number) {
    this.validarFila = i;
  }

  nuevo() {
    this.router.navigate([`produccion/protocolo-prueba/0`])
  }

  goToDetalle(id: number) {
    this.router.navigate([`produccion/protocolo-prueba/${id}`])
  }

  buscar() {
    this.protocoloService.getListado(this.clFilter, this.otFilter, this.prFilter, this.feFilter).subscribe({
      next: res => {
        this.listado = res;
      }
    })

  }

}
