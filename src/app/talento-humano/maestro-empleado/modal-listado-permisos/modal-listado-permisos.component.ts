import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PermisoService } from '../../permiso.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-listado-permisos',
  templateUrl: './modal-listado-permisos.component.html',
  styleUrls: ['./modal-listado-permisos.component.css']
})
export class ModalListadoPermisosComponent implements OnInit {

  permisos: any[]

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private permisoService: PermisoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.permisoService.getByUserId(this.config.data.id).subscribe({
      next: res => {
        this.permisos = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  close() {
    this.ref.close();
  }

}
