import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenTrabajoService } from '../../orden-trabajo.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-avance',
  templateUrl: './modal-avance.component.html',
  styleUrls: ['./modal-avance.component.css']
})
export class ModalAvanceComponent implements OnInit {

  listado: any[];

  validarFila: number = -1;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private ordenTrabajoService: OrdenTrabajoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.ordenTrabajoService.getListadoProducto(this.config.data.id).subscribe({
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

  close() {
    this.ref.close();
  }

  selectRow(i: number) {
    this.validarFila = i;
  }

}
