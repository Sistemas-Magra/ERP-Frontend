import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { TablaAuxiliarDetalleId } from 'src/app/auxiliar/models/tabla-auxiliar-detalle-id';
import { ModalSiNoComponent } from '../modal-si-no/modal-si-no.component';

@Component({
  selector: 'app-modal-agregar-auxiliar',
  templateUrl: './modal-agregar-auxiliar.component.html',
  styleUrls: ['./modal-agregar-auxiliar.component.css']
})
export class ModalAgregarAuxiliarComponent implements OnInit {

  newAux: TablaAuxiliarDetalle = new TablaAuxiliarDetalle();

  id: number;
  codAux: string;

  ref: DynamicDialogRef;

  constructor(
    private config: DynamicDialogConfig,
    private dialogService: DialogService,
    private dialogRef: DynamicDialogRef,
    private auxiliarService: AuxiliarService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.newAux.tablaAuxiliarDetalleId = new TablaAuxiliarDetalleId()
    this.newAux.tablaAuxiliarDetalleId.id = this.config.data.id;

    this.auxiliarService.getByCodAux(this.config.data.codAux).subscribe({
      next: res => {
        this.newAux.tablaAuxiliarDetalleId.tablaAuxiliar = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.ref = null;
  }

  close() {
    this.dialogRef.close();
  }

  guardar() {
    if(!this.newAux.nombre || this.newAux.nombre.length == 0) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Debe ingresar un nombre.'});
      return;
    }

    this.ref = this.dialogService.open(ModalSiNoComponent, {
      data: {
        titulo: 'Confirmación de Creación',
        texto: '¿Desea generar el nuevo registro?',
        botonAceptacion: 'Sí',
        botonDeclinacion: 'No'
      },
      width: '400px',
      height: '160px'
    })

    this.ref.onClose.subscribe(resp => {
      if(resp.res == 1) {
        this.auxiliarService.create(this.newAux).subscribe({
          next: response => {
            this.dialogRef.close({response});
          }, error: err => {
            if(err.status == 409) {
              this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
            } else {
              this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
            }
          }
        })
      }
    })
  }

}
