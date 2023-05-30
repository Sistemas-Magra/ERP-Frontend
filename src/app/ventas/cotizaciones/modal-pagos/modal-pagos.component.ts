import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { Pago } from '../../models/pago';
import { AuthService } from 'src/app/seguridad/auth.service';
import { Usuario } from 'src/app/seguridad/models/usuario';
import { CotizacionService } from '../../cotizacion.service';
import { PagoService } from '../../pago.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-pagos',
  templateUrl: './modal-pagos.component.html',
  styleUrls: ['./modal-pagos.component.css']
})
export class ModalPagosComponent implements OnInit {

  pagos: Pago[] = [];

  formasPagoSelect: TablaAuxiliarDetalle[] = [];

  adelanto: number;
  total: number;
  pendiente: number;

  usuario: Usuario;

  validarFila: number = -1;
  blnAgregando: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private auxiliarService: AuxiliarService,
    private authService: AuthService,
    private cotizacionService: CotizacionService,
    private pagoService: PagoService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.usuario = this.authService.usuario;

    this.pendiente = this.config.data.pendiente;
    this.adelanto = this.config.data.adelanto;
    this.total = this.config.data.total;

    this.pagoService.getPagosByOrdenVentaId(this.config.data.id).subscribe({
      next: resPagos => {
        this.pagos = resPagos;
      }
    })

    this.auxiliarService.getListSelect('TIPPAG').subscribe({
      next: res => {
        this.formasPagoSelect = res;
      }, error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail:err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error por parte del servidor.'});
        }
      }
    })
  }

  addPago() {
    let pago: Pago = new Pago();

    pago.fechaCrea = new Date();
    pago.idUsuarioCrea = this.authService.usuario.id;
    pago.nombreUsuarioCrea = this.authService.usuario.username;
    pago.indEsAdelanto = (this.adelanto >= this.total - this.pendiente);

    this.pagos.unshift(pago);
    this.validarFila = 0;
    this.blnAgregando = true;
  }

  guardarPago(i: number) {
    if(!this.pagos[i].tipoPago) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un tipo de pago.'})
      return;
    }

    if(!this.pagos[i].monto || this.pagos[i].monto == 0) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe ingresar un monto.'})
      return;
    }

    if(this.pagos[i].monto > this.pendiente) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'El monto ingresado es mayor a la cantidad pendiente de pago.'})
      return;
    }

    this.cotizacionService.registrarPagos(this.config.data.id, this.pagos[i], this.adelanto, this.total, this.pendiente).subscribe({
      next: res => {
        this.pendiente = res.pendiente;
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Pago registrado correctamente.'})
        this.pagoService.getPagosByOrdenVentaId(this.config.data.id).subscribe({
          next: resPagos => {
            this.pagos = resPagos;
            this.blnAgregando = false;
            this.validarFila = -1;
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

  asignarFila(i: number) {
    if(this.blnAgregando) {
      return;
    }

    this.validarFila = i;
  }

  close(){
    this.ref.close()
  }

}
