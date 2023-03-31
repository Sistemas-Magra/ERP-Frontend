import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EntidadFondosService } from 'src/app/maestros/entidad-fondos.service';
import { EmpleadoService } from '../../empleado.service';
import { Contrato } from '../../models/contrato';
import { Empleado } from '../../models/empleado';
import { EntidadFondos } from '../../models/entidad-fondos';

@Component({
  selector: 'app-modal-registrar-contrato',
  templateUrl: './modal-registrar-contrato.component.html',
  styleUrls: ['./modal-registrar-contrato.component.css']
})
export class ModalRegistrarContratoComponent implements OnInit {

  empleado: Empleado = new Empleado();
  contrato: Contrato = new Contrato();

  entidadFondos: EntidadFondos[];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private empleadoService: EmpleadoService,
    private entidadFondosService: EntidadFondosService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.empleadoService.getEmpleadoById(this.config.data.id).subscribe({
      next: res => {
        this.empleado = res.empleado;
        this.contrato.empleado = this.empleado;
      }
    })

    this.entidadFondosService.getAll().subscribe({
      next: res => {
        this.entidadFondos = res;
      }
    })
  }

  close() {
    this.ref.close();
  }

  registrar() {
    this.empleadoService.registrarContrato(this.contrato).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Contrato registrado correctamente.'})
      }
    })
  }

}
