import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PermisoService } from '../../permiso.service';

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
    private permisoService: PermisoService
  ) { }

  ngOnInit(): void {
    this.permisoService.getByUserId(this.config.data.id).subscribe({
      next: res => {
        this.permisos = res;
      }
    })
  }

  close() {
    this.ref.close();
  }

}
