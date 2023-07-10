import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../formulario.service';
import { Formulario } from '../models/formulario';
import { FormularioDetalle } from '../models/formulario-detalle';
import { Despacho } from '../models/despacho';
import { DespachoService } from '../despacho.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalReasignacionFormulariosComponent } from './modal-reasignacion-formularios/modal-reasignacion-formularios.component';
import * as FileSaver from 'file-saver';
import { OrdenTrabajoDetalle } from 'src/app/produccion/models/orden-trabajo-detalle';
import { ModalSiNoComponent } from 'src/app/commons/modal-si-no/modal-si-no.component';
import { ModalDatosDespachoComponent } from './modal-datos-despacho/modal-datos-despacho.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-configuracion-despachos',
  templateUrl: './configuracion-despachos.component.html',
  styleUrls: ['./configuracion-despachos.component.css']
})
export class ConfiguracionDespachosComponent implements OnInit {

  fechaFilter: Date = new Date();

  despacho: Despacho;

  formularios: Formulario[];
  listadoDetalle: FormularioDetalle[];

  ordenesTrabajoAutocomplete: OrdenTrabajoDetalle[];

  estadoDespachoId: number;
  estadoFormularioSeleccionadoId: number;

  fila: number = -1;
  filaProducto: number = -1;

  ref: DynamicDialogRef;

  constructor(
    private despachoService: DespachoService,
    private dialogService: DialogService,
    private formularioService: FormularioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getFormularios();
  }

  getFormularios() {
    this.despachoService.getByFecha(this.fechaFilter).subscribe({
      next: res => {
        this.despacho = res;
        if(this.despacho) {
          this.formularios = this.despacho.formularios;
          this.estadoDespachoId = this.despacho.estado.tablaAuxiliarDetalleId.id;
        }
      }
    })
  }

  setFecha(event) {
    this.despachoService.getByFecha(event).subscribe({
      next: res => {
        this.despacho = res;
        if(this.despacho) {
          this.formularios = this.despacho.formularios;
          this.estadoDespachoId = this.despacho.estado.tablaAuxiliarDetalleId.id;
          this.filaProducto = -1;
        }
      }
    })
  }

  setFormulario(i: number){
    this.fila = i;
    this.listadoDetalle = JSON.parse(JSON.stringify(this.formularios[i].detalle.filter(d => d.cantidad > 0)));
    this.estadoFormularioSeleccionadoId = this.formularios[i].estado.tablaAuxiliarDetalleId.id;
  }

  asignar() {
    if(this.formularios.find(f => !f.indAsignacion)) {
      let formsNoAsignados: Formulario[] = this.formularios.filter(f => !f.indAsignacion)

      this.ref = this.dialogService.open(ModalReasignacionFormulariosComponent, {
        data: {
          formsNoAsignados: JSON.parse(JSON.stringify(formsNoAsignados))
        },
        width:'700px',
        height: '400px'
      });

      this.ref.onClose.subscribe({
        next: forms => {
          forms.forEach(fm => {
            this.formularios.find(f => f.id == fm.id).fecha = fm.fecha;
          })

          this.formularioService.updateAsignacion(this.formularios, this.despacho.id).subscribe({
            next: res => {
              console.log(res);
            }
          })
        }
      })
    } else {

      this.formularioService.updateAsignacion(this.formularios, this.despacho.id).subscribe({
        next: res => {
          console.log(res);
        }
      })

    }
  }

  guiaRemision() {
    if(this.formularios[this.fila].estado.tablaAuxiliarDetalleId.id != 3) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Solo puede emitir guias de remisión en formularios revisados.'});
      return;
    }

    this.ref = this.dialogService.open(ModalSiNoComponent, {
      data: {
        titulo: 'Emitir guía de remisión',
        texto: 'Al emitir la guía ya no podrá cambiar los datos del formulario. ¿Desea continuar?',
        botonAceptacion: 'Sí',
        botonDeclinacion: 'No'
      }
    });

    this.ref.onClose.subscribe({
      next: res => {
        if(res.res == 1) {

          let ref = this.dialogService.open(ModalDatosDespachoComponent, {
            data: {
              formulario: JSON.parse(JSON.stringify(this.formularios[this.fila]))
            },
            width: '500px',
            height: '300px'
          })

          /*this.formularioService.generarRemision(this.formularios[this.fila]).subscribe({
            next: (blob: Blob) => {
              FileSaver.saveAs(blob, `remision.pdf`);
              this.getFormularios()
            }, error: err => {
              if(err.status == 409) {
                //this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'No hay protocolos de pruebas realizados en el pedido seleccionado.'});
              } else {
                //this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje});
              }
            }
          })*/

        }
      }
    })
  }

  guiaBorrador() {
    this.listadoDetalle.forEach(d => {
      if(d.ordenTrabajoDetalle && d.cantidad > 0) {
        this.formularios[this.fila].detalle.find(det => det.ordenTrabajoDetalle.id == d.ordenTrabajoDetalle.id).cantidad = d.cantidad;
      }
    })

    this.formularioService.generarProvisional(this.formularios[this.fila]).subscribe({
      next: (blob: Blob) => {
        FileSaver.saveAs(blob, `provisional.pdf`);
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'No hay protocolos de pruebas realizados en el pedido seleccionado.'});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:err.error.mensaje});
        }
      }
    })


  }

  setProducto(event: OrdenTrabajoDetalle, i) {
    //console.log(event)
    if(this.listadoDetalle.find((d, j) => d.id == event.id && j != i)) {
      this.listadoDetalle[i].ordenTrabajoDetalle = null;
    } else {
      this.listadoDetalle[i].cantidadDisponible = event.cantidadProducida - event.cantidadDespachada;
      this.listadoDetalle[i].cantidadPendDespacho = event.ordenVentaDetalle.cantidad - event.cantidadDespachada;
      this.listadoDetalle[i].cantidadSolicitada = event.ordenVentaDetalle.cantidad;
    }
  }

  searchDetalle(event) {
    let search: string = event.query
    this.ordenesTrabajoAutocomplete = this.formularios[this.fila].detalle.filter(d => d.ordenTrabajoDetalle.ordenVentaDetalle.producto.nombre.toUpperCase().includes(search.toUpperCase())).map(d => d.ordenTrabajoDetalle)
  }

  addDetalle() {
    this.listadoDetalle.push(new FormularioDetalle());
  }

  quitar(i: number) {
    this.listadoDetalle = this.listadoDetalle.filter((d, j) => j != i);
  }

}
