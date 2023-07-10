import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuxiliarService } from 'src/app/auxiliar/auxiliar.service';
import { TablaAuxiliarDetalle } from 'src/app/auxiliar/models/tabla-auxiliar-detalle';
import { ConductorService } from 'src/app/despacho/conductor.service';
import { EmpresaTransporteService } from 'src/app/transporte/empresa-transporte.service';
import { ConductorEmpresaTransporte } from 'src/app/transporte/models/conductor-empresa-transporte';
import { EmpresaTransporte } from 'src/app/transporte/models/empresa-transporte';

@Component({
  selector: 'app-modal-ingresar-conductor',
  templateUrl: './modal-ingresar-conductor.component.html',
  styleUrls: ['./modal-ingresar-conductor.component.css']
})
export class ModalIngresarConductorComponent implements OnInit {

  tiposDocumentoSelect: TablaAuxiliarDetalle[];

  empresaTransporte: EmpresaTransporte;

  conductor: ConductorEmpresaTransporte = new ConductorEmpresaTransporte()

  blnHabilitar: boolean = false;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private auxiliarService: AuxiliarService,
    private conductorService: ConductorService,
    private empresaTransporteService: EmpresaTransporteService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.empresaTransporte = this.config.data.empresaTransporte;

    this.auxiliarService.getListSelect('TIPDOC').subscribe({
      next: res => {
        this.tiposDocumentoSelect = res;
      }
    })
  }

  guardar() {

    if(!this.conductor.tipoDocumentoIdentidad) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe seleccionar el tipo de documento de indentidad.'});
      return;
    }

    if(!this.conductor.nroDocumentoIdentidad) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar el número del documento de identidad.'});
      return;
    }

    if(!this.conductor.nombres) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar los nombres del conductor.'});
      return;
    }

    if(!this.conductor.apellidoPaterno) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar el apellido paterno del conductor.'});
      return;
    }

    if(!this.conductor.apellidoMaterno) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar el apellido materno del conductor.'});
      return;
    }

    if(!this.conductor.licencia) {
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'Debe ingresar el número de licencia del conductor.'});
      return;
    }

    this.conductor.stringBusqueda = `${this.conductor.licencia} | ${this.conductor.nombres} ${this.conductor.apellidoPaterno} ${this.conductor.apellidoMaterno}`;

    this.empresaTransporte.conductores.push(this.conductor);

    this.empresaTransporteService.createUpdate(this.empresaTransporte).subscribe({
      next: res => {
        this.ref.close(res);
      }
    });
  }

  buscarConductor() {
    this.conductor.nombres = null;
    this.conductor.apellidoPaterno = null;
    this.conductor.apellidoMaterno = null;
    this.conductor.licencia = null;

    this.conductorService.getDatosFromReniec(this.empresaTransporte.id, this.conductor.nroDocumentoIdentidad).subscribe({
      next: res => {
        this.conductor.nombres = res.nombres;
        this.conductor.apellidoPaterno = res.apellidoPaterno;
        this.conductor.apellidoMaterno = res.apellidoMaterno;
        this.conductor.licencia = `Q${this.conductor.nroDocumentoIdentidad}`;
      },error: err => {
        if(err.status == 409) {
          this.messageService.add({severity:'warn', summary:'Advertencia', detail: err.error.mensaje});
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail: 'Error con el servidor.'});
        }
      }
    })
  }

  close() {
    this.ref.close()
  }

}
