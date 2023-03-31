import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VacacionService } from '../../vacacion.service';

@Component({
  selector: 'app-modal-listado-vacaciones',
  templateUrl: './modal-listado-vacaciones.component.html',
  styleUrls: ['./modal-listado-vacaciones.component.css']
})
export class ModalListadoVacacionesComponent implements OnInit {

  vacaciones: any[]

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private vacacionService: VacacionService
  ) { }

  ngOnInit(): void {
    this.vacacionService.getByUserId(this.config.data.id).subscribe({
      next: res => {
        this.vacaciones = res;
      }
    })
  }

  close() {
    this.ref.close();
  }

}
