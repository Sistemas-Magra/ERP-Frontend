import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrdenTrabajoService } from '../../orden-trabajo.service';

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
    private ordenTrabajoService: OrdenTrabajoService
  ) { }

  ngOnInit(): void {
    this.ordenTrabajoService.getListadoProducto(this.config.data.id).subscribe({
      next: res => {
        this.listado = res;
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
