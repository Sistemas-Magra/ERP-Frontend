import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgramacionSemanalService } from '../../programacion-semanal.service';
import { Router } from '@angular/router';
import { Planta } from 'src/app/maestros/models/planta';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-listado-versiones',
  templateUrl: './modal-listado-versiones.component.html',
  styleUrls: ['./modal-listado-versiones.component.css']
})
export class ModalListadoVersionesComponent implements OnInit {

  listado: any[];
  plantas: Planta[];

  constructor(
    private ref: DynamicDialogRef,
    private config:DynamicDialogConfig,
    private programacionService: ProgramacionSemanalService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.programacionService.getListadoVersiones(this.config.data.id).subscribe({
      next: res => {
        this.listado = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  verVersion(id: number) {
    console.log('a')
    let url = this.router.serializeUrl(this.router.createUrlTree([`/produccion/visor/programacion-semanal/version/${id}`]));
    window.open(url, '_blank');
  }

  close() {
    this.ref.close();
  }

}
