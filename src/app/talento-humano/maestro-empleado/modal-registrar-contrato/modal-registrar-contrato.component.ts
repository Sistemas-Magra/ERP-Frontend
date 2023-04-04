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

  validar(): boolean {
    if(!this.empleado.entidadFondos) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una entidad de fondos.'});
      return false;
    }
    
    if(!this.contrato.fechaInicioVigencia) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una fecha de inicio de vigencia del contrato.'});
      return false;
    }

    if(!this.contrato.fechaFinVigencia) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe seleccionar una fecha fin de vigencia del contrato.'});
      return false;
    }

    if(!this.contrato.sueldo) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe el sueldo del personal.'});
      return false;
    }

    return true;
  }

  registrar() {
    if(!this.validar()) {
      return;
    }

    this.contrato.empleado.indEstaEnPlanilla = true;
    this.empleadoService.registrarContrato(this.contrato).subscribe({
      next: res => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Contrato registrado correctamente.'})
        this.ref.close()
      }
    })
  }

  validarCheck(id: number) {
    if(id == 1) {
      this.empleado.cobrarComisionAfp = false;
    }
  }

}
