import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VacacionService } from '../../vacacion.service';
import { MessageService } from 'primeng/api';

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
    private vacacionService: VacacionService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.vacacionService.getByUserId(this.config.data.id).subscribe({
      next: res => {
        this.vacaciones = res;
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
