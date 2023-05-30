import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CaracteristicaService } from 'src/app/seguridad-trabajo/caracteristica.service';
import { CondicionService } from 'src/app/seguridad-trabajo/condicion.service';
import { CaracteristicaReporte } from 'src/app/seguridad-trabajo/models/caracteristica-reporte';
import { CondicionReporte } from 'src/app/seguridad-trabajo/models/condicion-reporte';

@Component({
  selector: 'app-modal-agregar-acto-condicion',
  templateUrl: './modal-agregar-acto-condicion.component.html',
  styleUrls: ['./modal-agregar-acto-condicion.component.css']
})
export class ModalAgregarActoCondicionComponent implements OnInit {

  ind:number;

  newCondicion: CondicionReporte = new CondicionReporte();
  newActo: CaracteristicaReporte = new CaracteristicaReporte();

  constructor(
    private ref: DynamicDialogRef,
    private conf: DynamicDialogConfig,
    private messageService: MessageService,
    private condicionService: CondicionService,
    private caracteristicaService: CaracteristicaService
  ) { }

  ngOnInit(): void {
    this.ind = this.conf.data.ind;
  }

  guardar() {
    if(this.ind == 1 && (!this.newCondicion.nombre || this.newCondicion.nombre.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el nombre.'})
      return;
    }

    if(this.ind == 2 && (!this.newActo.nombre || this.newActo.nombre.length == 0)) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar el nombre.'})
      return;
    }

    if(this.ind == 1) {
      this.condicionService.create(this.newCondicion).subscribe({
        next: res => {
          this.ref.close(res.condicion);
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
          }
        }
      })
    } else if(this.ind == 2) {
      this.caracteristicaService.create(this.newActo).subscribe({
        next: res => {
          this.ref.close(res.caracteristica);          
        }, error: err => {
          if(err.status == 409) {
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
          } else {
            this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
          }
        }
      })
    }

  }

  close() {
    this.ref.close();
  }

}
