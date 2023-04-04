import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ParametroService } from 'src/app/auxiliar/parametro.service';
import { ContratoService } from '../../contrato.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-mostrar-contrato',
  templateUrl: './modal-mostrar-contrato.component.html',
  styleUrls: ['./modal-mostrar-contrato.component.css']
})
export class ModalMostrarContratoComponent implements OnInit {

  datos: any;

  meses: any[] = [
    {id: 1, nombre: 'Enero'},
    {id: 2, nombre: 'Febrero'},
    {id: 3, nombre: 'Marzo'},
    {id: 4, nombre: 'Abril'},
    {id: 5, nombre: 'Mayo'},
    {id: 6, nombre: 'Junio'},
    {id: 7, nombre: 'Julio'},
    {id: 8, nombre: 'Agosto'},
    {id: 9, nombre: 'Setiembre'},
    {id: 10, nombre: 'Octubre'},
    {id: 11, nombre: 'Noviembre'},
    {id: 12, nombre: 'Diciembre'}
  ];

  mesSeleccionado: any;

  anios: any[] = [];
  anioSeleccionado: any;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private parametroService: ParametroService,
    private contratoService: ContratoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.mesSeleccionado = this.meses.find(m => m.id == (new Date()).getMonth() + 1);

    this.anios.push({anio: (new Date()).getFullYear() - 4});
    this.anios.push({anio: (new Date()).getFullYear() - 3});
    this.anios.push({anio: (new Date()).getFullYear() - 2});
    this.anios.push({anio: (new Date()).getFullYear() - 1});
    this.anios.push({anio: (new Date()).getFullYear()});

    this.anioSeleccionado = this.anios[4];

    this.mostrarDatos()
  }

  mostrarDatos() {
    
    this.contratoService.getDatosContrato(this.config.data.id, this.mesSeleccionado.id, this.anioSeleccionado.anio).subscribe({
      next: res => {
        if(!res.sueldo) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:'El empleado no tiene un contrato vigente en esta fecha.'})
        } 
        this.datos = res;
      }
    })
  }

  close() {
    this.ref.close();
  }

}
