import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/seguridad/auth.service';
import { EmpleadoService } from '../../empleado.service';
import { Permiso } from '../../models/permiso';

@Component({
  selector: 'app-modal-registro-permisos',
  templateUrl: './modal-registro-permisos.component.html',
  styleUrls: ['./modal-registro-permisos.component.css']
})
export class ModalRegistroPermisosComponent implements OnInit {

  permiso: Permiso = new Permiso();

  blnCargando: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private empleadoService: EmpleadoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.permiso.fechaInicio = new Date();
    this.permiso.fechaFin = new Date();
  }
  
  close() {
    this.ref.close();
  }

  guardar() {

    if(!this.permiso.fechaInicio) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la fecha de inicio de permiso.'});
      return;
    }

    if(!this.permiso.fechaFin) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar la fecha fin de permiso.'});
      return;
    }

    this.permiso.fechaCrea = new Date();
    this.permiso.idUsuarioCrea = this.authService.usuario.id;

    this.blnCargando = true;
    this.empleadoService.registrarPermiso(this.permiso, this.config.data.id).subscribe({
      next: res => {
        this.blnCargando = false;
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Permiso registrado correctamente.'})
        this.ref.close();
      }, error: err => {
        this.blnCargando = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'Error al registrar permiso.'})
      }
    })
  }

}
